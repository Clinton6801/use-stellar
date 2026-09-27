module.exports = {
  displayName: "react-native",
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.native.test.ts", "**/*.native.test.tsx", "**/*.test.ts", "**/*.test.tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          isolatedModules: true,
          module: "commonjs",
        },
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    "^use-stellar$": "<rootDir>/../core/src/index.ts",
    "^@stellar/stellar-sdk$": "<rootDir>/src/__mocks__/@stellar/stellar-sdk.ts",
    "^react-native$": "<rootDir>/src/__mocks__/react-native.ts",
    "^@react-native-community/netinfo$": "<rootDir>/src/test-utils/mocks/NetInfo.ts",
    "^react-dom$": "<rootDir>/src/__mocks__/react-dom.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/src/test-utils/setup.ts"],
  clearMocks: true,
}
