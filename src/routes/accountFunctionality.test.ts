process.env.DB_HOST = process.env.DB_HOST_TEST
process.env.DB_PORT = process.env.DB_PORT_TEST
process.env.DB_USER = process.env.DB_USER_TEST
process.env.DB_PASSWORD = process.env.DB_PASSWORD_TEST
process.env.DB_DATABASE = process.env.DB_DATABASE_TEST

// @ts-ignore
import mysql from 'mysql-await'

//create mysql connection to export
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

import * as func from "./accountFunctionality"


beforeEach(async () => {
    if (process.env.TEST_DB) {
        try {
            await connection.awaitQuery("TRUNCATE TABLE invitation")
            await connection.awaitQuery("TRUNCATE TABLE teammember")
            await connection.awaitQuery("TRUNCATE TABLE team")
            await connection.awaitQuery("TRUNCATE TABLE user")
        } catch (e) {
            console.error(e)
        }
    }
})


test("No Test yet", () => {
    if (process.env.TEST_DB) {

    }
})