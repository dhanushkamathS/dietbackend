const mongoose = require('mongoose');

const FoodDetail = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    calories:{type:Number},
    protein:{type:Number},
    carb:{type:Number},
    fat:{type:Number},
    
},{timestamps:true})

module.exports = mongoose.model('FoodDetail',FoodDetail);