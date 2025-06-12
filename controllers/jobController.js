const Job = require('../models/jobModel');
const User = require('../models/userModel');
const ExpressError = require('../utils/ExpressError');

// Showing all jobs
module.exports.showAllJobs = async (req, res) => {
  const allJobs = await Job.find({});

  res.render('jobs/index.ejs', { allJobs });
};

// Rendering job creation form
module.exports.renderCreateForm = async (req, res) => {
  res.render('jobs/job-form.ejs');
};

// Creating a new job
module.exports.createJob = async (req, res, next) => {
  try {
    let job = req.body.job;

    const requiredFields = [
      'role',
      'company',
      'location',
      'salary',
      'category',
      'description',
      'skills',
    ];

    for (let field of requiredFields) {
      if (!job[field] || job[field].toString().trim() === '') {
        return next(new ExpressError(400, `${field} is required`));
      }
    }

    if (isNaN(job.salary)) {
      return next(new ExpressError(400, 'Salary must be a number'));
    }

    if (typeof job.skills === 'string') {
      job.skills = job.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill);
    }

    job.owner = req.user._id;

    const newJob = new Job(job);

    await newJob.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { postedJobs: newJob._id },
    });

    req.flash('success', 'Job created successfully!');
    res.redirect(`/user/${req.user._id}`);
  } catch (err) {
    next(err);
  }
};

// Rendering job apply form
module.exports.renderApplyForm = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return next(new ExpressError(404, 'Job not found'));
    }

    if (job.status === 'closed') {
      return next(new ExpressError(400, 'Job is currently closed'));
    }

    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return next(new ExpressError(409, 'Already applied'));
    }

    res.render('jobs/apply-form.ejs', { jobId: req.params.jobId });
  } catch (err) {
    next(err);
  }
};

// Applying to a job
module.exports.applyJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return next(new ExpressError(404, 'Job not found'));
    }

    if (job.status === 'closed') {
      return next(new ExpressError('Job is currently closed', 400));
    }

    if (!req.file) {
      return next(new ExpressError(400, 'Resume file is required'));
    }

    const { user, reason } = req.body.user;

    if (!user || user.toString().trim() === '') {
      return next(new ExpressError(400, 'User ID is required'));
    }

    if (!reason || reason.toString().trim() === '') {
      return next(new ExpressError(400, 'Reason for applying is required'));
    }

    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === user.toString()
    );

    if (alreadyApplied) {
      return next(new ExpressError(409, 'Already applied'));
    }

    const resumeLink = {
      url: req.file.path,
      filename: req.file.filename,
    };

    job.applicants.push({ user, resumeLink, reason });

    await job.save();

    await User.findByIdAndUpdate(user, {
      $push: { appliedJobs: req.params.jobId },
    });

    req.flash('success', 'Applied for the job successfully!');
    res.redirect(`/job/${req.params.jobId}`);
  } catch (err) {
    next(err);
  }
};

// Showing job detail page
module.exports.showJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return next(new ExpressError(404, 'Job not found'));
    }

    let alreadyApplied = false;

    if (req.user) {
      alreadyApplied = job.applicants.some(
        (app) => app.user.toString() === req.user._id.toString()
      );
    }

    res.render('jobs/show.ejs', { job, alreadyApplied });
  } catch (err) {
    next(err);
  }
};

// Viewing applicants
module.exports.viewApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId).populate({
      path: 'applicants',
      populate: {
        path: 'user',
      },
    });

    if (!job) {
      return next(new ExpressError(404, 'Job not found'));
    }

    res.render('jobs/job-applicants.ejs', { job });
  } catch (err) {
    next(err);
  }
};

// Accepting an applicant
module.exports.acceptApplicant = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return next(new ExpressError(404, 'Job not found'));
    }

    const applicant = job.applicants.find(
      (app) => app.user.toString() === req.params.userId.toString()
    );

    if (!applicant) {
      return next(new ExpressError(404, "There's no such applicant"));
    }

    applicant.applicationStatus = 'accepted';

    await job.save();

    req.flash('success', 'You accepted the applicant for the job!');

    res.redirect(`/job/${req.params.jobId}/applicants`);
  } catch (err) {
    next(err);
  }
};

// Rejecting an applicant
module.exports.rejectApplicant = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return next(new ExpressError(404, 'Job not found'));
    }

    const applicant = job.applicants.find(
      (app) => app.user.toString() === req.params.userId.toString()
    );

    if (!applicant) {
      return next(new ExpressError(404, "There's no such applicant"));
    }

    applicant.applicationStatus = 'rejected';

    await job.save();

    req.flash('delete', 'You rejected the applicant for the job!');

    res.redirect(`/job/${req.params.jobId}/applicants`);
  } catch (err) {
    next(err);
  }
};

// Rendering edit form
module.exports.renderEditForm = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return next(new ExpressError(404, 'Job not found'));
    }

    res.render('jobs/edit.ejs', { job });
  } catch (err) {
    next(err);
  }
};

// Editing a job
module.exports.updateJob = async (req, res, next) => {
  try {
    const jobData = req.body.job;

    // Simple required field check
    const requiredFields = [
      'role',
      'company',
      'location',
      'salary',
      'category',
      'description',
    ];
    for (let field of requiredFields) {
      if (!jobData[field] || jobData[field].toString().trim() === '') {
        throw new ExpressError(400, `${field} is required.`);
      }
    }

    // Salary should be a number
    if (isNaN(jobData.salary)) {
      throw new ExpressError(400, 'Salary must be a number.');
    }

    await Job.findByIdAndUpdate(req.params.jobId, jobData, {
      runValidators: true,
      new: true,
    });

    req.flash('success', 'Job updated successfully!');
    res.redirect(`/user/${req.user._id}`);
  } catch (err) {
    next(err);
  }
};
