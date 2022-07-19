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

const bcrypt = require("bcryptjs")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String
    },
    companyName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type: String
    },
    userRole:{
        type: String
    },  
    phone:{
        type:String
    },
    deliveryAddress:{
        type:String
    }
}, {timestamps:true})


userSchema.pre("save", function (next) {
    const user = this
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError)
        } else {
          bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError)
            }
  
            user.password = hash
            next()
          })
        }
      })
    } else {
      return next()
    }
  })


const userModel = mongoose.model('User', userSchema)
module.exports = userModel