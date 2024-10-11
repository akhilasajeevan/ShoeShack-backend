





const express =require("express");
const app = express();
require('dotenv').config()
const dbconnection=require('./config/dbconfig')
dbconnection.dbconfig()
const Userroutes=require("./Routes/Userroutes")
const Adminroutes=require('./Routes/Adminroutes')
const cors = require('cors')




app.use(express.json());
app.use(cors())
app.use("/",Userroutes)
app.use("/admin",Adminroutes)
app.use('/uploads', express.static('uploads'));



app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
  });


  
 


