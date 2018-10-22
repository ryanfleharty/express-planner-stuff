const express = require('express');
const router = express.Router();
const Plan = require('../models/plan');
const Stop = require('../models/stop');
const maps = require('../maps');
const requireLogin = require('../middleware/requireLogin');
const checkCachedMapsQuery = require('../middleware/checkCachedMapsQuery')

router.post('/', requireLogin, async (req, res)=>{
    console.log("^^^ MAKING A STOP RIGHT HERE ^^^")
    try {
        const data = {
            "location": req.body.locationId,
            "start_time": new Date(),
            "end_time": new Date()
        }
        console.log(data);
        const stop = await Stop.create(data)
        const current_plan = await Plan.findById(req.planId);
        current_plan.stops.push(stop.id);
        await current_plan.save();
        res.redirect(`/plans/${req.planId}`)
    }
    catch (err) {
        console.log(err);
        res.redirect(`/plans/${req.planId}`)
    }
    
})
router.get('/new', async (req, res)=>{
    const plan = await Plan.findById(req.planId);
    res.render('stops/new.ejs', {
        plan: plan
    });
})
router.get('/search', checkCachedMapsQuery, maps.searchPlaces);

module.exports = router;