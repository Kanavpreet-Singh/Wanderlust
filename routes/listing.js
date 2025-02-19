const express=require("express")
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const expressError=require("../utils/expressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Listing=require("../models/listing")
const Review=require("../models/reviews")
const {isLoggedIn,isOwner}=require("../middleware.js")
const {validateListing}=require("../middleware.js")

const listingController=require("../controllers/listing.js")
const {storage}=require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage })
//ALL LISTINGS ROUTES ARE :-

//Index, Create routes
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingController.CreateNewListing))
    
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm)

//searchbar
router.get("/search",listingController.search_bar)
//show,update & delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('image'),validateListing,wrapAsync(listingController.updateListingData))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))




//edit 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm))

//filtered indexpage

router.get("/filter/:category",listingController.filtered_index)







module.exports=router