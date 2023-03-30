const express=require('express');

// make public auth check function that can be used globally
exports.isAuthenticated=(req,res,next)=>{
    // if user is logged, call next() to allow to user to continue browsering
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/auth/login');
    }
}