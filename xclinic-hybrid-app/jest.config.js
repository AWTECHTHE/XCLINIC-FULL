const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Aponta para a raiz do Next.js app para carregar next.config.js e .env
  dir: "./",
})

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
}

module.exports = createJestConfig(customJestConfig)
