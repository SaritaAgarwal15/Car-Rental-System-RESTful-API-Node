const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Booking = require('../models/bookingscm');
const Cars = require("../models/car")


router.get('/', (req, res, next) => {
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
});

router.post('/', (req, res, next) => {
  Cars.findById(req.body.booked_car)
  .exec()
  .then(car => {

    const booking= new Booking({
      _id: mongoose.Types.ObjectId(),
      user_name: req.body.user_name,
      booked_car: req.body.booked_car,
      date_booking: req.body.date_booking,
      date_return: req.body.date_return
    });
  return booking
  .save()
})
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: "booking done",
      createdBooking: {
        _id: result._id,
        user_name: result.user_name,
        booked_car: result.booked_car,
        date_booking: result.date_booking,
        date_return: result.date_return
      },
      request:
      {
        type: "GET",
        url: "http://localhost:3000/booking/" + result._id
      }
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      error:error
    });
  });
});


router.get('/:bookingId', (req, res, next) => {
  Booking.findById(req.params.bookingId)
  .populate('booked_car')
  .exec()
  .then(booking => {
    if (!booking) {
      return res.status(404).json({
      message: "booking does not exist"
    });
  }
    res.status(200).json({
      booking: booking,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/booking'
      }
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      error:error
    });
});
});

router.delete('/:bookingId', (req, res, next) => {
  Booking.remove({ _id: req.params.bookingId }).exec()
  .then(result => {
    res.status(200).json({
      message: "booking deleted",
      request: {
        type: 'GET',
        url: 'http://localhost:3000/booking'
      }
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      error:error
    });

});
});

module.exports = router;
