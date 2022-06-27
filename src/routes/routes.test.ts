import * as account from "./accountFunctionality.js"
import * as mood from "./moodFunctionality.js"
import * as notification from "./notificationFunctionality.js"
import * as profile from "./profileFunctionality.js"
import * as team from "./teamFunctionality.js"

// @ts-ignore
import mysql from 'mysql-await'

describe("Testing All Routes", () => {

    let connection: any;

    if (process.env.TEST_DB) {
        try {
            connection = mysql.createConnection({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            });
        } catch (e) {
            console.error(e)
        }
    }

    beforeEach(async () => {
        if (process.env.TEST_DB) {
            try {
                await connection.awaitQuery("DELETE FROM invitation")
                await connection.awaitQuery("DELETE FROM teammember")
                await connection.awaitQuery("DELETE FROM team")
                await connection.awaitQuery("DELETE FROM user")
                await connection.awaitQuery("DELETE FROM sessions")
            } catch (e) {
                console.error(e)
            }
        }
    })

    afterAll(async () => {
        if (process.env.TEST_DB) {
            try {
                await connection.awaitQuery("DELETE FROM invitation")
                await connection.awaitQuery("DELETE FROM teammember")
                await connection.awaitQuery("DELETE FROM team")
                await connection.awaitQuery("DELETE FROM user")
                await connection.awaitQuery("DELETE FROM sessions")
                connection.end();
            } catch (e) {
                console.error(e)
            }
        }
    })

    test("Complete Testing Scenario", async () => {
        if (!process.env.TEST_DB) {
            return;
        }
        //Testing Account Route
        const emailAccount1 = "account@one.test"
        const emailAccount2 = "account@two.test"
        const password = "TestTest123"
        const tags = ["Tag1", "Tag2", "Tag3"];
        const firstname = "First"
        const lastname = "Last"
        const firstName = "Firstname"
        const lastName = "Lastname"
        const teamName = "SampleTeam"
        const account1 = await account.register(emailAccount1, password, firstname, lastname)
        const account2 = await account.register(emailAccount2, password, firstname, lastname)
        expect(account1.status).toBe(200)
        expect(account1.user_id).not.toBe(undefined)
        expect(account2.status).toBe(200)
        expect(account2.user_id).not.toBe(undefined)
        expect(account.isLoggedIn(account1.user_id).status).toBe(200)
        expect(account.isLoggedIn(account2.user_id).status).toBe(200)
        expect((await account.login(emailAccount1, password)).status).toBe(200)
        expect((await account.login(emailAccount2, password)).status).toBe(200)
        expect((await account.register(emailAccount1, password, firstname, lastname)).status).toBe(409)
        //Testing Profile Route
        expect((await profile.adjustProfile(account1.user_id, tags, firstName, lastName)).status).toBe(200)
        expect((await profile.adjustProfile(account2.user_id, tags, firstName, lastName)).status).toBe(200)
        const profile1 = await profile.getProfile(account1.user_id);
        const profile2 = await profile.getProfile(account2.user_id);
        expect(profile1.status).toBe(200)
        expect(profile2.status).toBe(200)
        expect(profile1.body).toEqual({
                email: emailAccount1,
                firstname: firstName,
                lastname: lastName,
                tags: tags
            }
        )
        expect(profile2.body).toEqual({
                email: emailAccount2,
            firstname: firstName,
            lastname: lastName,
            tags: tags
            }
        )
        //Testing Team Route
        const team1 = await team.createTeam(account1.user_id, teamName);
        expect(team1.status).toBe(200)
        const teams = await team.getTeams(account1.user_id);
        expect(teams.status).toBe(200)
            // @ts-ignore
        const teamId = team1.body.teamid;
            // @ts-ignore
        expect(teams.body.teams.length).toBe(1)
        const teamDelete = await team.createTeam(account1.user_id, teamName);
        expect(teamDelete.status).toBe(200)
        const teamsD = await team.getTeams(account1.user_id);
        expect(teamsD.status).toBe(200)
            // @ts-ignore
        const teamIdD = teamsD.body.teamid;
            // @ts-ignore
        expect(teamsD.body.teams.length).toBe(2)
        const invite = await team.addTeamMember(account1.user_id, emailAccount2, teamId)
        expect(invite.status).toBe(200)
        const invitesOne = await team.getInvitations(account2.user_id)
        expect(invitesOne.status).toBe(200)
    })
})
