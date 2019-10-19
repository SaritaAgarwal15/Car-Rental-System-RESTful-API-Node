const mongoose = require('mongoose');
const carSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  car_name: String,
  vehicle_number: String,
  seating_capacity: Number,
  PerDay_rent : Number,
  availability_status : String
});

module.exports = mongoose.model('Car', carSchema);
