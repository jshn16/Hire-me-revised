const mongoose=require('mongoose');

//creating schema for company

const companySchema =new mongoose.Schema({

    name:{
        type: String,
        required: ["Company Name Is Required"],
        minlength: [1, "Name is empty"],
        maxlength:[20, "Name is too long"]

    }


})

module.exports=mongoose.model('Company', companySchema)
