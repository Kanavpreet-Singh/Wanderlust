const Joi=require("joi")



const allowedCategories = [
    "Beachfront","Rooms", "Luxury Resorts", "Entire Homes", "Urban Stays", "Business Stays", 
    "Cabins", "Camping", "Trending", "Fine Dining", "Ski Resorts", "Resorts with Pools","Near Airports"
  ];
  
  module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    reviews: Joi.array().items(Joi.string()),
    categories: Joi.array().items(Joi.string().valid(...allowedCategories)).min(2).required() 
  });


module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
});
