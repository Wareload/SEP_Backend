import * as func from "./accountFunctionality.js"

// @ts-ignore
import mysql from 'mysql-await'

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

test("Test Is Logged In", () => {
    if (process.env.TEST_DB) {
        expect(func.isLoggedIn(5)).toEqual({status: 200})
        expect(func.isLoggedIn(9)).toEqual({status: 200})
        expect(func.isLoggedIn(6)).toEqual({status: 200})
    }
})
test("Test Login", async () => {
    if (process.env.TEST_DB) {
        expect(await func.login("1@1.net", "TestTest123")).toEqual({status: 401})
        expect(await func.login("11.net", "TestTest123")).toEqual({status: 400})
        expect(await func.login("1@1.net", "TestTestTest")).toEqual({status: 400})
        await func.register("1@1.net", "TestTestTest123", "Firstname", "Lastname")
        const result = await func.login("1@1.net", "TestTestTest123");
        expect(result.status).toBe(200)
        expect(result.body).toBe(undefined)
        expect(typeof result.user_id).toBe("number")
    }
})
test("Test Register", async () => {
    if (process.env.TEST_DB) {
        const result1 = await func.register("11.net", "TestTestTest123", "Firstname", "Lastname")
        const result2 = await func.register("1@1.net", "TestTestTest", "Firstname", "Lastname")
        const result3 = await func.register("1@1.net", "TestTestTest123", "Firstname", "Lastname")
        const result4 = await func.register("1@1.net", "TestTestTest123", "Firstname", "Lastname")
        expect(result1.status).toBe(400)
        expect(result2.status).toBe(400)
        expect(result3.status).toBe(200)
        expect(typeof result3.user_id).toBe("number")
        expect(result4.status).toBe(409)
    }
})
