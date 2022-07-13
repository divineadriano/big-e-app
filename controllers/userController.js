const Customer = require('../models/Customer')

//Show the list of Employees
const index = (req, res, next) => {
    Customer.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error =>{
        res.json({
            message: 'An error occured!'
        })
    })
}


const show = (req, res, next) => {
    let customerID = req.body.customerID
    Customer.findById(customerID)
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

//save a customer

const store = (req, res, next) => {
    let customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    })
    customer.save()
    .then(reponse => {
        res.json({
            message: 'Customer added successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

//update a customer

const update = (req, res, next) => {
    let customerID = req.body.customerID

    let updatedData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    }

    Customer.findByIdAndUpdate(customerID, {$set:updatedData})
    .then(() => {
        res.json({
            message: 'Customer updated successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

//delete a customer

const destroy = (req, res, next) => {
    let customerID = req.body.customerID
    Customer.findByIdAndRemove(customerID)
    .then(() => {
        res.json({
            message: 'Customer deleted successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

module.exports = {
    index,show,store,update,destroy
}