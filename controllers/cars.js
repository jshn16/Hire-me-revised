const express = require('express')
const fs = require('fs');
const { resolve } = require('path');
const router = express.Router();


//use car model for CRUD
const car = require("../models/car");

//sing company model to get companies 
const company = require('../models/company');

//global check for authentication
const globalFunctions=require('../controllers/globalFunctions.js');


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
                cars: data,
                user: req.user
            });
    }).catch((err) => {
        console.log(err)
    })

})

//injection of auth check
router.get('/create', globalFunctions.isAuthenticated, (req, res) => {

    company.find().then((data) => {
        res.render('cars/create', {
            title: "Create",
            user: req.user,
            companies: data
        })

        console.log(data)

    }).catch((error) => { })
})

router.post('/create', globalFunctions.isAuthenticated, (req, res) => {

    car.create(req.body)
        .then((data) => {
            res.redirect('/cars')
        })
        .catch((err) => {
            console.log(err)
        })
})


//delete method

router.get('/delete/:_id',globalFunctions.isAuthenticated, (req, res) => {

    car.remove({ _id: req.params._id }).then((data) => {
        console.log(data)
        res.redirect('/cars')
    }).catch((error) => {
        console.log(error)
    })
})


router.get('/edit/:_id', globalFunctions.isAuthenticated,(req, res) => {
    car.findById(req.params._id).then((cars) => {
        company.find().then((companies) => {

            res.render('cars/edit', {
                title: 'Edit Cars',
                user: req.user,
                cars: cars,
                companies: companies
            })
            // console.log(cars)
        }).catch((error) => {
            console.log(error)
        });
        // console.log(companies);
    }).catch((error) => {
        console.log(error)
    })

})


//post to update data

router.post('/edit/:_id', globalFunctions.isAuthenticated, (req,res)=>{
    car.findByIdAndUpdate({_id: req.params._id}, req.body, null).then((data)=>{
        console.log(data)
        res.redirect('/cars')
    }).catch((error)=>{
        console.log(error)
    })
})



module.exports = router;