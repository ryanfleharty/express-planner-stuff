const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_API_KEY
});
const Location = require('./models/location');
const MapsQuery = require('./models/maps_query');
const Plan = require('./models/plan');
module.exports = {
    async searchPlaces(req, res, next){
            await MapsQuery.create({
                "query": req.query.query,
                "location": req.query.city
            })
            getLocation(req.query.city, function(response){
                getPlaces(req.query.query, response.lat, response.lng, async function(response){
                    let places = response.sort((place1, place2)=>{
                        return place2.rating - place1.rating;
                    })
                    places = places.map(async (place)=>{
                        try{
                            let result = await Location.findOrCreate({
                                "googleId": place.id },
                                {
                                "latitude": place.geometry.location.lat,
                                "longitude": place.geometry.location.lng,
                                "name": place.name,
                                "googleId": place.id,
                                "address": place.formatted_address,
                                "keywords": [req.query.query]
                            });
                            result.doc.keywords.addToSet(req.query.query);
                            await result.doc.save()
                            return result.doc;
                        } catch(err) {
                            console.log(err);
                        }
                    })
                    Promise.all(places).then(async function(locations){
                        let current_plan = await Plan.findById(req.planId)
                        .populate({
                            path: 'stops',
                            populate: { path: 'location'}
                        });
                        let last_location;
                        if(current_plan.stops.length > 0){
                            last_location = current_plan.stops[current_plan.stops.length - 1].location
                        } 
                        return res.render("places-result.ejs", {places: locations, calcDistance: calcCrow, last_location: last_location, plan: current_plan})
                    })
                    
                })
            })
    },
    getPlace(req, res, next){
        googleMapsClient.place({"placeid":req.params.id}, function(err, response){
            if(err){
                res.status(404).json(err)
            }
            res.render("placeDetail", {"place":response.json.result})
        })
    }
}
function getPlaces(query, lat, lng, callback){
    googleMapsClient.places({
            "query":query,
            "location":`${lat},${lng}`,
            "radius":25
    }, function(err, response){
        if(!err){
            callback(response.json.results)
        }
        else{
            console.log(err)
        }
    })
}
function getLocation(city, callback){
    googleMapsClient.geocode({address: city},
        function(err, response){
            if(!err){
                callback(response.json.results[0].geometry.location);
            } else {
                console.log("PROBLEM CHIEF")
            }
        }
    )
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