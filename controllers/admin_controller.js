const User = require("../models/user");
const message = require('../message/user_message');
const bcrypt=require('bcrypt');
const History=require('../models/history');
module.exports.signUp = async function (req, res) {
    try {
      
      //checking user existance
      const isUser = await User.findOne({ email: req.body.email }); //checking user is exist or not
      if (!isUser) {
        const user = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 8), //hashing the password
          role:'Admin'
        
        };
        const {firstname,lastname,email} = await User.create(user);
        res.send(200, { message: message.USER_CREATED, user: {firstname,lastname,email} }); //if user successfully created
      } else {
        res.send(409, { message: message.USER_EXIST });
      }
    } catch (error) {
      res.send(500, { message: message.INTERNAL_SERVER_ERROR + error });
    }
  };
  
  module.exports.signIn = async function (req, res) {
    try {
      const isUser = await User.findOne({ email: req.body.email });
      const match = await bcrypt.compare(req.body.password, isUser.password);
      if (isUser && match) {
        const token = await isUser.generateAdminAuthToken();
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 1000 * 60 * 10),
          httpOnly: true,
        });
        const {_id,firstname,lastname,department,designation,location,email}=isUser
        res.send({ message: message.USER_SIGN_IN,token, Lead: {_id,firstname,lastname,department,designation,location,email} });
      } else res.send({ message: message.USER_NOT_FOUND });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:message.INTERNAL_SERVER_ERROR
      })
    }
  };

  exports.addTL=async function(req,res){
      try {
          const isTl=await User.findById(req.params.id);
          if(isTl){
            isTl.role='tl';
           const updateTl= await isTl.save();
           if(updateTl){
             return res.status(201).json({
               message:"assig TL successfully"
             })
           }
          }
          return res.status(404).json({
            message:"Not found user"
          })
      } catch (error) {
        return res.status(500).json({
          message:message.INTERNAL_SERVER_ERROR
        }) 
      }
  }

  module.exports.showResult=async function(req,res){
    try {
      const isTl=await User.findById(req.user);
      if(isTl.role==='tl'){
        const getUser=await User.find({TL:req.user},{_id:1,firstname:1,feedbacks:1});
        if(getUser.length>0){
          return res.status(201).json({
            message:'Result',
            result:getUser
          })
        }else{
          return res.status(201).json({
            message:"Users not exist"
          })
        }
      }
      return res.status(201).json({
        message:'You are not valid user'
      })
    } catch (error) {
      res.status(201).json({
        message:message.INTERNAL_SERVER_ERROR
      })
    }
  }
  module.exports.assignTl=async function(req,res){
    try {
      const isTl=await User.findById(req.user);
      if(isTl.role==='tl'){
        const updateTl=await User.findById(req.params.id);
        updateTl.TL=req.user;
        await updateTl.save();
        
         return res.status(201).json({
            message:'Team Leader assign successfully',
            user:updateTl
          })
        }
      return res.status(201).json({
        message:'You are not valid user'
      })
    } catch (error) {
      res.status(201).json({
        message:message.INTERNAL_SERVER_ERROR
      })
    }
  }
  exports.getHistory= async function(req,res){
    try {
      
      const isTl=await History.findOne({TL:req.user},{TL:1,history:1}).populate('history.champion','firstname email createdAt');
     
      if(isTl){
        console.log(req.query);
        if(req.query.week || req.query.month|| req.query.year){
          var current=new Date();
          const{week=1,month=current.getMonth()+1,year=current.getFullYear()}=req.query;
          var i=0;
          for(;i<isTl.history.length;i++){
            if(isTl.history[i].week==week && isTl.history[i].month==month && isTl.history[i].year==year){
              return res.status(201).json({
                message: 'History',
                history:isTl.history[i]
              })
            }
          }
          if(isTl.history.length==i)
          return res.status(401).json({
            message:'No data available'
          })
          
        }

        res.status(201).json({
          History:isTl
        })
      }else{
        res.status(409).json({
          message:'You are not valid'
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  exports.getLead=async function(req,res){
    try {
      const tl=await User.find({role:'tl'},{firstname:1,lastname:1,department:1,designation:1,location:1,email:1});
      if(tl){
        res.status(200).json({
          message:'All team lead list',
          Lead:tl
        })
      }else{
        res.status(401).json({
          message:"No Lead exist "
        })
      }
    } catch (error) {
      res.status(401).json({
        message:message.INTERNAL_SERVER_ERROR
      })
    }
  }