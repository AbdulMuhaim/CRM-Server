const express=require("express")
const app=express()
require("dotenv").config()
const PORT=process.env.PORT
const adminUserRoute=require("./Routes/adminUserRoute")
const formRoute=require("./Routes/formRoute")
const mongoose = require("mongoose")
const cors=require("cors")

app.use(cors())
app.use(express.json())

app.use("/",adminUserRoute)
app.use("/",formRoute)

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI,{}).then(()=>{
    app.listen(PORT,()=>{
        console.log("server listening on port 8000")
    })
}).catch((err)=>{
    console.log(err)
})

