const User=require("../models/user")
const passport=require("passport")

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.saveSignupInfo=async (req,res)=>{
    try{
    let {username,email,password}=req.body
    let newuser=new User({username,email,password})
    let registeredUser=await User.register(newuser,password) 

    //automatic login after signup

    req.login(registeredUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome")
        res.redirect("/listings")
    })
    
    
}
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}
module.exports.saveLoginInfo=async (req,res)=>{
    req.flash("success","Welcome back! You are logged in")
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl)
    }
    else {
        res.redirect("/listings")
    }
    
}
module.exports.logoutUser=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","You are now logged out")
        res.redirect("/listings")
    })
}