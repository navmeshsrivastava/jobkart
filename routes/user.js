const express = require('express');
const router = express.Router();
const {
  isLoggedIn,
  isSeeker,
  isRecruiter,
  isJobOwner,
} = require('../middleware');
const userController = require('../controllers/userController');

// Redirect to /user/my-profile
router.get('/', isLoggedIn, userController.redirectToProfile);

// Profile Page
router.get('/my-profile', isLoggedIn, userController.getMyProfile);

// Unregister Job (Seeker)
router.delete(
  '/:userId/unregister-job/:jobId',
  isLoggedIn,
  isSeeker,
  userController.unregisterJob
);

// Delete Job (Recruiter)
router.delete(
  '/:userId/delete-job/:jobId',
  isLoggedIn,
  isRecruiter,
  isJobOwner,
  userController.deleteJob
);
// Jobs Applied (Seeker) / Jobs Posted (Recruiter)
router.get('/:userId', isLoggedIn, userController.viewUserJobs);

module.exports = router;
