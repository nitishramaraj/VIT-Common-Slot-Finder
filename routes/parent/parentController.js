
exports.welcomePage = (req, res, next) => {
  res.send("Hi Parent!");
}

exports.loginPage = (req, res, next) => {
  res.render('public/loginPage', {
    pageTitle: 'Login',
    pageHead: 'Board Login',
    loginLink: '#'

  });
};