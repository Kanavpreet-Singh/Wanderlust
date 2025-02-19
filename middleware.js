const Listing=require("./models/listing")
const Review=require("./models/reviews")
const expressError=require("./utils/expressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","You must be logged in to perform this action")
        return res.redirect("/login")
    }
    next()
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params
    let listing=await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission")
        return res.redirect(`/listings/${id}`)
    }
    next()
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params
    let rev=await Review.findById(reviewId)
    if(!rev.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    

    if(error){
        throw new expressError(400,error)
    }
    else{
        next()
    }

}
module.exports. validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new expressError(400, msg);
    }
    next();
};
