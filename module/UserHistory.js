const mongoose = require('mongoose');

const UserHistory = mongoose.Schema({
   userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
   },
   date:{type:String},
   statOfDay:{
       calories:{type:Number,default:0},
       carb:{type:Number,default:0},
       protein:{type:Number,default:0},
       fat:{type:Number,default:0}
   },
   foodConsumed:[{
       foodType:{
            type: String,
            enum : ['breakfast','lunch','dinner'],
            default: 'breakfast'
        },
       foodName:{type:String},
       gramsConsumed:{type:Number},
       caloriesConsumed:{type:Number},
       proteinConsumed:{type:Number},
       carbConsumed:{type:Number},
       fatConsumed:{type:Number}
   }]
    
},{timestamps:true})

module.exports = mongoose.model('UserHistory',UserHistory);