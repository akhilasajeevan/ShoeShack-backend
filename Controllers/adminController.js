

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../Model/adminModel');
const secretKey = 'your_secret_key';
const Usermodel = require('../Model/Usermodel')
// const Product = require('../Model/productaddModel')
const productaddModel=require('../Model/productaddModel')

const adminLogin=async(req,res)=>{

try{
    const {adminUsername,adminPassword}=req.body;
   

    const admin=await adminModel.findOne({username:adminUsername});
  
    if(admin){
const isPasswordValid=await bcrypt.compare(adminPassword,admin.Password)



if(isPasswordValid){

const token=jwt.sign({id:admin._id},secretKey,{expiresIn:'1h'})
return res.json({
    message:"Login Successfull",
    success:true,
    token,
    username:admin.username,
    Emailaddress:admin.Emailaddress,
    Phonenumber:admin.Phonenumber
});
}else{

    return res.json({message:"incorrect password",success:false});
}
    }else{

    return res.json({message:"User not found",success:false});
    }
}catch(error){
    console.log("Error in admin login",error)
 return res.status(500).json({message:"an error occured",success:false});
}
};
module.exports={
    adminLogin
};

 




module.exports.userlist = async (req, res) => {
  try {
    
    const userlist = await Usermodel.find();
   
    if (userlist.length > 0) {
      return res.json({ status: true, userlist });
    } else {
      return res.json({ status: false, message: 'No users found' });
    }
  } catch (error) {
    console.log('Error fetching user list:', error);
    res.status(500).json({ message: 'An error occurred', success: false });
  }
};










module.exports.productadd = async (req, res) => {
  try {
    const { productName, description, price, category } = req.body;

    const newProduct = new productaddModel({
      productName,
      description,
      price: parseFloat(price),
      category,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await newProduct.save();
    return res.json({ message: 'Product added successfully', success: true });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'An error occurred', success: false });
  }
};

module.exports.productlist = async (req, res) => {
  try {
    const products = await productaddModel.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'An error occurred', success: false });
  }
};














