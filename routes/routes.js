var express = require('express');
var router = express.Router();
var IpAddress = require('./../models/ipaddress');

router.get('/', function (req, res, next) {
	res.status(400).send('');
});

router.get('/:name', function (req, res, next) {
	var name = req.params.name;
	
	IpAddress.findOne({name : name})
		.then((doc) => {
			if (!doc) {
				return res.status(404).send('Address could not be found');
			}
			
			res.send(doc.address);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

router.put('/:name', function (req, res, next) {
	var name = req.params.name;
	var secret = req.body.secret;
	var requestAddress = req.headers['x-forwarded-for'];
	
	if (requestAddress) {
		var ips = requestAddress.split(',');
		requestAddress = ips[0];
	}
	else {
		requestAddress = req.connection.remoteAddress;
	}
	
	if (secret !== process.env.IP_SECRET) {
		return res.status(403).send('None shall pass!');
	}
	
	IpAddress.findOneAndUpdate({name : name}, {$set : {name: name, address: requestAddress}}, {upsert: true, new: true})
		.then((doc) => {
			res.json(doc);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});



module.exports = router;
