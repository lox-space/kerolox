module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-openastrodynamics`
  extends: ["openastrodynamics"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
