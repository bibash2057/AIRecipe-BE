function validateJSON(str) {
  try {
    JSON.parse(str);
    return { valid: true };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

module.exports = validateJSON;
