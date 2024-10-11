const jwt=require('jsonwebtoken');
const secretKey="your_secret_key";


module.export=(req,res,next)=>{

const token=req.headers['authorization']
if(!token){
return res.status(401).json({message:"Access denied.No token provided"});


}try{
//  const  decoded=jwt.verify(token,secretKey);
const decoded=jwt.verify(token,"adminJWT");
  if(!decoded.isAdmin){
return res.status(403).json({message:"Access denied.No token provided"})


  } 
  req.user=decoded;
  next();

}catch(error){

res.status(400).json({message:"invalid token"})

}
};