const User = require('../models/user');
const errorHandler = require('../utils/errorHandlerFunction');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
// const cloudinary = require('cloudinary').v2;
//----------------------------------------------------------------//

// Register a new User =>/api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    //debugger;
    try {
        const { name, email, password, role } = req.body;
 
        const user = await User.create({
            name,
            email,
            password,
            role
        })
    
        sendToken(user, 200, res);
    } catch (error) {
        console.log(error);
       return errorHandler(res,error,500)
    }
    
}) 

// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
// debugger
    const { email, password } = req.body;

    //check is email and password is enteres by user
    if (!email || !password) {
        return errorHandler(res,'please enter email id and password',400); //bad request-400
    }

    //finding user in DB and and responding to client request
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return errorHandler(res,'invalid email or password',401);
    }

    //checking if entered password is correct or not
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return errorHandler(res,'incorrect password', 401);
        //unauthorized user-401
    }

    return sendToken(user, 200, res);
})

//Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
     
    if (!user) {
        return errorHandler(res,'User not found with this email',404);
    }

    //if it exist then get the reset token
    const resetToken = user.getResetPasswordToken();
    //and then save the user without validating ,becoz no need to
    await user.save({ validateBeforeSave: false });

    //create reset password URL and sending to client
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`; //use this during deployment!!
   // const resetUrl = ` http://localhost:3000/api/v1/password/reset/${resetToken}`;  //use during local

    const message = `your password reset token is as follows:\n\n ${resetUrl}\n\nif u have not requested this email then ignore  it!😎 `
    
    //console.log(user.email);
    //use try and catch to sent the recovery mail to the client consisting the url RESET password
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Recovery mail',
            message
        })
        res.status(200).json({
            success: true,
            message:`Recovery 🥱 Email sent to ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return errorHandler(res,error.message,500);
    }
    
})

//Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //console.log(req)
    // debugger;
    //so first step is to hash the token present in Req.params.token and compare it with the one which is in the DB 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //now find the user which has the same token and expire time greater than Date.now()
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user) {
        return errorHandler(res,'Reset password token is invalid or expired!',400)
    }

    //if user entered wrong password then
    if (req.body.password !== req.body.password) {
        return errorHandler(res,'Password does not match😑',400)
    }

    //if password entered is correct then just replace the password in User.schema with the password entered by the user now!
    user.password = req.body.password;

    //after that set token as undefined and save the user
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

})
// get currently logged in user's profile details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
        return errorHandler(res,'login First to check user profile',404);
    }
    
})

// Update/change user Password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //check previous user password entered by user
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return errorHandler(res,'Old password is incorrect',404);
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)
})

//Update user profile => api/v1/me/update

exports.updateprofile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //update Avatar --not required!

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message:"user's profile is updated!😎"
    })
})

// LogOut user and remove the Token! => api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        success: true,
        expires: new Date(Date.now())
    })

    res.status(200).json({
        success: true,
        message: 'User logged out!'
    })
})

// Get all users => /api/v1/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    // All users where role is not "admin"
    const users = await User.find({ role: { $ne: "admin" } });

    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});


//ADMIN ROUTES ----------------------------------------------------------------

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    
    const users = await User.find();

    res.status(200).json({
        success: true,
        count: users.length,
        users
    })

})

//get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return errorHandler(res,`user does not found with id: ${req.params.id} 😑`,404);
    }

    res.status(200).json({
        success: true,
        message: 'user details 😎',
        user
    })
})

//Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message:"user's profile is updated! via admin route😎"
    })
})

//delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    var name = user.get('name');
    
    if (!user) {
        return errorHandler(res,`user does not found with id: ${req.params.id} 😑`,404);
    }
     //also remove the avatar from the cloudinary TODO
    
    await user.remove();
    
    res.status(200).json({
        success: true,
        message: `user ${name} deleted successfully😨`,
    
    })
})