const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const DB = require('./../config/database.js');
var cntr = 0;

function create (req,res,next) {
  const password = bcrypt.hashSync(req.body.password, 3);
    DB.query(`INSERT INTO user(name, password, email) VALUES('${req.body.username}','${password}','${req.body.email}')`, function (err, result) {
      if (err)
        next(err);
      else{
        res.json({code:1,status: "success", message: "User added successfully!!!", data: null});
      }
    });
};

function inputLoginCredentials(req,res,next) {
  res.render('signup.ejs');
};

async function validateUser(req, res, next) {

  await jwt.verify(req.cookies.token, req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      req.body.loggedIn = false;
    }else{
      // add user id to request
      req.body.id = decoded.id;  
      req.body.loggedIn = true;
    }
  });
  next();
};

function login(req,res,next) {
    const queryString = `SELECT * FROM user WHERE name = '${req.body.email}'`;
    console.log(queryString);
    DB.query(queryString, function(err, rows){
       if (err) {
        next(err);
       }else{
           if(rows && rows[0] && bcrypt.compareSync(String(req.body.password), String(rows[0].password))) {
            const token = jwt.sign({id: rows[0].id}, req.app.get('secretKey'), { expiresIn: '1h' });
            res.cookie('token', token, {
              maxAge: 1000 * 60 * 60, // 1 hour
            });
            res.redirect('/');
           }
        }
    });
};

function logout(req,res,next) {
      if(req.cookies.token){
        res.clearCookie('token');
      }
      res.redirect('/');
};

module.exports = {
    signup: create,
    login: login,
    logout: logout,
    inputLoginCredentials,
    validateUser
};