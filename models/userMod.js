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

const userSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    address:{
        type:String
    }
}, {timestamps:true})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel