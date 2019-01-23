module.exports = url =>
  url
    .split('/')
    .splice(0, 3)
    .join('/');
