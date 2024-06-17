const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
    try {
        const saltPassword = 10;
        const hashPassword = await bcrypt.hash(password, saltPassword)
        return hashPassword;
    } catch (error) {
        console.log(error);
    }

}
// 
const comparePassword = async (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
};
// AuthCheck
const AuthCheck = async (req, res, next) => {

    const Token = req.body.Token || req.query.Token || req.headers["x-access-token"];

    if (!Token) {
        return res.status(403).json({ "status": false, "message": "you are not authenticatte user" });
    }
    try {
        const decoded = jwt.verify(Token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('jj',req.user);
    } catch (err) {
        return res.status(401).send({ "status": false, "message": "invalid Token Access" });
    }
    return next();

}


module.exports={
  hashPassword,
  comparePassword,
  AuthCheck
}