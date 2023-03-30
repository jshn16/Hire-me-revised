const express = require('express');
const router = express.Router();

/* GET home page. */

const globalFunctions=require('../controllers/globalFunctions.js'); 


router.get('/', function (req, res) {
  res.render('index', { title: 'Carbase', user: req.user });
});


router.get('/index', function (req, res) {
  res.render('index', { title: 'Carbase', user: req.user });
});

//Get about page
router.get('/about',function(req,res){
  res.render('about', {title:'About', user: req.user})
})

module.exports = router;
