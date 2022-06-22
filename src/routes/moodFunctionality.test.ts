import * as func from "./moodFunctionality.js"

describe("Testing Mood Functionality", () => {

    test("Test Get Timer", async () => {
        const result1 = await func.getTimer(undefined, 5);
        const result2 = await func.getTimer(5, "a");
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
    })
    test("Test Get Personal Mood", async () => {
        const result1 = await func.getPersonalMood(undefined, 5, "2022-06-12", "2022-06-12");
        const result2 = await func.getPersonalMood(5, "a", "2022-06-12", "2022-06-12");
        const result3 = await func.getPersonalMood(5, 5, "-", "2022-06-12");
        const result4 = await func.getPersonalMood(5, "a", "2022-06-12", "-");
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
        expect(result3.status).toBe(400)
        expect(result4.status).toBe(400)
    })
    test("Test Get Team Mood", async () => {
        const result1 = await func.getTeamMood(undefined, 5, "2022-06-12", "2022-06-12");
        const result2 = await func.getTeamMood(5, "a", "2022-06-12", "2022-06-12");
        const result3 = await func.getTeamMood(5, 5, "-", "2022-06-12");
        const result4 = await func.getTeamMood(5, "a", "2022-06-12", "-");
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
        expect(result3.status).toBe(400)
        expect(result4.status).toBe(400)
    })
    test("Test Set Mood", async () => {
        const result1 = await func.setMood(undefined, 5, "2022-06-12", 5);
        const result2 = await func.setMood(5, "test", "2022-06-12", 5);
        const result3 = await func.setMood(5, 4, 5, 5);
        const result4 = await func.setMood(5, 4, "undefined", undefined);
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
        expect(result3.status).toBe(400)
        expect(result4.status).toBe(400)
    })

})