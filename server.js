require('dotenv').config({
    path:'config/.env'
});

const express = require('express');
// const morgan = require('morgan');
// const _ = require('lodash');
const bodyParser = require('body-parser');
// const cors = require('cors');
const DB = require('./config/database');
const auth = require('./utility/authentication');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
// app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

// ROUTES Created (For Trial Run)
var filter = 0; // Used to display corresponding text as heading
/* 
    filter = 0 for home page
    1 for area filter
    2 for Cost filter
    3 for BHK filter
    4 for date filter
*/

app.get('/',function(req,res) {
    filter = 0;
    // Code for Card Test Run
    DB.query("select * from property", (err, rows) => {
        if(err) 
         throw err;
        // console.log(rows);
        res.render('index.ejs', {rows: rows, filter: filter});
    });
});

app.get('/login', function(req, res) {
    res.render('signup.ejs');
});

app.post('/login', auth.login);

app.get('/compare', function(req, res) {
    res.render('compare_page.ejs');
});

app.get('/wishlist', function(req, res) {
    DB.query('select * from property', (err, rows) => {
        if(err) throw err;
        res.render('wishlist_page.ejs', {rows: rows});
    });
});

app.get('/feedback', function(req, res) {
    res.render('feedback.ejs')
});

app.get('/filter-area', function(req, res) {
    filter = 1;
    DB.query('select * from property order by area', (err, rows) => {
        if( err ) throw err;
        // console.log(rows);
        res.render('index', {rows: rows, filter: filter});
    });
});

app.get('/filter-cost', function(req, res) {
    filter = 2;
    DB.query('select * from property order by cost', (err, rows) => {
        if( err ) throw err;
        res.render('index', {rows: rows, filter: filter}); 
    });
});
// Routes End


app.listen(PORT, function (err) {
    if (err) throw error;
    console.log(`Server running at port ${PORT}`);
});