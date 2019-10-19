const Booking = require('../models/bookingscm');
exports.booking_get_all =  (req, res, next) => {
    Booking.find()
    .populate('booked_car')
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error:error
      });
    });
  }
