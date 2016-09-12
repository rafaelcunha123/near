var express = require('express');
var router = express.Router();

var ctrClinics = require('../controllers/clinics.controllers.js');

router
	.route('/clinics')
	.get(ctrClinics.clinicsGetAll);

/*router
	.route('/hotels/:hotelId')
	.get(ctrHotels.hotelsGetOne);

router
	.route('/hotels/new')
	.post(ctrHotels.hotelsAddOne);

// Review routes
router
	.route('/hotels/:hotelId/reviews')
	.get(ctrReviews.reviewsGetAll);

router
	.route('/hotels/:hotelId/reviews/:reviewId')
	.get(ctrReviews.reviewsGetOne);
*/

module.exports = router;