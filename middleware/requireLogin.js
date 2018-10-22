const mustBeLoggedIn = (req, res, next) => {
    if(!req.user){
        req.session.message = "You must log in first"
        res.redirect('/') //REPLACE WITH HTTP_REFERER
    } else {
        next();
    }
};
module.exports = mustBeLoggedIn;