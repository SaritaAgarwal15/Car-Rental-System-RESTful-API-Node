const mongoose = require('mongoose');
const bookingSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_name: {type: String},
  booked_car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true},
  date_booking: Date,
  date_return: Date
});

module.exports = mongoose.model('Booking', bookingSchema);
