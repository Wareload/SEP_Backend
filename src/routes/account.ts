import express from "express";
import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import bcrypt from 'bcrypt'
import * as validator from '../libs/validator'

const saltRounds = 10


let router = express.Router();


/**
 * login
 *
 * require body json schema:
 *
 * {
 * "email": "test@example.com",
 * "password": "ExamplePassword123"
 * }
 *
 * response:
 * 200 => ok
 * 400 => invalid format or invalid parameter
 * 401 => unauthorized
 * 500 => internal server error
 *
 */
router.post('/login', async function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    if (!(validator.isEmail(email) && validator.isPassword(password))) {
        res.status(400).send("Invalid E-Mail or Password");
        return;
    }
    email = aes.encrypt(email);//encrypt email
    try {
        let result = await sql.awaitQuery("SELECT user_id, password FROM user WHERE email = ?", [email]);
        if (result.length == 0) {
            res.status(401).send("Wrong E-Mail or Password");
            return;
        } else {
            bcrypt.compare(password, result[0].password, function (err, check) {
                if (err) {
                    console.error(err)
                    res.status(500).send()
                    return
                }
                if (check) {
                    // @ts-ignore
                    req.session.user_id = result[0].user_id
                    res.send()
                } else {
                    res.status(401).send("Wrong E-Mail or Password")
                }
            })
        }
    } catch (e) {
        console.error(e)
        res.status(500).send()
    }


});


/**
 * register
 *
 * require body json schema:
 *
 * {
 * "email": "test@example.com",
 * "password": "ExamplePassword123",
 * "firstname": "Max",
 * "lastname": "Muster"
 * }
 *
 * 400 => invalid format or parameter
 * 409 => email already exists
 * 500 => internal server error
 */
router.post('/register', function (req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    if (!(validator.isEmail(email) && validator.isPassword(password) && validator.isText45(firstname) && validator.isText45(lastname))) {
        res.status(400).send("Invalid Parameter");
        return;
    }
    email = aes.encrypt(email)
    firstname = aes.encrypt(firstname)
    lastname = aes.encrypt(lastname)
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            res.status(500).send()
            return
        }
        sql.query("INSERT INTO user (email, password, firstname, lastname, tags) VALUES (?, ?, ?, ?, ?)", [email, hash, firstname, lastname, "[]"], function (err: any, sqlResult: { insertId: any; }, fields: any) {
            if (err) {
                if (err.errno == 1062) {
                    res.status(409).send("E-Mail already taken")
                } else {
                    console.error(err)
                    res.status(500).send();
                }
            } else {
                // @ts-ignore
                req.session.user_id = sqlResult.insertId
                res.send()
            }
        })

    });
})
/**
 * logout
 *
 * require nothing
 * 200 => success
 * 500 => internal server error
 *
 * clear client and database session
 */
router.post('/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error(err)
            res.send(500).send()
        } else {
            res.clearCookie("bugsbunnies.sid")
            res.send()
        }
    });
});

/**
 * check if logged in
 * 200 => logged in
 * 401 => not logged in
 * 500 => server error
 */
router.post('/isLoggedIn', function (req, res, next) {
    // @ts-ignore
    let user_id = req.session.user_id;
    if (!user_id) {
        res.status(401).send()
    } else {
        res.status(200).send();
    }
});


export {router as accountRouter}