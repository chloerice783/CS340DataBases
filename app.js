// App.js

/*
    SETUP
*/
const express = require('express');
const path = require('path');
const app = express();
const PORT = 9755;

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     //Import express-handlebars
app.set('view engine', 'hbs');                 //Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.use('/compiledTemplates.js', express.static(path.join(__dirname, 'compiledTemplates.js')));


const hbs = exphbs.create({

    partialsDir: path.join(__dirname, 'views/partials') //Tell Handlebars where to find partials
});

//Set up Handlebars as the view engine
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}))

app.set('views', path.join(__dirname, 'views'));


//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//Route for the homepage
app.get('/', function(req, res) {
    res.render('index'); //Renders 'views/index.handlebars' by default
});

//Route for the cats table
app.get('/cats', function(req, res) {
    res.render('cats'); 
});

//Route for the customers table
app.get('/customers', function(req, res) {
    res.render('customers'); 
});


//Route for the menu table
app.get('/menuItems', function(req, res) {
    res.render('menuItems'); 
});


//Route for the orders table
app.get('/orders', function(req, res) {
    res.render('orders'); 
});

//Route for the reservations table
app.get('/reservations', function(req, res) {
    res.render('reservations'); 
});

//Route for the reservations table
app.get('/reservationsCats', function(req, res) {
    res.render('reservationsCats'); 
});

//Route for the reservations table
app.get('/orderMenuItems', function(req, res) {
    res.render('orderMenuItems'); 
});

//Listener to start the server
app.listen(PORT, function() {
    console.log('Server running on http://localhost:' + PORT);
});
