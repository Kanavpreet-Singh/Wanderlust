const Listing=require("../models/listing")
const Review=require("../models/reviews")
const {validateReview}=require("../middleware.js")

module.exports.createReview=async ( req,res)=>{
    let listing=await Listing.findById(req.params.id)
    let {comment,rating}=req.body

    let newrev=new Review({comment,rating})
    newrev.author=req.user._id
    listing.reviews.push(newrev)

    await newrev.save()
    await listing.save()
    req.flash("success"," Review added")
    res.redirect(`/listings/${req.params.id}`)
}

module.exports.deleteReview=async ( req,res)=>{
    let {id,reviewId}=req.params
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("del"," Review deleted")
    res.redirect(`/listings/${id}`)
}