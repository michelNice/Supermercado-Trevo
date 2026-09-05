module.exports = {
preset: "ts-jest/presets/default-esm",
testEnvironment: "jsdom",
extensionsToTreatAsEsm: [".ts", ".tsx"],
transform: {
"^.+\.tsx?$": [
"ts-jest",
{
useESM: true
}
]
},
moduleNameMapper: {
"^(\.{1,2}/.*)\.js$": "$1"
},
testMatch: [
"**/*.test.ts",
"**/*.test.tsx",
"**/*.spec.ts",
"**/*.spec.tsx"
]
};
