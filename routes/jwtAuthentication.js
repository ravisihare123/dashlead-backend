const jwt = require("jsonwebtoken");
const config = require("../secret.json")

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = await jwt.verify(token,config.secret);
        console.log(decoded);
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            message: 'Auth failed'
            
        })
    }
}