process.env = Object.assign(process.env, {
    ENC_KEY: "8768aea604fe0172d9273bfc27eacb8a",
    IV: "3e8f8530fe165e43"
});

export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ['js'],
    globals: {
        'ts-jest': {
            tsconfig: {
                module: 'ES2022',
                target: 'es2022'
            },
            useESM: true
        }
    }
}