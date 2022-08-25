const mongoose = require('mongoose');

const user = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    maintainenceCalories:{type:Number}
    
},{timestamps:true})

module.exports = mongoose.model('User',user);