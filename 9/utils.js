function isProbablyServiceName(text) {
  return text.length < 50 && /^[a-zA-Z0-9\s]+$/.test(text.trim());
}

module.exports = { isProbablyServiceName };
