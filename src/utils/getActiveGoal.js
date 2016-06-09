module.exports = function getActiveGoal(challenge) {
  return challenge.get('solutions').find(sol => sol.get('completed') === false);
};
