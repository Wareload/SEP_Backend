import express from "express";
import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import * as validator from '../libs/validator'

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
    // @ts-ignore
    let user_id = req.session.user_id;
    if (!user_id) {
        res.status(401).send();
        return;
    }
    let tags = req.body.tags;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    if (!(validator.isTagsArray(tags) && validator.isText45(firstname) && validator.isText45(lastname))) {
        res.status(400).send()
        return;
    }
    firstname = aes.encrypt(firstname);
    lastname = aes.encrypt(lastname)
    let encTags = [];
    //encrypt string in json array
    for (let item of tags) {
        encTags.push(aes.encrypt(item));
    }
    try {
        await sql.awaitQuery("UPDATE `user` SET `firstname` = ?, `lastname` = ?, `tags` = ? WHERE (`user_id` = ?)", [firstname, lastname, JSON.stringify(encTags), user_id]);
        res.send()
        return;
    } catch (e) {
        console.error(e)
        res.status(500).send()
        return
    }

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
    // @ts-ignore
    let user_id = req.session.user_id;
    if (!user_id) {
        res.status(401).send();
        return;
    }
    try {
        let result = await sql.awaitQuery("SELECT email, firstname, lastname, tags FROM user WHERE user_id = ?", [user_id]);
        let email = aes.decrypt(result[0].email);
        let firstname = aes.decrypt(result[0].firstname);
        let lastname = aes.decrypt(result[0].lastname);
        let encTags = JSON.parse(result[0].tags)
        let tags = [];
        for (let item of encTags) {
            tags.push(aes.decrypt(item));
        }
        res.send({"email": email, "fistname": firstname, "lastname": lastname, "tags": tags})
    } catch (e) {
        console.error(e)
        res.status(500).send()
        return;
    }


})


export {router as profileRouter}