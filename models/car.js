const { Router } = require('express');
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({

    company: {
        type: String,
        required: ["Company Required"]
    },

    name: {
        type: String,
        required: ["Name Required"]
    },

    year: {
        type: Number

    },

    contactEmail: {
        type: String
    }


})

module.exports = mongoose.model('Car', carSchema)