import User from "../models/user.model.js";


// 1: signup 
export const signup = async(req,res,next)=>{
    try{
        console.log('hi from signup controller.', req.body);
        res.send('hi from the server');
    }catch(err){
        console.log(err.message);
        // next(err);
    }
}