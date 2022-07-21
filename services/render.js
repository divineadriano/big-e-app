const axios = require('axios');

var mongodb = require('mongodb');


exports.update_quote = (req, res) =>{
    axios.get('http://localhost:3000/api/quotes', { params : { id : req.query.id }})
        .then(function(quotedata){
            console.log(req.query.id);
            console.log(quotedata.data);
            res.render("update-quote", { quote : quotedata.data})

        })
        .catch(err =>{
            res.send(err);
        })
}


exports.update_quote_admin = (req, res) =>{
    axios.get('http://localhost:3000/api/quotes', { params : { id : req.query.id }})
        .then(function(quotedata){
            console.log(req.query.id);
            console.log(quotedata.data);
            res.render("update-quote-admin", { quote : quotedata.data})

        })
        .catch(err =>{
            res.send(err);
        })
}

exports.update_freight = (req, res) =>{
    axios.get('http://localhost:3000/api/freight', { params : { id : req.query.id }})
        .then(function(freightdata){
            console.log(req.query.id);
            console.log(freightdata.data);
            res.render("update-freight-charge", { freight : freightdata.data})

        })
        .catch(err =>{
            res.send(err);
        })
}

