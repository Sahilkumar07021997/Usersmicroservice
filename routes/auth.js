const express = require('express');
const router = express.Router();

const { registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    logout,
    getAllUsers,
    getUserProfile,
    updatePassword,
    updateprofile, 
    allUsers,
    updateUser,
    deleteUser,
    getUserDetails} = require('../controllers/authController');
    
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');

//routing the AUTH routes--->
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateprofile);
router.route('/users').get(isAuthenticatedUser,getAllUsers);
router.route('/logout').get(logout);

router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),allUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
        .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
        .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);


    
module.exports = router;