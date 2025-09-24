const User = require('../models/User');

const POINTS = {
  POST_CREATE: 5,
  POST_REACT: 1,
  QUEST_SUBMIT: 10,
  QUEST_WIN: 10,
  PAIR_COMPLETE: 15,
  GROUP_WIN: 10,
  STREAK_LOGIN: 2
};

async function awardPointsToUser(userId, points, reason) {
  await User.updateOne({ _id: userId }, { $inc: { points } });
  return { userId, points, reason };
}

async function awardPointsToUsers(userIds, points, reason) {
  await User.updateMany({ _id: { $in: userIds } }, { $inc: { points } });
  return { userIds, points, reason };
}

module.exports = { POINTS, awardPointsToUser, awardPointsToUsers };


