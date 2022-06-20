import express from "express";
import * as func from "./profileFunctionality.js";

let router = express.Router();

/**
 * adjust user profile
 *
 * require body schema:
 * {
 * "tags": ["1","2","3","4"],
 * "firstname": "Jane",
 * "lastname": "Doe"
 * }
 *
 * response:
 * 200 => ok
 * 400 => invalid format or invalid parameter
 * 401 => unauthorized
 * 500 => internal server error
 *
 */
router.post("/adjustProfile", async function (req, res, next) {
    const user_id = req.session.user_id;
    const tags = req.body.tags;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const result = await func.adjustProfile(user_id, tags, firstname, lastname)
    res.status(result.status).send(result.body)
})

/**
 * get own user profile
 *
 * response:
 * 200 => ok
 * 401 => unauthorized
 * 500 => internal server error
 *
 */
router.post("/getProfile", async function (req, res, next) {
    const user_id = req.session.user_id;
    const result = await func.getProfile(user_id);
    res.status(result.status).send(result.body)
})


export {router as profileRouter}