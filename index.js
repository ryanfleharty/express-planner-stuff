const express = require('express')
const app = express();
const session = require("express-session");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport')
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/express-planner"
const store = new MongoDBStore({
    uri: mongoUri,
    collection: 'mySessions'
});
store.on('connected', function() {
    store.client; // The underlying MongoClient object from the MongoDB driver
});
// Catch errors
store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'));
app.use(morgan("short"));
app.use(session({ 
    secret: "cats",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.message = req.session.message || ""
    res.locals.current_plan = req.session.current_plan || {}
    next();
});

require("./db/db");
require('./passport/config');
require('./passport/local-config');
require('./passport/google-config');

const authController = require('./controllers/authController');
const planController = require('./controllers/planController');
const stopController = require('./controllers/stopController');
const userController = require('./controllers/userController');
const invitationController = require('./controllers/invitationController');
const maps = require('./maps');

app.get('/', (req, res)=>{
    res.render('index.ejs');
})
app.get('/location/:id', maps.getPlace)
app.use('/auth', authController);
app.use('/plans', planController);
app.use('/plans/:planId/stops', function(req, res, next) {
    req.planId = req.params.planId; //so the nested routes have access to planId
    next()
  }, stopController)
app.use('/users', userController)
app.use('/invitations', invitationController);

const port = process.env.PORT || 9000
const server = app.listen(port, ()=>{
    console.log("Server is active")
})
const io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
    console.log("client is connected")
    console.log(`connected id is: ${socket.id}`)
    socket.on('joinRoom', function(data){
        console.log("ROOM JOINED")
        console.log(data);
        socket.emit('randomNumber', data)
    })
})