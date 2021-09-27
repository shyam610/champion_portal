const mongoose=require('mongoose');


const historyCOW=new mongoose.Schema({
   TL:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User',
       required: true
   },
   history:[{
       date:{
           type:Date,
           default: Date.now
       },
       champion:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
       },
       vote:{
           type:Number,
           
       },
       week:{
           type:Number,
           
       },
       month:{
           type:Number,
           
       },
       year:{
        type:Number,
        
    }
       
   }]

})

module.exports=new mongoose.model("History",historyCOW)