const User = require("../module/User")
const FoodDetail = require("../module/FoodDetail")
const UserHistory = require('../module/UserHistory')
const {ERRORMSG}  = require("../utils/errorMsg")
const {DateCreator} = require('../utils/utils')
const createUser = async (req,res) =>{
    try {
        const {name,MainCalories,MainCarb,MainProtein,MainFat} = req.body
    
        if(!name|| !MainCalories || !MainCarb || !MainProtein || !MainFat){
            return res.status(400).send(ERRORMSG.missingParam)
        }
        const userExist = await User.find({name})
        if(userExist.length !=0){
            return res.status(400).send({msg:"username already exists"})
        }

        const user = await User.create({
            name,
            MainCalories,
            MainCarb,
            MainProtein,
            MainFat
        })
        res.status(200).send({msg:'user created'}) 
    } catch (error) {
        
        console.log(error.message)
        res.status(400).send(ERRORMSG.error)
    }
}

const getAllFoodFromDb = async (req,res)=>{
    try {
        
        const data = await FoodDetail.find({})

        if(!data){
            return res.status(400).send({msg:"something went wrong"})
        }

        return res.status(200).send({msg:"successful",data})

    } catch (error) {
         console.log(error.message)
        res.status(400).send(ERRORMSG.error)
    }
}

const addFoodToDb = async(req,res)=>{
    try {
        const {name,calories,protein,carb,fat} = req.body
        
        if(!name || !calories || !protein || !carb || !fat){

            return res.status(400).send(ERRORMSG.missingParam)
        }

        const foodExist = await FoodDetail.findOne({name})
        
        if(foodExist){
            return res.status(400).send({msg:'food already exist'})
        }

        const food = await FoodDetail.create({
            name,
            calories,
            protein,
            carb,
            fat
        })

        return res.status(200).send({msg:'food added'})

        
    } catch (error) {
        console.log(error)
        return res.status(400).send(ERRORMSG.error)
    }
}

const deleteFoodFromDb = async (req,res)=>{
    try {

        const {foodId} = req.body

        if(!foodId){
            return res.status(400).send(ERRORMSG.missingParam)
        }

        const foodExist = await FoodDetail.findById(foodId)
        
        if(!foodExist){
            return res.status(400).send({msg:'food does not exist'})
        }
        const delFood = await FoodDetail.findByIdAndDelete(foodId)

        if(!delFood){
            return res.status(400).send({msg:'food could not be deleted'})
        }

        return res.status(200).send({msg:'food deleted'})
        
    } catch (error) {
         console.log(error)
        return res.status(400).send(ERRORMSG.error)
    }
}

const updateFoodFromDb = async (req,res) =>{

    try {
        
        const {foodId,name,calories,protein,carb,fat} = req.body

        if(!foodId){
            return res.status(400).send(ERRORMSG.missingParam)
        }

        const foodExist = await FoodDetail.findById(foodId)

        if(!foodExist){
            return res.status(400).send({msg:'food does not exist'})
        }

        const newfood = await FoodDetail.findByIdAndUpdate(foodId,{
            name:!name?foodExist.name:name ,
            calories : !calories?foodExist.calories:calories,
            protein: !protein ? foodExist.protein:protein,
            carb : !carb?foodExist.carb:carb,
            fat: !fat? foodExist.fat : fat
        },{new:true})

        return res.status(200).send({msg:'food updated'})

    } catch (error) {
        console.log(error)
        return res.status(400).send(ERRORMSG.error)
    }
}

