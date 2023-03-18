const express = require('express')
const fs = require('fs');
const { resolve } = require('path');
const router = express.Router();


//use car model for CRUD
const car = require("../models/car");

router.get('/', function (req, res) {

    //reading file
    // fs.readFile('./data/cars.json', 'utf-8', (err, data) => {

    //     if (err) {

    //         console.log(err)
    //     }

    //     else {
    //         console.log(data)
    //         res.render('cars/index', { title: "Cars", cars: JSON.parse(data) });
    //     }
    // })

    //getting data from database model car

    car.find().then((data) => {
        console.log(data)
        res.render('cars/index', 
        {
             title: "Cars", 
             cars: data });
    }).catch((err) => {
        console.log(err)
    })

})


router.get('/create', (req, res) => {

    res.render('cars/create', { title: 'Create' })
})

router.post('/create', (req, res) => {

    car.create(req.body)
        .then((data) => {
            res.redirect('/cars')
        })
        .catch((err) => {
            console.log(err)
        })
})

module.exports = router;