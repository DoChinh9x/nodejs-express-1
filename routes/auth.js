const router = require('express').Router();
const {register, login,getMe, forgotPassword,resetPassword
,updateDetails1,updatePassword, logout,refreshToken }= require('../controllers/auth');
const {protect} = require('../middlewares/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.get('/logout',protect,logout);
router.post('/forgot',forgotPassword);
router.put('/resetpassword/:resettoken',resetPassword);
router.put('/updatedetails',updateDetails1);
router.put('/updatepassword',updatePassword);
router.post("/refreshtoken", refreshToken);


module.exports = router;