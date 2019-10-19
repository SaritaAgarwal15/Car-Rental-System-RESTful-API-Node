const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth_middleware = require('../route_protection/auth_middleware');

const Car = require('../models/car');

router.get('/', (req, res, next) => { //to get all the cars we have
  Car.find()
  .exec()
  .then(docs => {
    const response = {
        count: docs.length,
        cars: docs
    };
    res.status(200).json(response)
  })
  .catch(error =>{
    console.log(error);
    res.status(500).json({
      error:error
    });
    });
});

router.post('/', auth_middleware, (req, res, next) => {
  const car = new Car({
    _id: new mongoose.Types.ObjectId(),
    car_name: req.body.car_name,
    vehicle_number: req.body.vehicle_number,
    seating_capacity: req.body.seating_capacity,
    PerDay_rent : req.body.PerDay_rent,
    availability_status : req.bosy.availability_status
  });
  car.save().then(result =>{
    console.log(result);
    res.status(201).json({
      meassage: 'Handling POST request',
      createdCar: result
    });
  })
  .catch(error =>{
    console.log(error);
    res.status(500).json({
      error:error
    });
  });

});

router.get('/:carId', (req, res, next) => {
    const id = req.params.carId;
    Car.findById(id).exec().then(doc =>{
      console.log("from DB", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({message: 'No valid entry'});
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: error});
    });
});

router.patch('/:carId', (req, res, next) => {
  const id = req.params.carId;
  const updateOps = {};
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Car.update({_id: id}, {$set: updateOps}).exec().then(result =>{
    console.log(result);
    res.status(200).json(result);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error: error});
  });
});

router.delete('/:carId', (req, res, next) => {
  const id = req.params.carId;
  Car.remove({_id: id}).exec().then(result => {
    res.status(200).json(result);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error: error});
  });
});
module.exports = router;
