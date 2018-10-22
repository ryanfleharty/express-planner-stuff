const express = require("express");
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res)=>{
    res.render('auth/register.ejs');
})
router.get('/login', (req, res)=>{
    res.render('auth/login.ejs');
})
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/')
})
router.post('/register', (req, res)=>{
    User.create(req.body, (err, user)=>{
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    })
})
router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if(err){
            console.log("problem");
            return next(err);
        }
        if(!user){ //if there's a failed login going on...
            console.log("PROBLEM")
            return res.redirect(req.header('Referer')); //from whence they came!
        }
        req.logIn(user, function(err){
            if(err){
                return next(err);
            }
            if(req.header("Referer").includes('login')){ //if they come from the login page itself...
                return res.redirect("/auth/success") //send them to the initial page
            } else {
                return res.redirect(req.header('Referer')); //otherwise let them return to where they were
            }  
        })
    })(req, res, next);
})
router.get('/success', (req, res)=>{
    res.render("auth/success.ejs");
})
router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    res.redirect('/auth/success');
});
module.exports = router;