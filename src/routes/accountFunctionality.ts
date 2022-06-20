import * as aes from '../libs/aes.js'
import {sql} from '../libs/mysqlconnection.js'
import bcrypt from 'bcrypt'
import * as validator from '../libs/validator.js'

const saltRounds = 10

/**
 * try to login
 *
 * @param email
 * @param password
 */
async function login(email: any, password: any): Promise<{ status: number, user_id?: number, body?: {} }> {
    if (!(validator.isEmail(email) && validator.isPassword(password))) {
        return {status: 400}
    }
    email = aes.encrypt(email.toLowerCase());//encrypt email
    try {
        const result = await sql.awaitQuery("SELECT user_id, password FROM user WHERE email = ?", [email]);
        if (result.length == 0) {//user does not exist
            return {status: 401}
        } else {
            const check = await bcrypt.compare(password, result[0].password)
            if (check) {
                return {status: 200, user_id: result[0].user_id}
            } else {
                return {status: 403}
            }
        }
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * try to register
 * @param email
 * @param password
 * @param firstname
 * @param lastname
 */
async function register(email: any, password: any, firstname: any, lastname: any): Promise<{ status: number, user_id?: number, body?: {} }> {
    if (!(validator.isEmail(email) && validator.isPassword(password) && validator.isText45(firstname) && validator.isText45(lastname))) {
        return {status: 400}
    }
    email = aes.encrypt(email.toLowerCase())
    firstname = aes.encrypt(firstname)
    lastname = aes.encrypt(lastname)
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        const queryResult = await sql.awaitQuery("INSERT INTO user (email, password, firstname, lastname, tags) VALUES (?, ?, ?, ?, ?)", [email, hash, firstname, lastname, "[]"])
        return {status: 200, user_id: queryResult.insertId}
    } catch (err: any) {
        if (err.errno == 1062) {//error number for mysql error duplicated key
            return {status: 409}
        }
        console.error(err)
        return {status: 500}
    }
}

/**
 * checks if user is logged in
 * @param user_id
 */
function isLoggedIn(user_id: any): { status: number, body?: {} } {
    if (!user_id) {
        return {status: 401}
    } else {
        return {status: 200}
    }
}

export {login, isLoggedIn, register}