import * as func from "./teamFunctionality.js"


describe("Testing Team Functionality", () => {

    test("Test Create Team", async () => {
        const result1 = await func.createTeam(undefined, "Name")
        const result2 = await func.createTeam(5, 5)
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
    })
    test("Test Delete Team", async () => {
        const result1 = await func.deleteTeam(undefined, "Name")
        const result2 = await func.deleteTeam(5, "undefined")
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
    })
    test("Test Get Teams", async () => {
        const result = await func.getTeams(undefined);
        expect(result.status).toBe(401)
    })
    test("Test Get Team", async () => {
        const result1 = await func.getTeam(undefined, 5);
        const result2 = await func.getTeam(5, "undefined");
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
    })
    test("Test Remove TeamMember", async () => {
        const result1 = await func.removeTeamMember(undefined, 5, 5);
        const result2 = await func.removeTeamMember(5, "undefined", 5);
        const result3 = await func.removeTeamMember(5, 5, "undefined");
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
        expect(result3.status).toBe(400)
    })
    test("Test Leave Team", async () => {
        const result1 = await func.leaveTeam(undefined, 5)
        const result2 = await func.leaveTeam(5, "undefined")
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
    })
    test("Test Get Invitations", async () => {
        const result = await func.getInvitations(undefined);
        expect(result.status).toBe(401)
    })
    test("Test Promote TeamLeader", async () => {
        const result1 = await func.promoteTeamLeader(undefined, 5, 5)
        const result2 = await func.promoteTeamLeader(5, "undefined", 5)
        const result3 = await func.promoteTeamLeader(5, 5, "undefined")
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
        expect(result3.status).toBe(400)
    })
    test("Test Add TeamMember", async () => {
        const result1 = await func.addTeamMember(undefined, "test@test.test", 5)
        const result2 = await func.addTeamMember(5, undefined, 5)
        const result3 = await func.addTeamMember(5, "test@test.test", "Test")
        expect(result1.status).toBe(401)
        expect(result2.status).toBe(400)
        expect(result3.status).toBe(400)
    })
    test("Test Accept Invitation", async () => {
        const result = await func.getInvitations(undefined);
        expect(result.status).toBe(401)
    })
    test("Test Decline Invitation", async () => {
        const result = await func.getInvitations(undefined)
        expect(result.status).toBe(401)
    })

})