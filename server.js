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

app.get('/',function(req,res) {
    
    // Code for Card Test Run
    DB.query("select * from property", (err, rows) => {
        if(err) 
         throw err;
        // console.log(rows);
        res.render('index.ejs', {rows: rows});
    });
});

// ROUTES Created (For Trial Run)

app.get('/login', function(req, res) {
    res.render('signup.ejs');
});

app.post('/login', auth.login);

app.get('/compare', function(req, res) {
    res.render('compare_page.ejs');
});

app.get('/wishlist', function(req, res) {
    res.render('wishlist_page.ejs');
});
// Routes End


app.listen(PORT, function (err) {
    if (err) throw error;
    console.log(`Server running at port ${PORT}`);
});