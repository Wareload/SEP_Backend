import * as func from "./profileFunctionality.js"


describe("Testing Profile Functionality", () => {

    test("Test Get Profile", async () => {
            const result = await func.getProfile(undefined);
            expect(result.status).toBe(401)
    })

    test("Test Adjust Profile", async () => {
        const result1 = await func.adjustProfile(undefined, [], "first", "last");
        const result2 = await func.adjustProfile(5, {}, "first", "last");
        const result3 = await func.adjustProfile(5, [], 5, "last");
        const result4 = await func.adjustProfile(5, [], "first", 5);
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
        expect(result3.status).toBe(400)
        expect(result4.status).toBe(400)
    })

})