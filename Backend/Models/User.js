const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name:{type:String},
    email:{type:String , unique:true},
    googleId:{type:String},
    avatar:{type:String},
    provider:{type:String},
    bloodGroup:{type:String},
    password:{type:String},
    location:{
        
            longitude: {type:Number},
            latitude : {type:Number}
        
    },
    pushToken : {type: String}
});

module.exports= mongoose.model('User' , userSchema);