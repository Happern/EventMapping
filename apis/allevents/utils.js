function checkErrors (resp) {
  if ((resp.statusCode && resp.statusCode === 401) || (resp.error && resp.error === 1)){
    return resp.message;
  }

  return null;
}

module.exports = {
  checkErrors: checkErrors
}
