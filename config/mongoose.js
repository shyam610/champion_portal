const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/COW',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
    
    
})

const db=mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to db"));

db.once("open", () => console.log("database connected successfully"));

module.exports = db;