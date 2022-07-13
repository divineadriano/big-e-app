var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const Customer = require('../models/Customer')
 
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'add user' });
});
 
router.post('/add-user', function(req, res, next) {
     
  //req.check('name', 'Name is required').notEmpty()           //Validate name
  // req.check('email', 'A valid email is required').isEmail()  //Validate email
  
 // var validationErrors = req.validationErrors();
     
   // if( !validationErrors ) {   //No errors were found.  Passed Validation!
         
     
      var customerDetails = new Customer({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,

      });
       
      customerDetails .save((err, doc) => {
            if (!err){
                req.flash('success', 'User added successfully!');
                res.redirect('/');}
            else{
                console.log('Error during record insertion : ' + err);}
      });
   
  //  }
  //  else {   //Display errors to user
   //     var error_msg = ''
    //    errors.forEach(function(error) {
    //        error_msg += error.msg + '<br>'
     //   })                
     //   req.flash('error', error_msg)        
         
      //  res.render('/', { 
       //     title: 'Add New User',
        //    name: req.body.name,
        //    email: req.body.email
      //  })
  //  }
});
    
module.exports = router;
