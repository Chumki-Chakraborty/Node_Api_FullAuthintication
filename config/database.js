const mongoose=require("mongoose")

const ConnectDb=async(req,res)=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URL)
        console.log(`mongodb connected ${conn.connection.host}`);

    }catch(error){
        console.log(`mongodb not connceted ${error}`);
    }
}

module.exports=ConnectDb