const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const DB = require('./../config/database.js');

function checkIfUserExists (email) {

    return DB.query(`SELECT * FROM user WHERE email = ${email}`).then(
        (err) => err,
        (rows) => rows.length
    ).catch((err)=>{
        console.error(err);
    });
};

function create (req,res,next) {

    checkIfUserExists(req.body.email).then(
        (val)=>{
           if(!val){
              DB.query(`INSERT INTO user(name, password, email, preferred_area) VALUES(${req.body.name},${req.body.password},${req.body.email},${req.body.preferredArea})`, function (err, result) {
                 if (err)
                  next(err);
                 else{
                    res.json({code:1,status: "success", message: "User added successfully!!!", data: null});
                 }
               });
           }
           else
           res.json({code:0,status:'Failure',message:"There is already an account with this email.",data:null});
        },
        (err)=>{console.error(err);}
     );
};

function login(req,res,next) {
    const queryString = `SELECT * FROM user WHERE email = '${req.body.email}'`;
    console.log(queryString);
    DB.query(queryString, function(err, rows){
       if (err) {
        next(err);
       }else{
           console.log(req.body.password);
           console.log(rows[0].password);
           if(bcrypt.compareSync(String(req.body.password), String(rows[0].password))) {
            const token = jwt.sign({id: rows[0].id}, req.app.get('secretKey'), { expiresIn: '1h' });
            res.cookie('token', token, {
              maxAge: 1000 * 60 * 60, // 1 hour
            });
            res.json({code:1,status:"success", message: "User found!!!", data:{user: rows[0], token:token}});
           }else{
            res.json({code:0,status:"error", message: "Invalid email or password..", data:null});
           }
      }
    });
};

function logout(req,res,next) {
  
      if(req.cookies.token){
        res.clearCookie('token');
        res.json({code:1,status:'success',message:'Logged Out..',data:null});
      }
      else{
        res.json({code:0,status:'error',message:'Log in first..',data:null});
      }
};

module.exports = {
    signup: create,
    login: login,
    logout: logout
};