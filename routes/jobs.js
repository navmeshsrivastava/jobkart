const express = require("express");
const router = express.Router();
const multer =  require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const {
    showAllJobs,
    renderCreateForm,
    createJob,
    renderApplyForm,
    applyJob,
    showJob,
    viewApplicants,
    acceptApplicant,
    rejectApplicant,
    renderEditForm,
    updateJob
} = require("../controllers/jobController");

const {
    isLoggedIn,
    isRecruiter,
    isSeeker,
    isJobOwner,
    isApplied
} = require("../middleware");

// INDEX - View all jobs
router.get('/', showAllJobs);

// RENDER JOB-FORM
router.get('/create', isLoggedIn, isRecruiter, renderCreateForm);

// CREATE A JOB
router.post('/create', isLoggedIn, isRecruiter, createJob);

// RENDER APPLY-FORM
router.get('/:jobId/apply', isLoggedIn, isSeeker, renderApplyForm);

// APPLY JOB
router.post('/:jobId/apply', isLoggedIn, isSeeker, upload.single("user[resumeLink]"), applyJob);

// RENDER SHOW-JOB
router.get('/:jobId', showJob);

// VIEW APPLICANTS
router.get("/:jobId/applicants", isLoggedIn, isJobOwner, viewApplicants);

// ACCEPT AN APPLICANT
router.put("/:jobId/applicants/:userId/accept", isLoggedIn, isRecruiter, isJobOwner, isApplied, acceptApplicant);

// REJECT AN APPLICANT
router.put("/:jobId/applicants/:userId/reject", isLoggedIn, isRecruiter, isJobOwner, isApplied, rejectApplicant);

// RENDER EDIT FORM
router.get('/:jobId/edit', isLoggedIn, isRecruiter, isJobOwner, renderEditForm);

// EDIT JOB
router.put('/:jobId', isLoggedIn, isRecruiter, isJobOwner, updateJob);

module.exports = router;
