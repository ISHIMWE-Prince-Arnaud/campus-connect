const xss = require('xss');
const banned = ['badword','curse']; // minimal placeholder
const { isValidImageUrl } = require('../utils/image');

function filterProfanity(text) {
  if (!text) return '';
  let safe = text;
  banned.forEach(w => {
    const re = new RegExp(`\\b${w}\\b`, 'ig');
    safe = safe.replace(re, '****');
  });
  return xss(safe);
}

function validateMediaUrl(url) {
  return isValidImageUrl(url);
}

module.exports = { filterProfanity, validateMediaUrl };


