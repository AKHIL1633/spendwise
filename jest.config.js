/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }] },
  testMatch: ["<rootDir>/src/__tests__/**/*.test.{ts,tsx}"],
};
module.exports = config;
