const express=require("express")
const router=express.Router()
const User=require("../models/user")
const passport=require("passport")
const wrapAsync=require("../utils/wrapAsync")
const {saveRedirectUrl}=require("../middleware")
const userController=require("../controllers/user")

//USER ROUTES:

//SIGNUP
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.saveSignupInfo))

//LOGIN
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(userController.saveLoginInfo))

//LOGOUT
router.get("/logout",userController.logoutUser)



module.exports=router