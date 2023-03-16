const express = require('express')
const fs=require('fs');
const router = express.Router();



router.get('/', function (req, res) {

    //reading file
    fs.readFile('./data/employers.json','utf-8',(err,data)=>{

        if(err){

            console.log(err)
        }

        else{
            console.log(data)
            res.render('employers/index', { title: "Employers", employers:JSON.parse(data) });
        }
    })

    
});

module.exports = router;