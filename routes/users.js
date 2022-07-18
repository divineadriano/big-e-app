var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/userMod');
var quoteModel = require('../models/quote');
var alert = require('alert')
var nodemailer = require('nodemailer');
const axios = require('axios');
const controller = require('../controllers/controller');
const services = require('../services/render');
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('quote-portal', { title: 'add user' });
});

router.get('/quote-portal', function(req, res, next) {
  res.render('quote-portal', { title: 'Quote Portal' });
});

router.get('/request-a-quote', function(req, res, next) {
  res.render('request-a-quote', { title: 'Request Persona Quotation' });
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



/* Display Accepted Quotes */
router.get('/accepted-quotes', function(req, res, next) {
    
  const query = { "tag": "Accepted" };
  quoteModel.find( query, (err, docs) => {
      if (!err) {
        res.render('accepted-quotes', {data: docs});
        
               
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

  
  

});

/* Display Drafted Quotes */
router.get('/drafted-quotes', function(req, res, next) {
    
  const query = { "tag": "Drafted" };
  quoteModel.find( query, (err, docs) => {
      if (!err) {
        res.render('drafted-quotes', {data: docs});           
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


/* Display Request Quotes User */
router.get('/my-quote-requests', function(req, res, next) {
    
  const query = { "tag": "Requested" };
  quoteModel.find( query, (err, docs) => {
      if (!err) {
        res.render('my-quote-requests', {data: docs});           
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});




router.get('/api/quotes', controller.find);
router.get('/update-quote', services.update_quote);

/* ACCEPT Quote*/
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
    quoteprice: req.body.quoteprice,
    tag: "Accepted"
  });
   
  quoteDetails .save((err, doc) => {
        if (!err){
          req.flash('success', 'Quote saved successfully!');
            console.log('Quote Accepted!');
            res.redirect('/accepted-quotes');}
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
    to: 'divine.adriano@knobin.com',
    subject: 'New Shipping Quote Accepted!',
    html: "<style>table{text-align:left;border-collapse: collapse;}th{border: 1px solid #2e3690;background:#2e3690;color:white;padding:10px;}td{padding:10px;border: 1px solid #2e3690;}</style>" +
          "<h1>New Quote Accepted</h1>" + "<p>Hello Big E Imports, A new quoation has been accepted in your system! Please check details below.</p><br><br>" +
          "<table><tr><th><b>Customer Name: </b></th>" + "<td>" +req.body.name + "</td></tr>" +
          "<tr><th><b>Pickup Country: </b></th>" + "<td>"  + req.body.pickupcountry + "</td></tr>" +
          "<tr><th><b>Pickup Suburb: </b></th>" + "<td>"  + req.body.pickupsuburb + "</td></tr>" +
          "<tr><th><b>Destination Country: </b></th>" + "<td>"  + req.body.destination + "</td></tr>" +
          "<tr><th><b>Incoterms: </b></th>" + "<td>"  + req.body.incoterms + "</td></tr>" +
          "<tr><th><b>Shipping Speed: </b></th>" + "<td>"  + req.body.shippingspeed + "</td></tr>" +
          "<tr><th><b>Type of Packaging: </b></th>" + "<td>"  + req.body.packaging + "</td></tr>" +
          "<tr><th><b>No. Of Boxes: </b></th>" + "<td>"  + req.body.noOfBoxes + "</td></tr>" +
          "<tr><th><b>Length: </b></th>" + "<td>"  + req.body.length + "</td></tr>" +
          "<tr><th><b>Width: </b></th>" + "<td>"  + req.body.width + "</td></tr>" +
          "<tr><th><b>Height: </b></th>" + "<td>"  + req.body.height + "</td></tr>" +
          "<tr><th><b>Weight: </b></th>" + "<td>"  + req.body.weight + "</td></tr>" +
          "<tr><th><b>Quotation Price </b></th>" + "<td>"  + req.body.quoteprice + "</td></tr></table>"
   
  };
    
  mail.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});


/* Save Quote*/
router.post('/save-quote', function(req, res, next) {
    
  
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
    quoteprice: req.body.quoteprice,
    tag: "Drafted"
  });
   
  quoteDetails .save((err, doc) => {
        if (!err){
          req.flash('success', 'Quote saved in drafts!');
            console.log('Quote saved in drafts!');
            res.redirect('/drafted-quotes');}
        else{
            console.log('Error during record insertion : ' + err);}
  });

  
});


/* REQUEST Quote*/
router.post('/request-quote', function(req, res, next) {
    
  
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
    quoteprice: 0,
    tag: "Requested"
  });
   
  quoteDetails .save((err, doc) => {
        if (!err){
          req.flash('success', 'Quote request sent!');
            console.log('Quote Request Sent!');
            res.redirect('/my-quote-requests');}
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
    subject: 'ERA Imports: New Personal Quote Request',
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
          req.body.weight + '\r\n\r\n'
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