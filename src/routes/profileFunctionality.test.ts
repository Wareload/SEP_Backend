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

/*
test("Test get Profile", async () => {
    const result1 = await func.getProfile(undefined);
    const email = "111@1.net"
    const password = "TestTest123"
    const firstName = "Firstname";
    const lastName = "Lastname"
    const result2 = await funcAccount.register(email, password, firstName, lastName)
    const result3 = await func.getProfile(result2.user_id);
    expect(result1.status).toBe(401);
    expect(result3.status).toBe(200);
    expect(result3.body).toEqual({"email": email, "fistname": firstName, "lastname": lastName, "tags": []})
})
*/

test("Test adjust Profile", async () => {
})