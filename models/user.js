const mongoose = require('mongoose')
const schema=mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new schema({
    email:{
        type:String,
        required:true
    }
});
UserSchema.plugin(passportLocalMongoose); //username and hashed password will be automatically added

module.exports = mongoose.model('User', UserSchema);