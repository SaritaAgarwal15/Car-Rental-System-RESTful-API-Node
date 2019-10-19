const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


const carRoutes = require('./api/routes/cars');
const bookingRoutes = require('./api/routes/booking');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://srtagarwal15:srt1502agarwal@whitepanda-assignment-task-egfoj.mongodb.net/test?retryWrites=true&w=majority',{
  useNewUrlParser: true
});

app.use(morgan('dev'));

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

var db = mongoose.connection;
db.on('error', function (err) {
    throw err
});
db.once("open", ()=> {
	console.log("--- Connected to DB --- ");
})

app.get('/',function(req,res){
	res.set('Content-Type', 'text/html');
	res.send(new Buffer('<h1 style="font-family: Arial; color: #000000;" > <center> Open postman to test this RESTful API </h3> <center> <a href="https://www.getpostman.com/collections/7daf09dc9a4d8c77d40b" > POST COLLECTION LINK. </a> </h1> <H2 > Welcome!! </h2> '));

})

//for handling CORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});


app.use('/cars', carRoutes);
app.use('/booking', bookingRoutes);
app.use('/users', userRoutes);


app.use((req, res, next) => {
  const error = new Error('not found');
  error.status=404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;
