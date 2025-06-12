const Job = require('./models/jobModel.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === 'POST' || req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.path === '/logout') {
      return res.redirect('/job');
    }
    req.session.redirectUrl = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isRecruiter = (req, res, next) => {
  if (req.user.role !== 'recruiter') {
    return next(new ExpressError(403, 'Unauthorized access'));
  }
  next();
};

module.exports.isSeeker = (req, res, next) => {
  if (req.user.role !== 'seeker') {
    return next(new ExpressError(403, 'Unauthorized access'));
  }
  next();
};

module.exports.isJobOwner = async (req, res, next) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);

  if (!job) {
    return next(new ExpressError(404, 'Job not found'));
  }

  if (!job.owner.equals(req.user._id)) {
    return next(new ExpressError(403, 'Unauthorized access'));
  }

  next();
};

module.exports.isApplied = async (req, res, next) => {
  const { jobId, userId } = req.params;
  const job = await Job.findById(jobId);

  if (!job) {
    return next(new ExpressError(404, 'Job not found'));
  }

  const applicant = job.applicants.find(
    (app) => app.user.toString() === userId.toString()
  );
  if (!applicant) {
    res.redirect('/job');
  }
  next();
};

module.exports.globalErrorHandler = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  req.flash('error', err.message || 'Something went wrong');
  res.redirect('/job');
};
