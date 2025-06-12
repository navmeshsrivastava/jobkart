if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const Job = require('./models/jobModel');
const User = require('./models/userModel.js');

const jobRoutes = require('./routes/jobs');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const { globalErrorHandler } = require('./middleware.js');
const ExpressError = require('./utils/ExpressError');
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log('connected successfully');

    app.listen(3000, (req, res) => {
      console.log('app is listening on port 3000.');
    });
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on('error', () => {
  console.log('error in mongo session store', err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 100,
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static('public'));
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/boilerplate');

app.use((req, res, next) => {
  res.locals.successMsg = req.flash('success');
  res.locals.deleteMsg = req.flash('delete');
  res.locals.errorMsg = req.flash('error');
  res.locals.currUser = req.user;
  res.locals.req = req;
  next();
});

app.get('/', (req, res) => {
  res.redirect('/job');
});

app.use('/job', jobRoutes);

app.use('/auth', authRoutes);

app.use('/user', userRoutes);

app.use(globalErrorHandler);

app.use((req, res) => {
  res.status(404).render('layouts/404.ejs');
});
