import express from "express";
import * as func from "./accountFunctionality.js"

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
    const email = req.body.email
    const password = req.body.password;
    const response = await func.login(email, password)
    if (response.user_id) {
        req.session.user_id = response.user_id;
    }
    res.status(response.status).send(response.body)
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
router.post('/register', async function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const response = await func.register(email, password, firstname, lastname)
    if (response.user_id) {
        req.session.user_id = response.user_id;
    }
    res.status(response.status).send(response.body)
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
router.post('/logout', async function (req, res, next) {
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
    const user_id = req.session.user_id;
    const response = func.isLoggedIn(user_id)
    res.status(response.status).send(response.body);
});


export {router as accountRouter}