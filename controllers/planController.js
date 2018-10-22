const express = require('express');
const router = express.Router();
const stopController = require('./stopController');
const Plan = require('../models/plan');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const requireLogin = require('../middleware/requireLogin');

router.get('/', async (req, res)=>{
    const plans = await Plan.find({creator: req.user.id});
    const invitedPlans = await Invitation.find({invitee: req.user.id}).populate('plan').populate('inviter');
    res.render('plans/index.ejs', {
        plans: plans,
        invitedPlans: invitedPlans
    })
})

router.get('/new', (req, res)=>{
    res.render('plans/new.ejs')
})

router.get('/:id', async (req, res)=>{
    const plan = await Plan.findById(req.params.id)
    .populate('creator')
    .populate({path: 'stops',
                populate: { path: 'location'}
    });
    const user = await User.findById(req.user._id).populate("friends"); //we need friends to invite to the plan
    res.render('plans/show.ejs', {plan: plan, user: user})
})

router.post('/', requireLogin, async (req, res)=>{
    const data = {
        "title": req.body.title,
        "date": req.body.date,
        "creator": req.user.id
    }
    const plan = await Plan.create(data);
    res.redirect(`/plans/${plan.id}`)
})


module.exports = router