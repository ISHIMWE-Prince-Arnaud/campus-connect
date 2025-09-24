import xss from 'xss';
import { isValidImageUrl } from '../utils/image.js';

const banned = ['badword','curse']; // minimal placeholder

export function filterProfanity(text) {
  if (!text) return '';
  let safe = text;
  banned.forEach(w => {
    const re = new RegExp(`\\b${w}\\b`, 'ig');
    safe = safe.replace(re, '****');
  });
  return xss(safe);
}

export function validateMediaUrl(url) {
  return isValidImageUrl(url);
}


