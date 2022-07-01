const path = require('path');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth2');
const multer = require('multer');


const express = require('express');

const studentController = require('./studentController');
const res = require('express/lib/response');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Timetable')
  },
  filename: (req, file, cb) => {
    cb(null, 'tt.png')
    // cb(null, 'TT' + path.extname(file.originalname))
  },



})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png format allowed!'));
    }
  }
});

checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/login")
}

const router = express.Router();
function checkLoggedin(req, res, next) {
  const isLoggedin = req.user;
  if (!isLoggedin) {
    return res.redirect('/student/login');
  }
  next();
}
// router.get('/', studentController.welcomePage);
router.get('/login', studentController.loginPage);
router.get('/login/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/login/callback',

  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    res.redirect('/student/home');
  });

router.get('/home', checkLoggedin, studentController.homePage);
router.post('/home', checkLoggedin, upload.single("image"), studentController.postUpload);

router.get('/success', (req, res) => res.json({ "hi": req.user }));

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
})


module.exports = router;