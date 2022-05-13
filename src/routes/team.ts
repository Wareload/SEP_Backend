import express from "express";
import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import * as validator from '../libs/validator'


let router = express.Router();

/**
 * create Team
 *
 * require body json schema
 *
 * {
 *     "teamname":"Your Team Name"
 * }
 *
 * response:
 * 200 => ok
 * 400 => bad request
 *      body:{"teamid":0,"teamname":"Your Team Name"}
 * 401 => unauthorized
 * 500 => internal server error
 */
router.post("/createTeam", async function (req, res, next) {
    // @ts-ignore
    let user_id = req.session.user_id;
    if (!user_id) {
        res.status(401).send();
        return;
    }
    let teamname = req.body.teamname;
    if (!(validator.isText45(teamname))) {
        res.status(400).send("Invalid Teamname");
        return;
    }
    let encTeamname = aes.encrypt(teamname)
    try {
        let teamResult = await sql.awaitQuery("INSERT INTO `team` (`name`) VALUES (?);", [encTeamname]);
        let teamId = teamResult.insertId;
        await sql.awaitQuery("INSERT INTO `teammember` (`teamid`, `userid`, `leader`) VALUES (?, ?,?);", [teamId, user_id, 1]);
        res.send({"teamid": teamId, "teamname": teamname});
    } catch (e) {
        console.log(e)
        res.status(500).send()
        return;
    }
    //create team
    //create user in team
})
/**
 * delete Team
 *
 * require body json schema:
 * {
 * "teamid": "9"
 * }
 *
 * response:
 * 200 => ok
 * 400 => bad request
 *      body:{"teamid":0,"teamname":"Your Team Name"}
 * 401 => unauthorized
 * 500 => internal server error
 */
router.post("/deleteTeam", async function (req, res, next) {
    // @ts-ignore
    let user_id = req.session.user_id;
    if (!user_id) {
        res.status(401).send();
        return;
    }
    let teamId = req.body.teamid;
    if (!validator.isId(teamId)) {
        res.status(400).send("Invalid Parameter")
        return;
    }
    try {
        let memberResult = await sql.awaitQuery("SELECT null FROM teammember WHERE teamid = ? AND userid = ? AND leader = 1", [teamId, user_id]);
        if (memberResult.length == 0) {
            res.status(401).send();
            return
        } else {
            await sql.awaitQuery("DELETE FROM `team` WHERE (`team_id` = ?)", [teamId]);
            res.send({"id": teamId})
            return;
        }
    } catch (e) {
        console.error(e)
        res.status(500).send()
        return;
    }
})

router.post("/getTeams", function (req, res, next) {

})

router.post("/promoteTeamLeader", function (req, res, next) {

})

router.post("/addTeamMember", function (req, res, next) {

})

router.post("/removeTeamMember", function (req, res, next) {

})

router.post("/leaveTeam", function (req, res, next) {

})


export {router as teamRouter}