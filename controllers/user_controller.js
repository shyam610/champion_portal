const message = require('../message/user_message');
const User=require('../models/user');
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
          designation:req.body.designation,
          location:req.body.location,
          department:req.body.department
        
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
        const token = await isUser.generateAuthToken();
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 1000 * 60 * 10),
          httpOnly: true,
        });
        const {_id,firstname,lastname,email,TL,role,designation,
          location, department}=isUser
        res.send({ message: message.USER_SIGN_IN,token, user: {_id,firstname,lastname,email,TL,role,designation,
          location, department} });
      } else res.send({ message: message.USER_NOT_FOUND });
    } catch (error) {
      res.status(500).json({
        message:message.INTERNAL_SERVER_ERROR
      })
    }
  };

  exports.feedback=async function(req,res){
    try {

      const isUser_feedback=await User.findOne({feedbacks:{
        $elemMatch:{user:req.user}
    }});
    // console.log(isUser_feedback+'  '+req.user);
    // if(  isUser_feedback.TL=='null' || !isUser_feedback.TL){
    //   return res.status(401).json({
    //     message:"You are not valide user"
    //   })
    //}
    const isUser = await User.findById(req.user);
    const isSameLead= await User.findOne({$and:[{_id:req.params.id},{TL:isUser.TL}]});
    //console.log(isUser_feedback);
    if(isUser_feedback || req.user===req.params.id || !isSameLead){//checking user feedback is exist or req user and feedback user is same
      return res.status(201).json({message:message.FEDDBACK_EXIST})
    }
      const user = await User.findById(req.params.id);
      
     // console.log(req.body.feedback );
      if (user) {
        const feedbac = {
         user: req.user, //initilize current user data       
         feedback: req.body.feedback,
         };
         user.feedbacks.push(feedbac);
         await user.save();
        res.status(201).json({
          message:message.FEEDBACK_POSTED
        })
       } else{
         res.status(401).json({
           message:message.USER_NOT_EXIST
         })
       }
       
    } catch (err) {
      console.log(err);
     res.status(500).json({
       message:message.INTERNAL_SERVER_ERROR
     })
    }
  }
  exports.getList=async function(req,res){
    try {
      
      const isUser=await User.findById(req.user);
      if(isUser && isUser.TL && isUser.TL!=='NA'){
        const list=await User.find({TL:isUser.TL},{_id:1,firstname:1,lastname:1,email:1});
        res.status(201).json({message:message.CHAMPION_CANTIDATE,list});
      }else{
        res.status(201).json({message:message.USER_NOT_EXIST});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:message.INTERNAL_SERVER_ERROR
      })
    }

  }

  module.exports.changePassword=async function(req,res){
    try {
        if(req.body.newPassword==req.body.confirmPassword){
            const isUser=await User.findById({_id:req.user});
            const passwordCheked=await bcrypt.compare(req.body.oldPassword,isUser.password)
            if(isUser && passwordCheked){
                isUser.password=await bcrypt.hash(req.body.newPassword,8);
                const updatedUser=await isUser.save();
                return res.status(201).json({
                    message:"Password changed successfully",
                    //user:updatedUser
                })
            }else{
                return res.status(401).json({
                    message:message.USER_NOT_EXIST
                })
            }
        }else{
            return res.status(401).json({
                message:message.USER_NOT_EXIST
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:message.INTERNAL_SERVER_ERROR,
            
        })
    }
}

 exports.historyMantain=async function(req,res){
try {
  const ids=await User.find({role:'tl'}).distinct('_id');
  const{noOfWeek,month,year}=date();
  for(var i=0;i<ids.length;i++){
    let vote=0,id=null;
    const userFeedback=await User.find({TL:ids[i]},{_id:1,feedbacks:1});
    for(var j=0;j<userFeedback.length;j++){//storing weekly champion
      if(userFeedback[j].feedbacks && userFeedback[j].feedbacks.length>vote){
        vote=userFeedback[j].feedbacks.length;
        id=userFeedback[j]._id;
      }
    }
    const isTl=await History.findOne({TL:ids[i]});
    if(isTl){
      isTl.history.push({champion:id,vote:vote,week:noOfWeek,month:month,year:year});
      const newH=await isTl.save();
      console.log(newH);
    }else{
    const newHistory=await History.create({TL:ids[i],history:[{champion:id,vote:vote,week:noOfWeek,month,year}]},);
    console.log(newHistory);
    }
  }
  const user = await User.updateMany({ $set: { feedbacks: [] } });
  console.log("History Updated successfully");
} catch (error) {
  console.log(error);
 
}
 }


 function date(){
  const nowDate=new Date();
    var currentDate=nowDate.getDate();
    var noOfWeek=0;
    var month=(nowDate.getMonth()+1);
    var year=nowDate.getFullYear();
    for(var i=1;i<=currentDate;i++){
        var date=year+'-'+month+'-'+i;
        
        const pastDate = new Date(date);
       // console.log(date);
        //console.log(pastDate.getDay())
        if(pastDate.getDay()==6)
        noOfWeek++;
        
    
    }
    return {noOfWeek,month,year}
 }