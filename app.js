if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const dbUrl=process.env.ATLASDB_URL
const MongoStore = require('connect-mongo');


const express=require("express")
const app=express() 
const path=require("path")
const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user")
// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*3600
// })
// store.on("error",(err)=>{
//     console.log("Error in Mongo Session store",err)
// })
const sessionOptions={
   // store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}


app.use(session(sessionOptions))
app.use(flash())

//PassPort Middlewares
app.use(passport.initialize())
app.use(passport.session()); //to maintain session for a user
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser()) //to store user info into session
passport.deserializeUser(User.deserializeUser()) //to destore user info


app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.del=req.flash("del")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user     //to user req.user in navbar.ejs
    next()
})

const expressError=require("./utils/expressError.js")
const methodOverride=require('method-override')

const ejsMate=require('ejs-mate')
app.set("views",path.join(__dirname,"/views"))
app.set('view engine', 'ejs');
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")))



app.engine('ejs', ejsMate);
const mongoose = require('mongoose');
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()  
.then((res)=>{
    console.log("connection with 'wanderlust' successful")
})
.catch((err)=>{
    console.log("Cant connect with db")
})

app.listen(8080,(req,res)=>{
    console.log("server started at port 8080")
})




//All Listing routes
app.use("/listings",listingRouter)
//Reviews routes
app.use("/listings/:id/reviews",reviewRouter)
//User routes
app.use("/",userRouter)



app.all('*',(req,res,next)=>{
    next(new expressError(404,"Page not found!"))
})


//error handling middleware
app.use((err, req, res, next) => {
    let{statusCode=500,message="Something went wrong"}=err
    res.render("error.ejs",{message})
});




