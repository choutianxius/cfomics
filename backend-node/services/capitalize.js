/**
 * 将一个字符串首字母大写
 *
 * @param {string} s
 * @returns {string} 目标字符串首字母大写
 */
function capitalize (s) {
  return s[0].toUpperCase() + s.slice(1);
}

module.exports = capitalize;
