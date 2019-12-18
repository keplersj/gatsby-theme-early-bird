const testPathIgnorePatterns = [
  "/.cache/",
  "/coverage/",
  "/node_modules/",
  "/public/",
  "/reports/",
  "/static/"
];

module.exports = {
  collectCoverage: true,
  projects: [
    {
      displayName: "test",
      preset: "jest-preset-gatsby/typescript",
      collectCoverage: true,
      snapshotSerializers: [
        "jest-emotion",
        "jest-serializer-react-helmet-async",
        "jest-serializer-json-ld-script"
      ],
      testPathIgnorePatterns
    },
    {
      displayName: "lint:prettier",
      preset: "jest-runner-prettier",
      testPathIgnorePatterns
    }
  ]
};
