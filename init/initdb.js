const mongoose = require('mongoose');
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initdata=require("./data")

main()  
.then((res)=>{
    console.log("connection with 'wanderlust' successful")
})
.catch((err)=>{
    console.log("Cant connect with db")
})

const Listing=require("../models/listing")

const initdb=async ()=>{
    await Listing.deleteMany({})

    initdata.data=initdata.data.map((obj)=>({...obj,owner:"677156e40389c20a261f9201"}))
    await Listing.insertMany(initdata.data)


}

initdb()