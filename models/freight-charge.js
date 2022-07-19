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

const freightChargeSchema = new Schema({
    origin:{
        type:String
    },
    originCountry:{
        type:String
    },
    originPort:{
        type:String
    },
    originAirport:{
        type:String
    },
    shippingMethod:{
        type:String
    },
    shippingSpeed:{
        type:String
    },
    containerSize:{
        type:String
    },
    originCharges:{
        type: String,
        default:"0"
    },
    portToPortCharges:{
        type: String,
        default:"0"
    },
    handlingFees:{
        type: String,
        default:"0"
    },
    congestionFees:{
        type: String,
        default:"0"
    },
    additionalCharges:{
        type: String,
        default:"0"
    },
    exchangeRate:{
        type: String,
        default:"0"
    },
    totalOriginCharges:{
        type: String,
        default:"0"
    },
    airFreightRate:{
        type: String,
        default:"0"
    },
    documentationFee:{
        type: String,
        default:"0"
    },
    cartageFromOrigin:{
        type: String,
        default:"0"
    },
    localPortCharges:{
        type: String,
        default:"0"
    },
    terminalHandlingFee:{
        type: String,
        default:"0"
    },
    shipdocsFee:{
        type: String,
        default:"0"
    },
    DOFee:{
        type: String,
        default:"0"
    },
    SeaCargoAutFee:{
        type: String,
        default:"0"
    },
    CMRFee:{
        type: String,
        default:"0"
    },
    localTransportCharges:{
        type: String,
        default:"0"
    },
    cartageFee:{
        type: String,
        default:"0"
    },
    portInfraFee:{
        type: String,
        default:"0"
    },
    wharfSlotFee:{
        type: String,
        default:"0"
    },
    CORFee:{
        type: String,
        default:"0"
    },
    fuelSurcharge:{
        type: String,
        default:"0"
    },
    tollFee:{
        type: String,
        default:"0"
    },
    dehireFee:{
        type: String,
        default:"0"
    },
    ITF:{
        type: String,
        default:"0"
    },
    ADF:{
        type: String,
        default:"0"
    },
    AHF:{
        type: String,
        default:"0"
    },
    cargoReportingFee:{
        type: String,
        default:"0"
    },
    ACA:{
        type: String,
        default:"0"
    },
    postage:{
        type: String,
        default:"0"
    },
    basefee:{
        type: String,
        default:"0"
    }

}, {timestamps:true})

const freightChargeModel = mongoose.model('freightCharge', freightChargeSchema)
module.exports = freightChargeModel