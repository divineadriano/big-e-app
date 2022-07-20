var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/userMod');
var quoteModel = require('../models/quote');
var alert = require('alert')
var nodemailer = require('nodemailer');
const axios = require('axios');
const controller = require('../controllers/controller');
const bcrypt = require('bcryptjs');

const services = require('../services/render');
const freightChargeModel = require('../models/freight-charge');
var session = require('express-session')
 

router.use(
  session({
    secret: 'SomeSuperLongHardToGuessSecretString',
    resave: true,
    saveUninitialized: false,
  })
);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'ERA Imports Quote Portal Sign Up' });
});


router.get('/request-a-quote', function(req, res, next) {
  if(req.session.user){
    console.log(req.session.user);
    const docs = req.session.user;
    console.log(docs);
    res.render('request-a-quote', {data: docs});
  }
  else{
    res.redirect('/login');
  }
});



router.get('/quote-portal', function(req, res, next) {
  if(req.session.user){
    console.log(req.session.user);
    const docs = req.session.user;
    console.log(docs);
    res.render('quote-portal', {data: docs});
  }
  else{
    res.redirect('/login');
  }
  
});




/* Login Authentication */
router.post('/authenticate', function(req, res, next) {

  if(req.session.user){
    if(req.session.user[0].userRole === "Admin"){
      res.redirect('/admin-dashboard');
    }
    else{
      res.redirect('/quote-portal');
    }

  }
  else{
    const query = { "email": req.body.email };
  userModel.find( query, (err, docs) => {
      if (!err) {
        console.log(docs[0].password)
        var hashedPassword = docs[0].password;
            bcrypt.compare(req.body.password, hashedPassword, function (cryptErr, cryptResult) {
                if (cryptResult) {
                  req.session.user = docs;
                  req.session.save();
                  if(docs[0].userRole === "Admin"){
                    res.redirect('/admin-dashboard');
                  }
                  else{
                    res.redirect('/quote-portal');
                  }
                  
                } else {
                    res.send('Incorrect Password!');
                    console.log(cryptErr);
                }
                res.end();
            });
      }
      else {
          console.log('No user match that email address' + err);
      }
  });
  }
  
});

router.get('/login', function(req, res, next) {
  if(req.session.user){
    if(req.session.user[0].userRole === "Admin"){
      res.redirect('/admin-dashboard');
    }
    else{
      res.redirect('/quote-portal');
    }
  }
  else{
    res.render('login', { title: 'Log In' });
  }

  
});

router.post('/logout', function(req, res, next) {
  console.log(req.session.user);
  req.session.destroy();
  res.redirect('/login');
});

router.get('/admin-dashboard', function(req, res, next) {
  if(req.session.user){
    res.render('admin-dashboard', { title: 'Admin Dashboard' });
  }
  else{
    res.redirect('/login');
  }
  
});
 
router.post('/add-user', function(req, res, next) {
    var userDetails = new userModel({
      name: req.body.name,
      companyName: req.body.companyName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      deliveryAddress: req.body.deliveryAddress,
      userRole: "Customer"
    });

    userDetails.save((err, doc) => {
          if (!err){
              req.flash('success', 'User added successfully!');
              console.log('User added successfully!');
              res.redirect('/login');}
          else{
              console.log('Error during record insertion : ' + err);}
    });
});


