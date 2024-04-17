const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const axios = require('axios');
const url = process.env.CONSULTATIONS_URL;
//----------------------------------------------------------------//


// List of Consultations  => api/v1/consultations/list

exports.listConsultations = catchAsyncErrors(async (req, res, next) => {
    try {
        const response = await axios.get(`${url}/consultations/list`);

        const consultations = response.data;
        res.status(200).json({ success: true, consultations });
    } catch (error) {
        // Handle errors
        return next(new ErrorHandler(error.response.data.message, error.response.status));
    }
});




// Save Consultation  => api/v1/consultations/save
exports.saveConsultations = catchAsyncErrors(async (req, res, next) => {
    try {
        const { appointmentId, prescription } = req.body;
 
        const response = await axios.post(`${url}/consultations/save`, {
            appointmentId,
            prescription
        });

        const savedConsultation = response.data;
        res.status(201).json({
            success: true,
            data: savedConsultation
        });
    } catch (error) {
        // Handle errors
        return next(new ErrorHandler(error.response.data.message, error.response.status));
    }
});

// saveFeedback Consultation  => api/v1/consultations/feedback
exports.saveFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const { consultationId, rating, feedback } = req.body;
 
        const response = await axios.post(`${url}/consultations/feedback`, {
            consultationId, rating, feedback
        });

        const savedFeedback = response.data;
        res.status(201).json({
            success: true,
            data: savedFeedback
        });
    } catch (error) {
        // Handle errors
        return next(new ErrorHandler(error.response.data.message, error.response.status));
    }
});

// listAppConsultations Consultation  => api/v1/consultations/listAppConsultations
exports.listAppConsultations = catchAsyncErrors(async (req, res, next) => {
    try {

        const response = await axios.get(`${url}/consultations/listAppConsultations`);

        const listAppConsultations = response.data;
        res.status(201).json({
            success: true,
            data: listAppConsultations
        });
    } catch (error) {
        // Handle errors
        return next(new ErrorHandler(error.response.data.message, error.response.status));
    }
});

