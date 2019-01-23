module.exports = (url, domain) => {
  let normalizedUrl = '';
  if (/^\//.test(url)) {
    normalizedUrl = domain + url;
  } else {
    normalizedUrl = url;
  }
  return normalizedUrl;
};
