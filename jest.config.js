

// jest.config.js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node"
}

process.env = Object.assign(process.env, {
    ENC_KEY: "8768aea604fe0172d9273bfc27eacb8a",
    IV: "3e8f8530fe165e43"
});