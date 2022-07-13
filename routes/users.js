var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/userMod');
var quoteModel = require('../models/quote');
var nodemailer = require('nodemailer');
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'add user' });
});

router.get('/quote-portal', function(req, res, next) {
  res.render('quote-portal', { title: 'Quote Portal' });
});

 
router.post('/add-user', function(req, res, next) {
     
   
      var userDetails = new userModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
      });
       
      userDetails .save((err, doc) => {
            if (!err){
                req.flash('success', 'User added successfully!');
                console.log('User added successfully!');
                res.redirect('/');}
            else{
                console.log('Error during record insertion : ' + err);}
      });
   
      var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'divinegraceguballa@gmail.com',
      pass: 'itkantjlwvivbotg'
        }
      });

      var mailOptions = {
        from: 'divinegadriano@gmail.com',
        to: 'adrianodivine@gmail.com',
        subject: 'Sending Email via Node.js',
        text: req.body.name
      };
        
      mail.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
});



/* GET users */
router.get('/accepted-quotes', function(req, res, next) {
    
  
  quoteModel.find((err, docs) => {
      if (!err) {
          res.render('accepted-quotes', {data: docs});
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});


router.get('/list', function(req, res, next) {
    
  
  userModel.find((err, docs) => {
      if (!err) {
          res.render('list', {data: docs});
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});

/* GET users */
router.post('/accept-quote', function(req, res, next) {
    
  
  var quoteDetails = new quoteModel({
    name: req.body.name,
    pickupcountry: req.body.pickupcountry,
    pickupsuburb: req.body.pickupsuburb,
    destination: req.body.destination,
    incoterms: req.body.incoterms,
    shippingspeed: req.body.shippingspeed,
    packaging: req.body.packaging,
    noOfBoxes: req.body.noOfBoxes,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    weight: req.body.weight,
    quoteprice: req.body.quoteprice
  });
   
  quoteDetails .save((err, doc) => {
        if (!err){
            req.flash('success', 'Quote Accepted!');
            console.log('Quote Accepted!');
            res.redirect('/list');}
        else{
            console.log('Error during record insertion : ' + err);}
  });

  var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'divinegraceguballa@gmail.com',
  pass: 'itkantjlwvivbotg'
    }
  });

  var mailOptions = {
    from: 'divinegadriano@gmail.com',
    to: 'adrianodivine@gmail.com',
    subject: 'New Shipping Quote Accepted!',
    text: 'Quote Accepted\n' + req.body.name + '\r\n\r\n' +
          req.body.pickupcountry + '\r\n\r\n' +
          req.body.pickupsuburb + '\r\n\r\n' +
          req.body.destination + '\r\n\r\n' +
          req.body.incoterms + '\r\n\r\n' +
          req.body.shippingspeed + '\r\n\r\n' +
          req.body.packaging + '\r\n\r\n' +
          req.body.noOfBoxes + '\r\n\r\n' +
          req.body.length + '\r\n\r\n' +
          req.body.width + '\r\n\r\n' +
          req.body.height + '\r\n\r\n' +
          req.body.weight + '\r\n\r\n' +
          req.body.quoteprice + '\r\n\r\n' 
  };
    
  mail.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

 
module.exports = router;