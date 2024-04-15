const express = require("express");
const router = express.Router();

const {
  listAppointments,
  saveAppointments,
} = require("../controllers/appointmentsController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth"); //APIGATEWAY

//routing the consultation routes--->
router.route("/list").get(isAuthenticatedUser,authorizeRoles('receptionist','admin'), listAppointments);
router.route("/save").post(isAuthenticatedUser,authorizeRoles('receptionist','admin'), saveAppointments);

module.exports = router;
