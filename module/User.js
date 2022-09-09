const mongoose = require('mongoose');

const user = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    MainCalories:{type:Number},
    MainCarb:{type:Number,},
    MainProtein:{type:Number},
    MainFat:{type:Number}
    
    
},{timestamps:true})

module.exports = mongoose.model('User',user);