/* Display Accepted Quotes */
router.get('/accepted-quotes', function(req, res, next) {
    
  const query = { "tag": "Accepted" };

  quoteModel.find( query, (err, docs) => {
      if (!err) {
        if(req.session.user){
          res.render('accepted-quotes', {data: docs});
        }
        else{
          res.redirect('/login');
        }  
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});

router.get('/accepted-quotes-admin', function(req, res, next) {
    
  const query = { "tag": "Accepted" };

  quoteModel.find( query, (err, docs) => {
      if (!err) {
        if(req.session.user){

          if(req.session.user[0].userRole === "Admin"){
            res.render('accepted-quotes-admin', {data: docs});
          }
          else{
            res.redirect('/login');
          }
          
        }
        else{
          res.redirect('/login');
        }  
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

        if(req.session.user){
          res.render('drafted-quotes', {data: docs});
        }   
        else{
          res.redirect('/login');
        }   
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});

router.get('/freight-charges', function(req, res, next) {
    
  freightChargeModel.find((err, docs) => {
      if (!err) {
        if(req.session.user){
          res.render('freight-charges', {data: docs});
        }
        else{
          res.redirect('/login');
        }  
                   
      } else {
          console.log('Failed to retrieve freight charges list: ' + err);
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
        if(req.session.user){
          res.render('my-quote-requests', {data: docs});
        }
        else{
          res.redirect('/login');
        }  
                   
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});

router.get('/custom-quote-requests', function(req, res, next) {
    
  const query = { "tag": "Requested" };

  quoteModel.find( query, (err, docs) => {
      if (!err) {
        if(req.session.user){

          if(req.session.user[0].userRole === "Admin"){
            res.render('custom-quote-requests', {data: docs});
          }
          else{
            res.redirect('/login');
          }
          
        }
        else{
          res.redirect('/login');
        }  
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});




router.get('/api/quotes', controller.find);

router.get('/api/freight', controller.findfreight);
router.get('/update-quote', services.update_quote);
router.get('/update-quote-admin', services.update_quote_admin);
router.get('/update-freight', services.update_freight);
router.put('/api/quote/:id', controller.update);
router.delete('/api/quote/:id', controller.delete);

/* Generate Quote */




router.post('/generate-quote', function(req, res, next) {
  
  var result = [];
  const query = { "loadingPort": req.body.loadingPort };
  var quoteprice;
  freightChargeModel.find( query, (err, docs) => {
      if (!err) {
        var airFreightRate = parseFloat(docs[0].airFreightRate);
        var cartageFromOrigin = parseFloat(docs[0].cartageFromOrigin);
        var cartageFee = parseFloat(docs[0].cartageFee);
        var ITF = parseFloat(docs[0].ITF);
        var AHF = parseFloat(docs[0].AHF);
        var localTransportCharges = parseFloat(docs[0].localTransportCharges);
        var chargeableWeight = parseFloat(req.body.chargeableWeight);
        var totalOriginCharges = parseFloat(docs[0].totalOriginCharges);
        var exchangeRate = parseFloat(docs[0].exchangeRate);

        if(docs[0].shippingMethod === "Air Freight"){
          ITF = ITF * chargeableWeight
          AHF = AHF * chargeableWeight
          cartageFee = cartageFee * chargeableWeight
          localTransportCharges = localTransportCharges + ITF + AHF + cartageFee;
          totalOriginCharges = (totalOriginCharges + (airFreightRate*chargeableWeight) + (cartageFromOrigin*chargeableWeight))*exchangeRate;

          if(req.body.incoterms === "EXW"){
            quoteprice = totalOriginCharges + ((ITF*chargeableWeight) + (AHF*chargeableWeight) + (cartageFee*chargeableWeight)) + 2000;
            console.log(quoteprice);
          }
          else{
            quoteprice = totalOriginCharges + ((ITF*chargeableWeight) + (AHF*chargeableWeight) + (cartageFee*chargeableWeight));
            console.log(quoteprice);
          }
          result.push({
            name:req.body.name,
            pickupcountry:req.body.pickupcountry,
            loadingPort: req.body.loadingPort,
            incoterms: req.body.incoterms,
            pickupAddress: req.body.pickupAddress,
            deliveryAddress: req.body.deliveryAddress,
            shippingSpeed: req.body.shippingSpeed,
            shippingMethod: req.body.shippingMethod,
            withPallet: req.body.withPallet,
            containerSize: 'not applicable',
            length: req.body.length,
            width: req.body.width,
            height: req.body.height,
            weight: req.body.weight,
            noOfBoxes: req.body.noOfBoxes,
            chargeableWeight: req.body.chargeableWeight,
            totalOriginCharges: totalOriginCharges,
            localPortCharges: '0',
            localTransportCharges: localTransportCharges,
            quoteprice: quoteprice
          });
          res.render('generated-quote', {data:result});
        }
        else{
          console.log(err);
        }
                   
      } else {
          console.log('Failed to retrieve the Course List: ' + err);
      }
  });

});

/* ACCEPT Quote*/
router.post('/accept-quote', function(req, res, next) {
    
  
  var quoteDetails = new quoteModel({
    name:req.body.name,
    pickupcountry:req.body.pickupcountry,
    loadingPort: req.body.loadingPort,
    incoterms: req.body.incoterms,
    pickupAddress: req.body.pickupAddress,
    deliveryAddress: req.body.deliveryAddress,
    shippingSpeed: req.body.shippingSpeed,
    shippingMethod: req.body.shippingMethod,
    withPallet: req.body.withPallet,
    containerSize: req.body.containerSize,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    weight: req.body.weight,
    noOfBoxes: req.body.noOfBoxes,
    chargeableWeight: req.body.chargeableWeight,
    totalOriginCharges: req.body.chargeableWeight,
    localPortCharges: req.body.localPortCharges,
    localTransportCharges: req.body.localTransportCharges,
    quoteprice: req.body.quoteprice,
    tag: "Accepted"
  });
   
  quoteDetails.save((err, doc) => {
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
    from: 'bigeimports@gmail.com',
    to: 'divine.adriano@knobin.com',
    subject: 'New Shipping Quote Accepted!',
    html: "<style>table{text-align:left;border-collapse: collapse;}th{border: 1px solid #2e3690;background:#2e3690;color:white;padding:10px;}td{padding:10px;border: 1px solid #2e3690;}</style>" +
          "<h1>New Quote Accepted</h1>" + "<p>Hello Big E Imports, A new quotation has been accepted in your system! Please check details below.</p><br><br>" +
          "<table><tr><th><b>Customer Name: </b></th>" + "<td>" +req.body.name + "</td></tr>" +
          "<tr><th><b>Pickup Country: </b></th>" + "<td>"  + req.body.pickupcountry + "</td></tr>" +
          "<tr><th><b>Loading Port: </b></th>" + "<td>"  + req.body.loadingPort + "</td></tr>" +
          "<tr><th><b>Pickup Address: </b></th>" + "<td>"  + req.body.pickupAddress + "</td></tr>" +
          "<tr><th><b>Delivery Address: </b></th>" + "<td>"  + req.body.deliveryAddress + "</td></tr>" +
          "<tr><th><b>Incoterms: </b></th>" + "<td>"  + req.body.incoterms + "</td></tr>" +
          "<tr><th><b>Shipping Method: </b></th>" + "<td>"  + req.body.shippingMethod + "</td></tr>" +
          "<tr><th><b>Shipping Speed: </b></th>" + "<td>"  + req.body.shippingSpeed + "</td></tr>" +
          "<tr><th><b>No. Of Boxes: </b></th>" + "<td>"  + req.body.noOfBoxes + "</td></tr>" +
          "<tr><th><b>Should we put your boxes in a pallet? </b></th>" + "<td>"  + req.body.withPallet + "</td></tr>" +
          "<tr><th><b>Length: </b></th>" + "<td>"  + req.body.length + "</td></tr>" +
          "<tr><th><b>Width: </b></th>" + "<td>"  + req.body.width + "</td></tr>" +
          "<tr><th><b>Height: </b></th>" + "<td>"  + req.body.height + "</td></tr>" +
          "<tr><th><b>Weight: </b></th>" + "<td>"  + req.body.weight + "</td></tr>" +
          "<tr><th><b>Origin Charges: </b></th>" + "<td>"  + req.body.totalOriginCharges + "</td></tr>" +
          "<tr><th><b>Local Port Charges: </b></th>" + "<td>"  + req.body.localPortCharges + "</td></tr>" +
          "<tr><th><b>Local Transport / Delivery Charges: </b></th>" + "<td>"  + req.body.localTransportCharges + "</td></tr>" +
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
    name:req.body.name,
    pickupcountry:req.body.pickupcountry,
    loadingPort: req.body.loadingPort,
    incoterms: req.body.incoterms,
    pickupAddress: req.body.pickupAddress,
    deliveryAddress: req.body.deliveryAddress,
    shippingSpeed: req.body.shippingSpeed,
    shippingMethod: req.body.shippingMethod,
    withPallet: req.body.withPallet,
    containerSize: req.body.containerSize,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    weight: req.body.weight,
    noOfBoxes: req.body.noOfBoxes,
    chargeableWeight: req.body.chargeableWeight,
    totalOriginCharges: req.body.totalOriginCharges,
    localPortCharges: req.body.localPortCharges,
    localTransportCharges: req.body.localTransportCharges,
    quoteprice: req.body.quoteprice,
    tag:'Drafted'
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


router.post('/update-status', function(req, res, next) {
    
  
  var quoteDetails = new quoteModel({
    name:req.body.name,
    pickupcountry:req.body.pickupcountry,
    loadingPort: req.body.loadingPort,
    incoterms: req.body.incoterms,
    pickupAddress: req.body.pickupAddress,
    deliveryAddress: req.body.deliveryAddress,
    shippingSpeed: req.body.shippingSpeed,
    shippingMethod: req.body.shippingMethod,
    withPallet: req.body.withPallet,
    containerSize: req.body.containerSize,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    weight: req.body.weight,
    noOfBoxes: req.body.noOfBoxes,
    chargeableWeight: req.body.chargeableWeight,
    totalOriginCharges: req.body.totalOriginCharges,
    localPortCharges: req.body.localPortCharges,
    localTransportCharges: req.body.localTransportCharges,
    quoteprice: req.body.quoteprice,
    tag:'Accepted',
    status: req.body.status
  });
   
  quoteDetails .save((err, doc) => {
    if (!err){
      req.flash('success', 'Quote successfully updated!');
      console.log('Quote successfully updated!');
      res.redirect('/accepted-quotes-admin');}
    else{
      console.log('Error during record insertion : ' + err);}
  });

  
});

/* REQUEST Quote*/
router.post('/request-quote', function(req, res, next) {
    
  
  var quoteDetails = new quoteModel({
    name:req.body.name,
    pickupcountry:req.body.pickupcountry,
    loadingPort: req.body.loadingPort,
    incoterms: req.body.incoterms,
    pickupAddress: req.body.pickupAddress,
    deliveryAddress: req.body.deliveryAddress,
    shippingSpeed: req.body.shippingSpeed,
    shippingMethod: req.body.shippingMethod,
    withPallet: req.body.withPallet,
    containerSize: req.body.containerSize,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    weight: req.body.weight,
    noOfBoxes: req.body.noOfBoxes,
    chargeableWeight: req.body.chargeableWeight,
    totalOriginCharges: req.body.totalOriginCharges,
    localPortCharges: req.body.localPortCharges,
    localTransportCharges: req.body.localTransportCharges,
    quoteprice: req.body.quoteprice,
    tag:'Requested'
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
    from: 'bigeimports@gmail.com',
    to: 'divine.adriano@knobin.com',
    subject: 'ERA Imports: New Personal Quote Request',
    html: "<style>table{text-align:left;border-collapse: collapse;}th{border: 1px solid #2e3690;background:#2e3690;color:white;padding:10px;}td{padding:10px;border: 1px solid #2e3690;}</style>" +
          "<h1>New Quote Request</h1>" + "<p>Hello Big E Imports, there is a new quote request in your system! Please check details below.</p><br><br>" +
          "<table><tr><th><b>Customer Name: </b></th>" + "<td>" +req.body.name + "</td></tr>" +
          "<tr><th><b>Pickup Country: </b></th>" + "<td>"  + req.body.pickupcountry + "</td></tr>" +
          "<tr><th><b>Pickup Suburb: </b></th>" + "<td>"  + req.body.pickupsuburb + "</td></tr>" +
          "<tr><th><b>Destination Country: </b></th>" + "<td>"  + req.body.destination + "</td></tr>" +
          "<tr><th><b>Incoterms: </b></th>" + "<td>"  + req.body.incoterms + "</td></tr>" +
          "<tr><th><b>Shipping Speed: </b></th>" + "<td>"  + req.body.shippingSpeed + "</td></tr>" +
          "<tr><th><b>Type of Packaging: </b></th>" + "<td>"  + req.body.packaging + "</td></tr>" +
          "<tr><th><b>No. Of Boxes: </b></th>" + "<td>"  + req.body.noOfBoxes + "</td></tr>" +
          "<tr><th><b>Length: </b></th>" + "<td>"  + req.body.length + "</td></tr>" +
          "<tr><th><b>Width: </b></th>" + "<td>"  + req.body.width + "</td></tr>" +
          "<tr><th><b>Height: </b></th>" + "<td>"  + req.body.height + "</td></tr>" +
          "<tr><th><b>Weight: </b></th>" + "<td>"  + req.body.weight + "</td></tr></table>"
  };
    
  mail.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});


/* ADD FREIGHT CHARGE */

router.post('/add-charge', function(req, res, next) {
     
   
  var freightCharges = new freightChargeModel({
    origin: req.body.origin,
    originCountry: req.body.originCountry,
    loadingPort: req.body.loadingPort,
    shippingMethod: req.body.shippingMethod,
    shippingSpeed: req.body.shippingSpeed,
    containerSize: req.body.containerSize,
    originCharges: req.body.originCharges,
    portToPortCharges: req.body.portToPortCharges,
    handlingFees: req.body.handlingFees,
    congestionFees: req.body.congestionFees,
    additionalCharges: req.body.additionalCharges,
    exchangeRate: req.body.exchangeRate,
    totalOriginCharges: req.body.totalOriginCharges,
    airFreightRate: req.body.airFreightRate,
    documentationFee: req.body.documentationFee,
    cartageFromOrigin: req.body.cartageFromOrigin,
    localPortCharges: req.body.localPortCharges,
    terminalHandlingFee: req.body.terminalHandlingFee,
    shipdocsFee: req.body.shipdocsFee,
    DOFee: req.body.DOFee,
    SeaCargoAutFee: req.body.SeaCargoAutFee,
    CMRFee: req.body.CMRFee,
    localTransportCharges: req.body.localTransportCharges,
    cartageFee: req.body.cartageFee,
    portInfraFee: req.body.portInfraFee,
    wharfSlotFee: req.body.wharfSlotFee,
    CORFee: req.body.CORFee,
    fuelSurcharge: req.body.fuelSurcharge,
    tollFee: req.body.tollFee,
    dehireFee: req.body.dehireFee,
    ITF: req.body.ITF,
    ADF: req.body.ADF,
    AHF: req.body.AHF,
    cargoReportingFee: req.body.cargoReportingFee,
    ACA: req.body.ACA,
    postage: req.body.postage,
    basefee: req.body.basefee
  });
   
  freightCharges .save((err, doc) => {
        if (!err){
            req.flash('success', 'Freight charge added successfully!');
            console.log('Freight Charge added successfully!');
            res.redirect('/freight-charges');}
        else{
            console.log('Error during record insertion : ' + err);}
  });

});


router.post('/update-charge', function(req, res, next) {
   
  const id = req.body.id;
    freightChargeModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update quote with ${id}. Maybe quote not found!`})
            }else{
              res.redirect('/freight-charges');
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Updating quote information"})
        })

        
});
module.exports = router;