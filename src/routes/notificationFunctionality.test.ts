import * as func from "./notificationFunctionality.js"

describe("Testing Notification Functionality", () => {

    test("Test Get Alert", async ()=>{
        const result = await func.getAlert(undefined);
        expect(result.status).toBe(401)
    })

})