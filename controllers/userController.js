const router = require('express').Router();
const User = require('../models/user');
const requireLogin = require('../middleware/requireLogin');

router.get('/', async (req, res)=>{
    const users = await User.find({_id: { $ne: req.user._id}});
    console.log("USERS INDEX");
    res.render('users/index.ejs', {
        "users": users
    });
})

router.get('/profile', requireLogin, (req, res)=>{
    res.render('users/profile.ejs');
})

router.post('/:id/add-friend', async (req, res, next)=>{
    try {
        if(req.params.id !== req.user.id){
            const user = await User.findById(req.params.id);
            console.log(req.user);
            req.user.friends.addToSet(user.id);
            await req.user.save();
            user.friends.addToSet(req.user.id);
            await user.save();
            console.log("SUCCESS?")
        }
        res.redirect(req.header('Referer'));
    } catch (err) {
        return next(err);
    }
})

module.exports = router;