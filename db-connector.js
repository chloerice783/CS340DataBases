// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_ricechl',
    password        : '9247',
    database        : 'cs340_ricechl'
})

pool.getConnection(err => {
    if (err) throw err;
    console.log('Database connected.');
});

// Export it for use in our application
module.exports.pool = pool;