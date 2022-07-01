const Student = require('../../models/studentModel');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth2');
const { PythonShell } = require('python-shell');
const { use } = require('passport');

require('dotenv').config();

var userProfile;

const CONFIG = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
}
const AUTH_OPTIONS = {
  callbackURL: '/student/login/callback',
  clientID: CONFIG.CLIENT_ID,
  clientSecret: CONFIG.CLIENT_SECRET
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  userProfile = profile;
  Student.findOne({
    rollNum: profile.family_name
  })
    .then(userDocs => {
      if (!userDocs) {
        const user = new Student({
          email: profile.email,
          name: profile.given_name,
          rollNum: profile.family_name
        });
        user.save();
      }

    })

  return done(null, userProfile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user);
});
passport.deserializeUser((id, done) => {
  done(null, id);
});

exports.homePage = (req, res, next) => {
  // res.send(req.user);
  res.render('student/homePage', {
    user: req.user
  })
};

let options = {
  scriptPath: '/Woman Techies/app/Python',
  args: ['E:/Woman Techies/app/Timetable/tt.png']
}

exports.postUpload = (req, res, next) => {
  PythonShell.run("TT_slot.py", options, (err, res) => {
    if (err) console.log(err);
    if (res) {
      console.log(res);
      Student.findOne({
        rollNum: req.user.family_name
      })
        .then(user => {
          // user.email = user.email;
          // user.name = user.name;
          // user.rollNum = user.rollNum;

          user.slotsJSON = res[0];
          user.save()

        })
    }
  })



  res.send("Picture uploaded");
}

exports.loginPage = (req, res, next) => {
  if (req.user) {
    res.redirect('/student/home')
  }
  res.render('public/loginPage', {
    pageTitle: 'Login',
    pageHead: 'Student Login',
    loginLink: 'login/google'
  });
};
