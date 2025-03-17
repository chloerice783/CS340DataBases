// App.js

/*
    SETUP
*/
const express = require('express');
const path = require('path');
const app = express();
const PORT = 9769;

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     //Import express-handlebars
app.set('view engine', 'hbs');                 //Tell express to use the handlebars engine whenever it encounters a *.hbs file.

//Database
var db = require('./db-connector')

app.use('/compiledTemplates.js', express.static(path.join(__dirname, 'compiledTemplates.js')));
//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



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


//Route for the homepage
app.get('/', function(req, res) {
    res.render('index'); //Renders 'views/index.handlebars' by default
});

//Route for the cats table~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get('/cats', (req, res) => {
    db.pool.query('SELECT * FROM Cats', (err, results) => {
        if (err) throw err;
        res.render('cats', { cats: results });
    });
});


//CREATE - Add a new cat
app.post('/cats/add', (req, res) => {
    const { age, name, breed, status } = req.body;
    db.pool.query('INSERT INTO Cats (name, age, breed, status) VALUES (?, ?, ?, ?)', 
        [name, age, breed, status], (err) => {
        if (err) throw err;
        res.redirect('/cats');
    });
});

//UPDATE - Modify an existing cat
app.post('/cats/update/:id', (req, res) => {
    const { age, name, breed, status } = req.body;
    const catId = req.params.id;
    db.pool.query('UPDATE Cats SET name=?, age=?,  breed=?, status=? WHERE catId=?', 
        [name, age, breed, status, catId], (err) => {
        if (err) throw err;
        res.redirect('/cats');
    });
});

//DELETE - Remove a cat
app.post('/cats/delete/:id', (req, res) => {
    const catId = req.params.id;
    db.pool.query('DELETE FROM Cats WHERE catId=?', [catId], (err) => {
        if (err) throw err;
        res.redirect('/cats');
    });
});

//READ- Route for the customers table ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get('/customers', (req, res) => {
    db.pool.query('SELECT * FROM Customers', (err, results) => {
        if (err) throw err;
        res.render('customers', { customers: results });
    });
});

//CREATE - Add a new customer
app.post('/customers/add', (req, res) => {
    const { name, phoneNumber, email } = req.body;
    db.pool.query('INSERT INTO Customers (name, phoneNumber, email) VALUES (?, ?, ?)', 
        [name, phoneNumber, email], (err) => {
        if (err) throw err;
        res.redirect('/customers');
    });
});

//UPDATE - Modify an existing customer
app.post('/customers/update/:id', (req, res) => {
    const { name, phoneNumber, email } = req.body;
    const customerId = req.params.id;
    db.pool.query('UPDATE Customers SET name=?, phoneNumber=?, email=? WHERE customerId=?', 
        [name, phoneNumber, email, customerId], (err) => {
        if (err) throw err;
        res.redirect('/customers');
    });
});

