const User = require('../models/user');

module.exports = {
  index
};

async function index(req, res) {
  const users = await User.findById(req.user);
  res.render('users/index', { title: 'User Homepage', users });
}