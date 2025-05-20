import joi from "joi"
export const signupValidation=(req,res,next)=>{
    // console.log(req.body);
    const Schema=joi.object({
        name:joi.string().min(3).max(100).required(),
        email:joi.string().email().required(),
        password:joi.string().min(4).max(100).required(),

    });
    const {error}=Schema.validate(req.body);
    if(error )
    {
        return res.status(400).json({message:"Bad request Did Not Matched required Format ",error});
    }
    next();
}
export const loginValidation=(req,res,next)=>{   
    const Schema=joi.object({
        email:joi.string().email().required(),
        password:joi.string().min(4).max(100).required(),

    }).required().min(1);
    const {error}=Schema.validate(req.body);
    if(error)
    {
        return res.status(400).json({message:"Bad request",error});
    }
    next();
}

