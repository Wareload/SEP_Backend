import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import bcrypt from 'bcrypt'
import * as validator from '../libs/validator'

const saltRounds = 10

async function login(email: any, password: any): Promise<{ status: number, body: {} }> {
    if (!(validator.isEmail(email) && validator.isPassword(password))) {
        return {status: 400, body: {}}
    }
    email = aes.encrypt(email.toLowerCase());//encrypt email
    try {
        let result = await sql.awaitQuery("SELECT user_id, password FROM user WHERE email = ?", [email]);
        if (result.length == 0) {
            return {status: 401, body: {}}
        } else {
            bcrypt.compare(password, result[0].password, function (err, check) {
                if (err) {
                    console.error(err)
                    return {status: 500, body: {}}
                }
                if (check) {
                    // @ts-ignore
                    req.session.user_id = result[0].user_id
                    return {status: 200, body: {}}
                } else {
                    return {status: 401, body: {}}
                }
            })
        }
    } catch (e) {
        console.error(e)
    }
    return {status: 500, body: {}}

}

async function register(email: any, password: any, firstname: any, lastname: any): Promise<{ status: number, body: {} }> {
    if (!(validator.isEmail(email) && validator.isPassword(password) && validator.isText45(firstname) && validator.isText45(lastname))) {
        return {status: 400, body: {}}
    }
    email = aes.encrypt(email.toLowerCase())
    firstname = aes.encrypt(firstname)
    lastname = aes.encrypt(lastname)
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            return {status: 500, body: {}}
        }
        try {
            sql.query("INSERT INTO user (email, password, firstname, lastname, tags) VALUES (?, ?, ?, ?, ?)", [email, hash, firstname, lastname, "[]"], function (err: any, sqlResult: { insertId: any; }, fields: any) {
                if (err) {
                    if (err.errno == 1062) {
                        return {status: 409, body: {}}
                    } else {
                        console.error(err)
                        return {status: 500, body: {}}
                    }
                } else {
                    // @ts-ignore
                    req.session.user_id = sqlResult.insertId
                    return {status: 200, body: {}}
                }
            })
        } catch (e) {
            console.error(e)
            return {status: 500, body: {}}
        }
    })
    return {status: 500, body: {}}
}

/**
 * checks if is logged in or not and returns an object with the matching http code and the http body
 * @param user_id
 */
function isLoggedIn(user_id: any): { status: number, body: {} } {
    if (!user_id) {
        return {status: 401, body: {}}
    } else {
        return {status: 200, body: {}}
    }
}

export {login, isLoggedIn, register}