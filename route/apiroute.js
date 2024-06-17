const express=require("express")
const Apirouter=express.Router()

const {CreateUser,loginUser,UserDashboard, forgetPassword, updatePassword}=require("../controler/apicontroller")
const{AuthCheck}=require("../middleware/auth")
Apirouter.post("/create/user",CreateUser)
Apirouter.post('/user/login', loginUser)
Apirouter.get('/dashboard',AuthCheck,UserDashboard)
Apirouter.post('/forget/password',forgetPassword)
Apirouter.post('/update/password',AuthCheck,updatePassword)


module.exports=Apirouter