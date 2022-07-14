const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://knobin:Sony786@big-e-app.aefg0zy.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;

const Schema = mongoose.Schema

const quoteSchema = new Schema({
    name:{
        type:String
    },
    pickupcountry:{
        type:String
    },
    pickupsuburb:{
        type:String
    },
    destination:{
        type:String
    },
    incoterms:{
        type:String
    },
    shippingspeed:{
        type:String
    },
    shippingmethod:{
        type:String
    },
    packaging:{
        type:String
    },
    length:{
        type:Number
    },
    width:{
        type:Number
    },
    height:{
        type:Number
    },
    weight:{
        type:Number
    },
    noOfBoxes:{
        type:Number
    },
    quoteprice:{
        type:Number
    },
    tag:{
        type:String,
        default:"Drafted"
    },
    status:{
        type:String
    }

}, {timestamps:true})

const quoteModel = mongoose.model('Quote', quoteSchema)
module.exports = quoteModel