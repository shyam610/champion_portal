const express=require('express');
const app=express();
const cookieParser = require("cookie-parser");
const mongoose=require('./config/mongoose');
const port=process.env.port || 4000

//conver json to object
app.use(express.json());

app.use(cookieParser());
//routes the master url

app.use(express.urlencoded());
app.use("/", require("./routes"));

app.listen(port,(error)=>{
    if (error) console.log("Error to connect server port");
  else console.log("Successfully connect to server  port number " + port);
})



