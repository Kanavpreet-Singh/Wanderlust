const express=require("express")
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Listing=require("../models/listing")
const Review=require("../models/reviews")
const {validateReview}=require("../middleware.js")
const {isLoggedIn,isOwner,isReviewAuthor}=require("../middleware.js")
const RevController=require("../controllers/review.js")

//ALL REVIEWS ROUTES:

//Create reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(RevController.createReview))

//delete review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(RevController.deleteReview))

module.exports=router