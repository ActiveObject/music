module.exports = function combineHash(hashCode, member) {
  return 31 * hashCode + member.hashCode();
};
