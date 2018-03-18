const { User } = require("../models/models");

function getUserByUserId(req, res, next) {
  const { user_id } = req.params;
  User.findOne({ _id: user_id })
    .then(user => res.json({ user }))
    .catch(next);
}

module.exports = { getUserByUserId };
