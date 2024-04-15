const express = require("express");
const router = express.Router();

const {
  listConsultations,
  saveConsultations,
  saveFeedback,
  listAppConsultations
} = require("../controllers/consultationsController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth"); //APIGATEWAY

//routing the consultation routes--->
router.route("/list").get(isAuthenticatedUser,authorizeRoles('jrDoctor','admin'), listConsultations);
router.route("/save").post(isAuthenticatedUser, authorizeRoles('jrDoctor','admin'), saveConsultations);
router.route("/listAppConsultations").get(isAuthenticatedUser, authorizeRoles('jrDoctor','admin'), listAppConsultations);

router.route("/feedback").post(isAuthenticatedUser,authorizeRoles('patient','admin'), saveFeedback);

module.exports = router;
