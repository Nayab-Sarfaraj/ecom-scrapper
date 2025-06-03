const Errorhandler = require("../utils/errorHandler");

module.exports=async(err,req,res,next)=>{
    console.log(err.message)
    err.message=err.message||"Something went wrong"
    err.status=err.status||500
    return res.status(err.status).json({
        success:false,
        message:err.message
    })
}
