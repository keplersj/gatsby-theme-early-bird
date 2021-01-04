const testPathIgnorePatterns = [
  "/.cache/",
  "/coverage/",
  "/node_modules/",
  "/public/",
  "/reports/",
  "/static/",
];

module.exports = {
  collectCoverage: true,
  projects: [
    {
      displayName: "test",
      preset: "jest-preset-gatsby/typescript",
      collectCoverage: true,
      snapshotSerializers: [
        "@emotion/jest/serializer",
        "jest-serializer-react-helmet-async",
        "jest-serializer-json-ld-script",
      ],
      moduleNameMapper: {
        "modern-normalize": "jest-transform-stub",
        "starstuff-style": "jest-transform-stub",
      },
      testPathIgnorePatterns,
    },
    {
      displayName: "lint:prettier",
      preset: "jest-runner-prettier",
      testPathIgnorePatterns,
    },
    {
      displayName: "lint:stylelint",
      preset: "jest-runner-stylelint",
      testPathIgnorePatterns,
    },
    {
      displayName: "lint:eslint",
      runner: "eslint",
      testMatch: [
        "<rootDir>/src/**/*.js",
        "<rootDir>/src/**/*.ts",
        "<rootDir>/src/**/*.tsx",
      ],
    },
  ],
};
