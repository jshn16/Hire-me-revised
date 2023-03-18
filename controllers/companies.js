const express = require('express');
const router = express.Router();
const company = require('../models/company.js');


//get method to get create page of cities 
router.get('/create', (req, res) => {
    res.render('companies/create')
})

//post method to create new cities

router.post('/create', (req, res) => {

    company.create(req.body).then((data) => {
        res.redirect('/')
    }).catch((err) => {
        console.log(err)
    })
})

module.exports = router;