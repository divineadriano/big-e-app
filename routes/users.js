var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../models/userMod');
var nodemailer = require('nodemailer');
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'add user' });
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
        text: 'That was easy!'
      };
        
      mail.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
});





router.post('/get-quote', function(req, res, next){


})
 
module.exports = router;