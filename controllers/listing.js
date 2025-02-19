const Listing=require("../models/listing")

module.exports.index=async (req,res)=>{

    const allListings=await Listing.find()
    res.render("./listings/index.ejs",{allListings,category:null})
    
}
module.exports.filtered_index=async(req,res)=>{

    let {category}=req.params

    const categoryMap = {
        trending: "Trending",
        rooms: "Rooms",
        "entire-homes": "Entire Homes",
        cabins: "Cabins",
        camping: "Camping",
        beachfront: "Beachfront",
        "ski-resorts": "Ski Resorts",
        "near-airports": "Near Airports",
        "urban-stays": "Urban Stays",
        "luxury-resorts": "Luxury Resorts",
        "fine-dining": "Fine Dining",
        "business-stays": "Business Stays",
        "resorts-with-pools": "Resorts with Pools"
    };

    category = categoryMap[category]

    try {
        const filteredListings = await Listing.find({ categories: category });
        res.render('./listings/index.ejs', { allListings: filteredListings,category });
    } catch (error) {
        console.error("Error fetching filtered listings:", error);
        res.status(500).send("Something went wrong while filtering listings.");
    }

}
module.exports.search_bar=async(req,res)=>{

    const query = req.query.query.trim(); 

    
    const searchResults = await Listing.find({
        title: { $regex: query, $options: 'i' }, // Case-insensitive search
    });

    res.render('./listings/index.ejs', { allListings: searchResults, category: 'Search Results' });
    
}

module.exports.renderNewForm=(req,res)=>{
    
    res.render("./listings/new.ejs")
    
}


module.exports.showListing=async (req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner")
    if(!listing){
        req.flash("error","This listing doesn't exists")
        res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing})
    
}
module.exports.CreateNewListing=async (req,res,next)=>{
    let url=req.file.path
    let filename=req.file.filename
    let {title,description,image,price,location,country}=req.body
    let newl=new Listing({title,description,image,price,location,country})
    newl.categories=req.body.categories
    newl.image={url,filename}
    newl.owner=req.user._id
    newl.save()
    req.flash("success","New Listing created successfully!")
    res.redirect("/listings")
}

module.exports.editListingForm=async (req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id)
    if(!listing){
        req.flash("error","This listing doesn't exists")
        res.redirect("/listings")
    }
    let originalUrl=listing.image.url
    originalUrl.replace("/upload","/upload/w_250")
    res.render("./listings/edit.ejs",{listing,originalUrl})
}
module.exports.updateListingData=async (req,res)=>{
    let {id}=req.params
    let {title,description,image,price,location,country}=req.body
    let l=await Listing.findByIdAndUpdate(id,({title,description,image,price,location,country}))
    if(typeof req.file!=="undefined"){
    let url=req.file.path
    let filename=req.file.filename
    l.image={url,filename}
    await l.save()
    }
    l.categories=req.body.categories
    l.save()
    req.flash("success"," Listing was edited")
    res.redirect(`/listings/${id}`)


}
module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params
    
    await Listing.findByIdAndDelete(id)
    req.flash("del","Deleted successfully")
    res.redirect("/listings")

}