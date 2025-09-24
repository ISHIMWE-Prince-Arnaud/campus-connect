function isValidImageUrl(url) {
  if (!url) return true;
  try {
    const u = new URL(url);
    const allowed = ['.png','.jpg','.jpeg','.gif','.webp'];
    return allowed.some(ext => u.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
}
module.exports = { isValidImageUrl };


