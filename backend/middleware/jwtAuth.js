var jwt = require('jsonwebtoken');

module.exports = (expectedRole) => (req,res,next) =>{
    
    const authorization = req.get("Authorization")
    if (!authorization) {
        return res.status(401).json({message: "Token Required!!!!"})

    }
    const token = authorization.split(' ')[1]
    let decoded;
    try {
        decoded = jwt.verify(token,process.env.SECRET_KEY);
    } catch (error) {
        return res.status(401).json({message: error.message})
    }
    
    if (!expectedRole.includes(decoded.role)) {
        return res.status(401).json({message: "Unauthorized !!!!!"})
    }
    req.user = decoded.email
    next()
}