//DELETE - Remove a customer
app.post('/customers/delete/:id', (req, res) => {
    const customerId = req.params.id;
    db.pool.query('DELETE FROM Customers WHERE customerId=?', [customerId], (err) => {
        if (err) throw err;
        res.redirect('/customers');
    });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Route for the menu table
app.get('/menuItems', (req, res) => {
    db.pool.query('SELECT * FROM MenuItems', (err, results) => {
        if (err) throw err;
        res.render('menuItems', { menuItems: results });
    });
});

// CREATE 
app.post('/menuItems/add', (req, res) => {
    const { name, price, category } = req.body;
    db.pool.query(
        'INSERT INTO MenuItems (name, price, category) VALUES (?, ?, ?)', 
        [name, price, category],
        (err) => {
            if (err) throw err;
            res.redirect('/menuItems');
        }
    );
});

// UPDATE 
app.post('/menuItems/update/:id', (req, res) => {
    const { name, price, category } = req.body;
    const menuItemId = req.params.id;
    db.pool.query(
        'UPDATE MenuItems SET name=?, price=?, category=? WHERE menuItemId=?', 
        [name, price, category, menuItemId],
        (err) => {
            if (err) throw err;
            res.redirect('/menuItems');
        }
    );
});

// DELETE
app.post('/menuItems/delete/:id', (req, res) => {
    const menuItemId = req.params.id;
    db.pool.query(
        'DELETE FROM MenuItems WHERE menuItemId=?', 
        [menuItemId],
        (err) => {
            if (err) throw err;
            res.redirect('/menuItems');
        }
    );
});

//Route for the orders table~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get('/orders', (req, res) => {
    const ordersQuery = `
        SELECT Orders.*, Customers.name as customerName
        FROM Orders
        LEFT JOIN Customers ON Orders.customerId = Customers.customerId
    `;

    const customersQuery = 'SELECT * FROM Customers';

    //Run all queries using promise 
    const ordersPromise = new Promise((resolve, reject) => {
        db.pool.query(ordersQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    const customersPromise = new Promise((resolve, reject) => {
        db.pool.query(customersQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    //Wait for all queries to complete and render the page
    Promise.all([ordersPromise, customersPromise])
        .then(([orders, customers]) => {
            //Log data to see if it's correctly retrieved
            console.log('orders:', orders);
            console.log('Customers:', customers);
                    

            //Render data as separate tables
            res.render('orders', {
                orders,
                customers
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error fetching data");
        });
});

//CREATE - Add a new reservation
app.post('/orders/add', (req, res) => {
    const  { customerId, orderTime, orderTotal } = req.body;
    db.pool.query('INSERT INTO Orders (customerId, orderTime, orderTotal ) VALUES (?, ?, ?)', 
        [customerId, orderTime, orderTotal  ], (err) => {
        if (err) throw err;
        res.redirect('/orders');
    });
});

//UPDATE - Modify an existing reservation
app.post('/orders/update/:id', (req, res) => {
    const {customerId, orderTime, orderTotal  } = req.body;
    const orderId = req.params.id;
    db.pool.query('UPDATE Orders SET customerId=?, orderTime=?, orderTotal=? WHERE orderId=?', 
        [ orderId, customerId, orderTime, orderTotal  ], (err) => {
        if (err) throw err;
        res.redirect('/orders');
    });
});

// DELETE
app.post('/orders/delete/:id', (req, res) => {
    const orderId = req.params.id;
    db.pool.query(
        'DELETE FROM Orders WHERE orderId=?', 
        [orderId],
        (err) => {
            if (err) throw err;
            res.redirect('/orders');
        }
    );
});

//Route for the reservations table~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get('/reservations', (req, res) => {
    const reservationsQuery = `
        SELECT Reservations.*, Cats.name AS catName, Customers.name AS customerName
        FROM Reservations
        LEFT JOIN Cats ON Reservations.catId = Cats.catId
        LEFT JOIN Customers ON Reservations.customerId = Customers.customerId
    `;

    const customersQuery = 'SELECT * FROM Customers';
    const catsQuery = 'SELECT * FROM Cats';

    //Run all queries using promise 
    const reservationsPromise = new Promise((resolve, reject) => {
        db.pool.query(reservationsQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    const customersPromise = new Promise((resolve, reject) => {
        db.pool.query(customersQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    const catsPromise = new Promise((resolve, reject) => {
        db.pool.query(catsQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    //Wait for all queries to complete and render the page
    Promise.all([reservationsPromise, customersPromise, catsPromise])
        .then(([reservations, customers, cats]) => {
            //Log data to see if it's correctly retrieved
            console.log('Reservations:', reservations);
            console.log('Customers:', customers);
            console.log('Cats:', cats);

            //Render data as separate tables
            res.render('reservations', {
                cats,
                reservations,
                customers
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error fetching data");
        });
});


//CREATE - Add a new reservation
app.post('/reservations/add', (req, res) => {
    const  { customerId, catId, date, durationMinutes, guestCount } = req.body;
    db.pool.query('INSERT INTO Reservations (customerId, catId, date, durationMinutes, guestCount ) VALUES (?, ?, ?, ?, ?)', 
        [customerId, catId, date, durationMinutes, guestCount ], (err) => {
        if (err) throw err;
        res.redirect('/reservations');
    });
});

//UPDATE - Modify an existing reservation
app.post('/reservations/update/:id', (req, res) => {
    const {customerId, catId, date, durationMinutes, guestCount } = req.body;
    const reservationId = req.params.id;
    db.pool.query('UPDATE Reservations SET customerId=?, catId=?, date=?, durationMinutes=?, guestCount=? WHERE reservationId=?', 
        [customerId, catId, date, durationMinutes, guestCount, reservationId ], (err) => {
        if (err) throw err;
        res.redirect('/reservations');
    });
});

//DELETE - Remove a reservation
app.post('/reservations/delete/:id', (req, res) => {
    const reservationId = req.params.id;
    db.pool.query('DELETE FROM Reservations WHERE reservationId=?', [reservationId], (err) => {
        if (err) throw err;
        res.redirect('/reservations');
    });
});

//Route to Display ReservationCats Data~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get('/reservationcats', (req, res) => {
    const query = "SELECT * FROM ReservationCats";
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error retrieving ReservationCats data.");
        }
        res.render('reservationcats', { reservationcats: results });
    });
});

// Route to Add a New Reservation-Cat Relationship
app.post('/reservationcats/add', (req, res) => {
    const { reservationId, catId } = req.body;
    const query = "INSERT INTO ReservationCats (reservationId, catId) VALUES (?, ?)";
    db.pool.query(query, [reservationId, catId], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error inserting ReservationCats record.");
        }
        res.redirect('/reservationcats');
    });
});

// Route to Update an Existing Reservation-Cat Relationship
app.post('/reservationcats/update', (req, res) => {
    const { reservationId, catId, newCatId } = req.body;
    const query = "UPDATE ReservationCats SET catId = ? WHERE reservationId = ? AND catId = ?";
    db.pool.query(query, [newCatId, reservationId, catId], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error updating ReservationCats record.");
        }
        res.redirect('/reservationcats');
    });
});

// Route to Delete a Reservation-Cat Relationship
app.post('/reservationcats/delete', (req, res) => {
    const { reservationId, catId } = req.body;
    const query = "DELETE FROM ReservationCats WHERE reservationId = ? AND catId = ?";
    db.pool.query(query, [reservationId, catId], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error deleting ReservationCats record.");
        }
        res.redirect('/reservationcats');
    });
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Route for the menu items table
app.get('/orderMenuItems', (req, res) => {
    const orderMenuItemsQuery = `
        SELECT OrderMenuItems.*
        FROM OrderMenuItems
        LEFT JOIN Orders ON OrderMenuItems.orderId = Orders.orderId
        LEFT JOIN MenuItems ON MenuItems.menuItemId = OrderMenuItems.menuItemId
    `;

    const menuItemsQuery = 'SELECT * FROM MenuItems';
    const ordersQuery = 'SELECT * FROM Orders';

    //Run all queries using promise 
    const orderMenuItemsPromise = new Promise((resolve, reject) => {
        db.pool.query(orderMenuItemsQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    const ordersPromise = new Promise((resolve, reject) => {
        db.pool.query(ordersQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    const menuItemsPromise = new Promise((resolve, reject) => {
        db.pool.query(menuItemsQuery, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });


    //Wait for all queries to complete and render the page
    Promise.all([ordersPromise, menuItemsPromise, orderMenuItemsPromise])
        .then(([orders, menuItems, orderMenuItems]) => {
            //Log data to see if it's correctly retrieved
            console.log('menuItems:', menuItems);
            console.log('orderMenuItems:', orders);

            //Render data as separate tables
            res.render('orderMenuItems', {
                orderMenuItems,
                orders,
                menuItems
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error fetching data");
        });
});

// Route to Add a New Reservation-Cat Relationship
app.post('/orderMenuItems/add', (req, res) => {
    const { orderId, menuItemId } = req.body;
    const query = "INSERT INTO OrderMenuItems (orderId, menuItemId ) VALUES (?, ?)";
    db.pool.query(query, [orderId, menuItemId], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error inserting OrderMenuItems record.");
        }
        res.redirect('/orderMenuItems');
    });
});

// Route to Update an Existing Reservation-Cat Relationship
app.post('/orderMenuItems/update/:id', (req, res) => {
    const orderMenuItemId = req.params.id;
    const { menuItemId} = req.body;
    const query = "UPDATE OrderMenuItems SET menuItemId = ? WHERE orderMenuItemId= ? ";
    db.pool.query(query, [menuItemId, orderMenuItemId], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error updating OrderMenuItems record.");
        }
        res.redirect('/orderMenuItems');
    });
});

// Route to Delete a Reservation-Cat Relationship
app.post('/orderMenuItems/delete', (req, res) => {
    const { orderId, menuItemId } = req.body;
    const query = "DELETE FROM OrderMenuItems WHERE orderId = ? AND menuItemId = ?";
    db.pool.query(query, [orderId, menuItemId], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Error deleting OrderMenuItems record.");
        }
        res.redirect('/orderMenuItems');
    });
});

//Listener to start the server
app.listen(PORT, function() {
    console.log('Server running on http://localhost:' + PORT);
});
