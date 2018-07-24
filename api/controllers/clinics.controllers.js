var mongoose = require('mongoose');
var Clinic = mongoose.model('Clinic');
var tableify = require('tableify')
var R = require('ramda')

var runGeoQuery = function(req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	//A geoJSON point
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	var geoOptions = {
		spherical: true,
		maxDistance: 20000,
		num: 200
	};
	Clinic.
		geoNear(point, geoOptions, function(err, results, stats){
			/*console.log(err)
			console.log('Geo results', results)
			console.log('Geo stats', stats);*/
			let response = [];
			results.forEach(function(result){
				let responseObj = result.obj._doc
				
				response.push({
					dis: result.dis,
					estabelecimento: responseObj.estabelecimento,
					rua: responseObj.clinicRegister.logradouro,
					numero: responseObj.clinicRegister.numero,
					bairro: responseObj.clinicRegister.bairro,
					coordinates: responseObj.coordinates,
					tipoEstabelecimento: responseObj.clinicRegister.tipoEstabelecimento,
					especialidades: Object.keys(responseObj.clinicProfessionals).reduce(function(total, current){
						return  responseObj.clinicProfessionals[current]['CBO']+ ", "  + total 
					},"")
				});
			});



			res
				.status(200)
				.send(tableify(R.pipe(
				R.map(res => {
					return {
						Distancia:  Math.round(res.dis),
						Estabelecimento: res.estabelecimento.toLowerCase(),
						Rua: res.rua.toLowerCase(),
						Numero: res.numero,
						Bairro: res.bairro.toLowerCase(),
						tipoEstabelecimento: res.tipoEstabelecimento.toLowerCase(),
						Especialidades: res.especialidades.toLowerCase()
					}
				})
			)(response)));
		});
};


module.exports.clinicsGetAll = function(req, res) {

	var offset = 0;
	var count = 5;

	if (req.query && req.query.lat && req.query.lng) {
		runGeoQuery(req, res)
		return;
	}

	if (req.query && req.query.offset) {
		offset = parseInt(req.query.offset, 10);
	}

	if (req.query && req.query.count) {
		count = parseInt(req.query.count, 10);
	}

	Clinic
		.find()
		.skip(offset)
		.limit(count)
		.exec(function(err, clinics) {
			console.log('Found clinics', clinics.length);
			res.json(clinics);
		});
};

/*module.exports.hotelsGetOne = function(req, res) {

	var hotelId = req.params.hotelId;

	Hotel
		.findById(hotelId)
		.exec(function(err, hotel) {
			res.json(hotel);
		});
};

module.exports.hotelsAddOne = function(req, res) {
	var db = dbconn.get();
	var collection = db.collection('hotels');
	var newHotel;

	console.log("POST new hotel");

	if (req.body && req.body.name && req.body.stars) {
		newHotel = req.body;
		newHotel.stars = parseInt(req.body.stars, 10)

		console.log(newHotel);

		collection.insertOne(newHotel, function(err, response) {
			console.log(response.ops);
			res
				.status(201)
				.json(response.ops);
		});
	} else {
		console.log('Data missing form body');
		res
			.status(400)
			.json({
				message: 'Required data missing from body'
			})
	}
};*/