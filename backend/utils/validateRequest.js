const validation = require('./validation') 

module.exports = (validateReq) => async (req,res,next) =>{
    if (!validation[validateReq]) {
        return res.status(401).json({ success: false, data: [], message: 'Validation Request Not Exist' })
    }
    try {
        const value = await validation[validateReq].validateAsync(req.body);
        req.body = value
        next();
    } catch (error) {
        return res.status(401).json({ success: false, data: [], message: error.message });
        
    }
}