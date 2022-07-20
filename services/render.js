const axios = require('axios');

exports.update_quote = (req, res) =>{
    axios.get('http://localhost:3000/api/quotes', { params : { id : req.query.id }})
        .then(function(quotedata){
            console.log(req.query.id);
            res.render("update-quote", { quote : quotedata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}

