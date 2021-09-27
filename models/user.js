const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
firstname:{
    type: String,
    min:2,
    max:16,
    trim:true,
    required:true
},
lastname:{
    type: String,
    min:2,
    max:16,
    trim:true
},
email:{
    type: String,
    trim: true,
    lowercase:true,
    unique: true,
    required:true
},
password:{
    type: String,
    trim: true,
    min:8,
    max: 12,
    required: true

},
role:{
    type: String,
    enum:['user','admin','tl'],
    default: 'user',
    lowercase:true

},
TL:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    default:undefined
},
designation:{
  type: String,
 
  trim: true
},
location:{
  type: String,
 
  trim: true
},
department:{
  type: String,
  
  trim: true
},
feedbacks:[{
  user:{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    require:true
  },
  feedback:{
    type:String,

  }

}]


},{timestamps:true})

userSchema.methods.generateAuthToken = async function () {
    try {
      const SECRET_KEY = "mynameisshyamnarayanwebdeveloper";
      let token = jwt.sign({ _id: this._id }, SECRET_KEY,{
        expiresIn:'600000ms'
      });
      
      await this.save();
      return token;
    } catch (err) {
      console.log(err);
    }
  };
  userSchema.methods.generateAdminAuthToken = async function () {
    try {
      const SECRET_KEY = "adminnameisshyamnarayanwebdeveloper";
      let token = jwt.sign({ _id: this._id }, SECRET_KEY,{
        expiresIn:'600000ms'
      });
      
      await this.save();
      return token;
    } catch (err) {
      console.log(err);
    }
  };

module.exports=mongoose.model('User',userSchema);