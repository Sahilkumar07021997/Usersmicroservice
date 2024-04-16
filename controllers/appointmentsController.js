const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const axios = require('axios');
const url = process.env.APPOINTMENTS_URL;
//----------------------------------------------------------------//


// Get list of Appointments    => api/v1/appointments/list

exports.listAppointments = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await axios.get(`${url}/appointments/list`);

        const appointments = response.data;
        res.status(200).json({ success: true, appointments });
    } catch (error) {
        // Handle errors
        return next(new ErrorHandler(error.response.data.message, error.response.status));
    }
});




// Save Appointment  => api/v1/appointments/save
exports.saveAppointments = catchAsyncErrors(async (req, res, next) => {
    try {
        const { doctorName, patientName, age, mobileNo, address,
            appointmentDate, appointmentTime, appointmentForDescription} = req.body;
 
        const response = await axios.post(`${url}/appointments/save`, {
            doctorName, patientName, age, mobileNo, address,
            appointmentDate, appointmentTime, appointmentForDescription
        });

        const savedAppointments = response.data;
        res.status(201).json({
            success: true,
            data: savedAppointments
        });
    } catch (error) {
        // Handle errors
        return next(new ErrorHandler(error.response.data.message, error.response.status));
    }
});


