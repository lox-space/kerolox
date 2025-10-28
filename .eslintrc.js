module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-lox-space`
  extends: ["lox-space"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
