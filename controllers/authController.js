const passport = require('passport');
const User = require('../models/userModel');
const ExpressError = require('../utils/ExpressError');

module.exports.getSignupPage = (req, res) => {
  res.render('users/signup-form.ejs');
};

module.exports.postSignup = async (req, res, next) => {
  try {
    const { username, name, countryCode, phone, role, email, password } =
      req.body.user;

    if (
      !username ||
      !name ||
      !countryCode ||
      !phone ||
      !role ||
      !email ||
      !password
    ) {
      return next(new ExpressError(400, 'All fields are required.'));
    }

    if (
      typeof username !== 'string' ||
      typeof name !== 'string' ||
      typeof role !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return next(new ExpressError(400, 'Invalid input types.'));
    }

    if (isNaN(Number(countryCode)) || isNaN(Number(phone))) {
      return next(
        new ExpressError(400, 'Country code and phone must be numbers.')
      );
    }

    const newUser = new User({
      username,
      name,
      countryCode,
      phone,
      role,
      email,
    });

    const registeredUser = await User.register(newUser, password);
    await new Promise((resolve, reject) => {
      req.login(registeredUser, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    let redirectUrl = res.locals.redirectUrl || '/job';
    req.flash('success', 'Welcome to Jobkart!');
    res.redirect(redirectUrl);
  } catch (e) {
    return next(e);
  }
};

module.exports.getLoginPage = (req, res) => {
  res.render('users/login-form.ejs');
};

module.exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid username or password!',
  })(req, res, () => {
    let redirectUrl = res.locals.redirectUrl || '/job';
    req.flash('success', 'Welcome back to Jobkart');
    res.redirect(redirectUrl);
  });
};

module.exports.logout = (req, res, next) => {
  const redirectUrl = req.query.redirect || '/job';
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'You have logged out successfully!');
    res.redirect(redirectUrl);
  });
};
