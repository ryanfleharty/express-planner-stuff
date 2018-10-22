const router = require('express').Router();
const Invitation = require("../models/invitation");
const User = require('../models/user');
const Plan = require('../models/plan');

router.get('/', (req, res)=>{
    res.render("invitations/index.ejs");
});

router.post('/', async (req, res, next)=>{
    try{
        const user = await User.findById(req.body.userId);
        const plan = await Plan.findById(req.body.planId);
        const invitation = await Invitation.create({
            "inviter": req.user._id,
            "invitee": user.id,
            "plan": plan._id
        });
        res.redirect(req.header('Referer'));
    } catch(err){
        return next(err);
    }
    
})

module.exports = router;