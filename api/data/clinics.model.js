var mongoose = require('mongoose');


var clinicSchema = new mongoose.Schema({
	cnes: String,
	estabelecimento: String,
	municipio: String,
	cnpj: String,
	cnpjMantenedora: String,
	municipioIBGE: Number,
	//ALWAYS STORE COORDINATES LONGITUDE, LATITUDE
	coordinates: {
		type: [Number],
		index: '2dsphere'
	}
});


mongoose.model('Clinic', clinicSchema, 'clinicsClean');