const addFoodToUserHistory = async (req,res)=>{
    try {
       
        const {userId,name,calories,carb,protein,fat,foodType,grams} = req.body
        var userhistory =null;


        if(!userId || !name || !calories || !protein || !fat || !foodType){
            // return res.send("missins")
            return res.status(400).send(ERRORMSG.missingParam)
        }
        
        userhistory = await UserHistory.findOne({userId,date: DateCreator()})
        // console.log(userhistory)
        
        if(!userhistory){
            console.log("runnn")
            userhistory =  await UserHistory.create({userId,date:DateCreator()})

        }

        if(!userhistory){
                return res.status(400).send({msg:"something went wrongddddd"})
        }

        console.log(userhistory)
       

        const addFood = await UserHistory.findByIdAndUpdate(userhistory._id,{
            $push : {foodConsumed:{
                                foodType:foodType,
                                foodName:name,
                                gramsConsumed:grams,
                                caloriesConsumed:calories,
                                proteinConsumed:protein,
                                carbConsumed:carb,
                                fatConsumed:fat
                                }
                    },
            statOfDay : {
                calories:userhistory.statOfDay.calories+calories,
                carb:userhistory.statOfDay.carb+carb,
                protein:userhistory.statOfDay.protein+protein,
                fat:userhistory.statOfDay.fat+fat
            }
            
        },{new:true})




        res.status(200).send({msg:"successful",data:addFood})
        
    } catch (error) {
         console.log(error)
        return res.status(400).send(ERRORMSG.error)
    }
}


const removeFoodFromUserHistory = async (req,res)=>{
        try {
            const {userId,logId} = req.body

            if(!logId){
                return res.status(400).send(ERRORMSG.missingParam)
            }

            const userhistory = await UserHistory.findOne({userId,date:DateCreator()})

    

            if(!userhistory){
                return res.status(400).send({msg:"could not delete record"})
            }

            var foodConsumed;
           

            userhistory.foodConsumed.map((food)=>{
                if(JSON.stringify(logId) == JSON.stringify(food._id)){
                    foodConsumed = food
                }
            })

            if(!foodConsumed){
                return res.status(400).send({msg:"could not find record"})
            }

            console.log(foodConsumed)


            const data = await UserHistory.findByIdAndUpdate(userhistory._id,{
                $pull : {foodConsumed:{_id:logId}},
                
                statOfDay : {
                    calories:userhistory.statOfDay.calories-foodConsumed.caloriesConsumed,
                    carb:userhistory.statOfDay.carb-foodConsumed.carbConsumed,
                    protein:userhistory.statOfDay.protein-foodConsumed.proteinConsumed,
                    fat:userhistory.statOfDay.fat-foodConsumed.fatConsumed
            }

            },{new:true})


            return res.status(200).send({msg:'successful',data})

        } catch (error) {
            console.log(error)
            return res.status(400).send(ERRORMSG.error)
        }
}


const getDayStats = async (req,res)=>{
    try {
        
        const userId = req.params.id
        var userhistory =null;

        if(!userId){
            return res.status(400).send(ERRORMSG.missingParam)
        }
        userMaintainence = await User.findById(userId)
        userhistory = await UserHistory.findOne({userId,date: DateCreator()})
        
        if(!userhistory){
            console.log("runnn")
            userhistory =  await UserHistory.create({userId,date:DateCreator()})

        }

        if(!userhistory){
                return res.status(400).send({msg:"something went wrong"})
        }

        var {foodConsumed,statOfDay,date,_id} = userhistory

        var newFoodConsumed = {
            breakfast:[],
            lunch:[],
            dinner:[]
        }
        foodConsumed.map((food)=>{
            newFoodConsumed[food.foodType].push(food)
        })       
     
        const mainData = {
            calories : userMaintainence.MainCalories,
            carb:userMaintainence.MainCarb,
            protein:userMaintainence.MainProtein,
            fat:userMaintainence.MainFat
        }

        const data = {
            foodConsumed : newFoodConsumed,
            statOfDay,
            mainData,
            date,
            _id
        }
        return res.status(200).send({status:200,msg:"success",data:data})

    } catch (error) {
        console.log(error)
        return res.status(400).send(ERRORMSG.error)
    }
}




const test = async(req,res)=>{

    try {
        
        res.status(200).send({msg:"workinggggg"})

    } catch (error) {
        console.log(error)
        return res.status(400).send(ERRORMSG.error)
    }
}

module.exports = {createUser,addFoodToDb,deleteFoodFromDb,updateFoodFromDb,addFoodToUserHistory,removeFoodFromUserHistory,getDayStats,getAllFoodFromDb,test}