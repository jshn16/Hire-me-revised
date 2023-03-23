const express=require('express');

exports.isAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/auth/login');
    }
}