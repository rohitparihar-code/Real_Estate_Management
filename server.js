require('dotenv').config({
    path:'config/.env'
});

const express = require('express');
const morgan = require('morgan');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cors = require('cors');
const DB = require('./config/database');
const auth = require('./utility/authentication');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.get('/',function(req,res) {
    res.send('Hello World!');
    DB.query("SHOW TABLES", (err, rows) => {
        if(err) 
         throw err;
        console.log(rows);
    });
});

app.post('/login', auth.login);

app.listen(PORT, function (err) {
    if (err) {
        console.info(err);
    }   
    else {
        console.log(`Server running at port ${PORT}`);
    }
});