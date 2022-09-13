const express = require("express");
const router = express.Router();
const{createUser,addFoodToDb,deleteFoodFromDb,updateFoodFromDb,addFoodToUserHistory,removeFoodFromUserHistory,getDayStats,getAllFoodFromDb,test,getUserId} = require('../controller/api')

router.post("/create-user",createUser)
router.post("/get-user",getUserId)

router.get("/db-food",getAllFoodFromDb)
router.post("/db-food",addFoodToDb)
router.delete("/db-food",deleteFoodFromDb)
router.patch("/db-food",updateFoodFromDb)

router.post("/user-food",addFoodToUserHistory)
router.delete("/user-food",removeFoodFromUserHistory)

router.get("/day-stats/:id",getDayStats)

router.get("/test",test)

module.exports = router;