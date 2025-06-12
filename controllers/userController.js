const User = require('../models/userModel');
const Job = require('../models/jobModel');
const ExpressError = require('../utils/ExpressError');

// Redirecting to /user/my-profile
module.exports.redirectToProfile = (req, res) => {
  res.redirect('/user/my-profile');
};

// TO OPEN PROFILE PAGE
module.exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ExpressError(404, 'User not found'));
    }
    res.render('users/profile.ejs', { user });
  } catch (err) {
    next(err);
  }
};

// RENDER JOBS-POSTED or JOBS-APPLIED
module.exports.viewUserJobs = async (req, res, next) => {
  try {
    let user;
    if (req.user.role === 'seeker') {
      user = await User.findById(req.params.userId).populate('appliedJobs');
      if (!user) {
        return next(new ExpressError(404, 'User not found'));
      }
      return res.render('users/jobs-applied.ejs', { user });
    } else {
      user = await User.findById(req.user._id).populate('postedJobs');
      if (!user) {
        return next(new ExpressError(404, 'User not found'));
      }
      return res.render('users/jobs-posted.ejs', { user });
    }
  } catch (err) {
    next(err);
  }
};

// UNREGISTER A JOB (Seeker removes application)
module.exports.unregisterJob = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { appliedJobs: req.params.jobId },
    });

    await Job.findByIdAndUpdate(req.params.jobId, {
      $pull: { applicants: { user: req.params.userId } },
    });

    req.flash('delete', 'You unregistered yourself from the job!');

    res.redirect(`/user/${req.params.userId}`);
  } catch (err) {
    next(err);
  }
};

// DELETE A JOB (Recruiter deletes posted job)
module.exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return next(new ExpressError(404, 'Job not found'));
    }

    if (req.params.userId.toString() !== job.owner.toString()) {
      return next(
        new ExpressError(403, 'You are not authorized to delete this job')
      );
    }

    // Removing this job from all applicants' appliedJobs
    for (let i = 0; i < job.applicants.length; i++) {
      await User.findByIdAndUpdate(job.applicants[i].user, {
        $pull: { appliedJobs: job._id },
      });
    }

    // Removing from recruiter's postedJobs
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { postedJobs: req.params.jobId },
    });

    await Job.findByIdAndDelete(req.params.jobId);
    req.flash('delete', 'Job deleted successfully!');

    res.redirect(`/user/${req.params.userId}`);
  } catch (err) {
    next(err);
  }
};
