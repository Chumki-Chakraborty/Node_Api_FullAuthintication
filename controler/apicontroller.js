const User = require("../model/usermodel")
const { hashPassword,comparePassword } = require("../middleware/auth")
const jwt= require('jsonwebtoken')
const CreateUser = async (req, res) => {
    try {
        const { name, email, password, mobile,first_school } = req.body;
        //validation
        if (!name) {
            return res.json({ message: "Name is Required" });
        }
        if (!email) {
            return res.json({ message: "Email is Required" });
        }
        if (!password) {
            return res.json({ message: "Password is Required" });
        }
        if (!mobile) {
            return res.json({ message: "Phone no is Required" });
        }
        if (!first_school) {
            return res.json({ message: "Phone no is Required" });
        }
        //check email user
        const exisitingUser = await User.findOne({ email});
        if (exisitingUser) {
            return res.status(500).json({
                success: false,
                message: "Already Register this Email  please login",
            });
        }
        
 //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            first_school
            
        })

        user.save()

        return res.status(200).json({
            status: true,
            message: "User Register Successfully",
            data: user,
        });

    } catch (error) {
        res.status(500).send({
            status: false,
            message: "Erorr in getting Register",
            error: error.message,
        });
    }

}
// loginuser
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
          //validation
          if (!email || !password) {
              return res.status(500).json({
                  status: false,
                  message: "Invalid email or password",
              });
          }
          //check user
          const user = await User.findOne({ email });
          //console.log('getuser',user);
          if (!user) {
              return res.status(500).json({
                  status: false,
                  message: "Email is not registerd",
              });
          }
          const matchPassword = await comparePassword(password, user.password);
          if (!matchPassword) {
              return res.status(500).json({
                  status: false,
                  message: "Invalid Password",
              });
          }
          const token = await jwt.sign({
               _id: user._id,
               name:user.name,
               email:user.email,
               mobile:user.mobile,
              }, process.env.JWT_SECRET, { expiresIn: "12h" });
              return res.status(201).json({
              status: true,
              message: "login successfully",
              user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  mobile: user.mobile,
              },
              token,
          });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "Erorr in getting Register",
        error: error.message,
      });
    }
  
  }
//   
const UserDashboard=(req,res)=>{
    return res.status(500).json({
      status:true,
      message: "welcome to user dashboard",
  });
  }
//for forget password
const forgetPassword=async(req,res)=>{
    try{
      const{email,first_school,newPassword}=req.body;
      if(!email){
         return res.status(500).json({message:"Email is required"})
      }
      if(!first_school){
          return  res.status(500).json({message:"school name is required"})
      }
      if(!newPassword){
          return  res.status(500).json({message:"New Password is required"})
      }
      //check email exist or not
      const user=await User.findOne({email,first_school});
      if(!user){
          return res.status(404).json({
              success:false,
              message:"wrong Email or school name"})
      }
      const heased=await hashPassword(newPassword);
      await User.findByIdAndUpdate(user._id,{
           password:heased
        
      })
      return res.status(200).json({
          success:true,
          message:"Password Reset Successfully"})
  
  }catch(error){
      console.log(error);
      return res.status(500).json({
          success: false,
          message: "Errro in forget password",
          error,
      });
  }
  
  }
//update password 
const updatePassword=async(req,res)=>{
    try {
      const user_id = req.body.user_id;
    //   const {password }= req.body;
    const {update_password }= req.body
  
      //check userid exist ir not
      const data = await User.findOne({ _id: user_id });
      if (data) {
          const newPassword = await hashPassword(update_password);
          const userData = await User.findByIdAndUpdate({ _id: user_id }, {
              $set: {
                  
                   password: newPassword,
                
              }
          })
  
          res.status(201).json({ success: true, "msg": "your password hasbeen updated" });
      } else {
          res.status(400).json({ succses: false, "msg": "user id Not found" })
      }
  
  } catch (error) {
      res.status(400).json(error.message)
  }
  
  }  
module.exports = {
    CreateUser,
    loginUser,
    UserDashboard,
    forgetPassword,
    updatePassword
}