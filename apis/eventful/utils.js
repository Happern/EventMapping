function checkErrors (resp) {
  if (resp.error && resp.error === "1") {
    return resp.description;
  }

  return null;
}

module.exports = {
  checkErrors: checkErrors
}
