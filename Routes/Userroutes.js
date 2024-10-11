const express=require("express")
const { signup,login,getProductById,products, addtocart,addtowishlist,getcart, removecartitem, updatecartitem,getwishlist } = require("../Controllers/Usercontroller")
const router=express.Router()



router.post("/signup",signup)
router.post("/login", login);
router.get("/products",products)

router.get("/products/:id",getProductById)
router.post("/addtocart/:productId/:userId",addtocart)
router.post("/addtowishlist/:productId/:userId",addtowishlist)
router.post('/signup',signup)

router.get('/cart/:userId', getcart);
router.delete('/cart/remove/:userId/:productId', removecartitem);
router.put('/cart/update/:userId/:productId', updatecartitem);
router.get('/wishlist/:userId', getwishlist);
module.exports=router
