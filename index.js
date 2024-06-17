const express=require("express")
const ejs=require("ejs")
const app=express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const dotenv=require("dotenv")
dotenv.config()
const mongodb_connection=require("./config/database")
mongodb_connection()
app.use(express.urlencoded({ extended: true }))

const apiroute=require("./route/apiroute")
app.use("/api",apiroute)

const port=process.env.PORT||9000
app.listen(port,()=>{
    console.log(`server is running http://localhost:${port}`);
})