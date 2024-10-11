




const express = require('express');
const router = express.Router();
const { productadd, adminLogin, userlist, productlist } = require('../Controllers/adminController');
const upload = require('../Middleware/Multer');

router.post('/adminlogin', adminLogin);
router.get('/users', userlist);
router.post('/productadd', upload.single('imageFile'), productadd);
router.get('/productlist', productlist);

module.exports = router;



