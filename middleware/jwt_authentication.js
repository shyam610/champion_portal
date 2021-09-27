const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = function (req, res, next) {
  try {
    const token =  req.body.token ||req.cookies.jwt || req.params.token || req.query.token || ( req.headers['authorization']?req.headers['authorization'].split(' ')[1]:undefined);


    if(token){
      const verifyUser = jwt.verify(token, "mynameisshyamnarayanwebdeveloper");
      if (!verifyUser) {
        res.send(500, { message: "you are not authorized user" });
      }
      //console.log(verifyUser._id);
      req.user = verifyUser._id;
      next();
    }else{
      res.send(401,{message:"please login first"})
    }
    
  } catch (error) {
    res.send(401, { message: "session time out!" });
  }
};
const adminAauth = function (req, res, next) {
  try {
    const token =  req.body.token ||req.cookies.jwt || req.params.token || req.query.token || ( req.headers['authorization']?req.headers['authorization'].split(' ')[1]:undefined);


    if(token){
      const verifyUser = jwt.verify(token, "adminnameisshyamnarayanwebdeveloper");
      if (!verifyUser) {
        res.send(500, { message: "you are not authorized user" });
      }
      //console.log(verifyUser._id);
      req.user = verifyUser._id;
      next();
    }else{
      res.send(401,{message:"please login first"})
    }
    
  } catch (error) {
    res.send(401, { message: "session time out!" });
  }
};


module.exports = {auth,adminAauth};
