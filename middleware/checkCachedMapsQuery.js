const MapsQuery = require('../models/maps_query');
const Location = require('../models/location');
const Plan = require('../models/plan');
module.exports = async (req, res, next)=>{
    res.locals.maps_key = process.env.GOOGLE_MAPS_PLATFORM_API_KEY
    let existingQuery = await MapsQuery.findOne({
        "query": req.query.query,
        "location": req.query.city
    })
    if(existingQuery){
        res.locals.places = await Location.find({
            "address": new RegExp(req.query.city, 'i'),
            "keywords": new RegExp(req.query.query, 'i')
        })
        let current_plan = await Plan.findById(req.planId)
        .populate({
            path: 'stops',
            populate: { path: 'location'}
        });
        let last_location;
        if(current_plan.stops.length > 0){
            last_location = current_plan.stops[current_plan.stops.length - 1].location
        } 
        return res.render("places-result.ejs", {calcDistance: calcCrow, last_location: last_location, plan: current_plan})
    } else {
        next()
    }
}
function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d * .621371;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}