module.exports = {
  isPackageNameValid(name) {
    return name && /^[a-z0-9-@/~._]+$/i.test(name);
  }
};
