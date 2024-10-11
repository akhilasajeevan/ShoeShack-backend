const jwt = require("jsonwebtoken");
const Usermodel = require("../Model/Usermodel");
const productaddModel = require("../Model/productaddModel");
const bcrypt = require("bcrypt");
const secretKey = "your_secret_key";

module.exports.signup = async (req, res) => {
  try {
    const { username, Emailaddress, Password, Phonenumber } = req.body;

    const emailExist = await Usermodel.findOne({ Emailaddress: Emailaddress });
    if (emailExist) {
      return res.json({ message: "Email already exists", status: false });
    }

    const newUser = new Usermodel({
      username: username,
      Emailaddress: Emailaddress,
      Password: Password,
      Phonenumber: Phonenumber,
    });
    const userDetails = await newUser.save();

    return res.json({
      message: "Account created successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error in sign up",
      status: false,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const customer = await Usermodel.findOne({ username });
    if (customer) {
      const auth = await bcrypt.compare(password, customer.Password);
      if (auth) {
        const token = jwt.sign({ id: customer._id }, secretKey, {
          expiresIn: "1h",
        });
        return res.json({
          message: "Login successful",
          success: true,
          token,
          username: customer.username,
        }); 
      } else {
        return res.json({ message: "Incorrect password", success: false });
      }
    } else {
      return res.json({ message: "User not found", success: false });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "An error occurred", success: false });
  }
};

module.exports.products = async (req, res) => {
  try {
    const products = await productaddModel.find();
    if (products) {
      res.json({ status: true, products });
    } else {
      res.json({ status: false, message: "No products found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "server error" });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const product = await productaddModel.findByid(req.params.id);
    if (product) {
      res.json({ status: true, product });
    } else {
      res.json({ status: false, message: "product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "server error" });
  }
};


module.exports.addtocart = async (req, res) => {
 
  const { userId, productId } = req.params;
  try {
    const user = await Usermodel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const product = await productaddModel.findById(productId);

    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    const isCarted = user.cart.some(item => item.product._id.toString()=== productId);

    if (isCarted) {
      return res.json({ status: false, message: "Product is already in the cart" });
    }

    const newCart = await Usermodel.findByIdAndUpdate(userId,{
      $push:{cart:{product:product}
    }})
    console.log(newCart)
    

    await user.save();

    res.json({ status: true, cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
// from wishlist
module.exports.addtowishlist = async (req, res) => {
 
  const { userId, productId } = req.params;
  try {
    const user = await Usermodel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const product = await productaddModel.findById(productId);

    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    const isWishlisted = user.wishlist.some(item => item.id === productId);

    if (isWishlisted) {
      return res.json({ status: false, message: "Product is already in the cart" });
    }

    const newWishlist = await Usermodel.findByIdAndUpdate(userId,{
      $push:{wishlist:{product:product}
    }})
    console.log(newWishlist)
    

    await user.save();

    res.json({ status: true, cart: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
}

// to wishlist
module.exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productaddModel.findById(id);
    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }
    res.json({ status: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};







module.exports.getcart = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Usermodel.findById(userId).populate('cart.product');
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    res.json({ status: true, cartItems: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};


module.exports.getwishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Usermodel.findById(userId).populate('wishlist.product');
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
    res.json({ status: true, isWishlisted: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};








module.exports.removecartitem = async (req, res) => {
  const { userId, productId } = req.params;
  console.log(productId,userId)
  try {
    const user = await Usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }
   user.cart= user.cart.filter(item => item.product._id.toString() !== productId);
   
    await user.save();
    res.json({ status: true, cartItems: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};



module.exports.updatecartitem = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const user = await Usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    
    let cartItemUpdated = false;
    user.cart = user.cart.map(item => {
      if (item.product._id.toString() === productId) {
        item.quantity = quantity;
        cartItemUpdated = true;
      }
      return item;
    });

    if (cartItemUpdated) {
      await user.save();
      res.json({ status: true, cartItems: user.cart });
    } else {
      res.status(404).json({ status: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};
