export const testEnvironment = "jsdom";
export const transform = {
  "^.+\\.tsx?$": "ts-jest"
};
export const moduleFileExtensions = ["ts", "tsx", "js", "jsx", "json", "node"];
export const testMatch = ["**/?(*.)+(spec|test).[jt]s?(x)"];
export const collectCoverage = true;
export const coverageDirectory = "coverage";
export const coverageProvider = "v8";