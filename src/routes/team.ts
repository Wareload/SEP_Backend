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
 *      body:{"teamid":0,"teamname":"Your Team Name"}
 * 400 => bad request
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
 *      body:{"teamid":0}
 * 400 => bad request
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
/**
 * get Teams of current user
 *
 * response:
 * 200 => ok
 *       {"teams": [
 *         {
 *             "teamid": 3,
 *             "name": "Bestes Team Ever"
 *         }
 *         ]}
 * 401 => unauthorized
 * 500 => internal server error
 *
 */
router.post("/getTeams", async function (req, res, next) {
    // @ts-ignore
    let user_id = req.session.user_id;
    if (!user_id) {
        res.status(401).send();
        return;
    }
    try {
        let result = await sql.awaitQuery("SELECT teamid, team.name FROM teammember INNEER JOIN team ON teamid=team.team_id WHERE userid = ?", [user_id]);
        let teams = [];
        for (let item of result) {
            item.name = aes.decrypt(item.name);
            teams.push(item)
        }
        res.send({"teams": teams})
    } catch (e) {
        console.error(e)
        res.status(500).send();
        return;
    }
})
/**
 * get Team by user id
 *
 * require json body schema:
 * {"teamid": 5}
 */
router.post("/getTeam", async function (req, res, next) {
    // @ts-ignore
    let user_id = req.session.user_id;
    if (!user_id) {
        res.status(401).send();
        return;
    }
    let teamId = req.body.teamid;
    if (!validator.isId(teamId)) {
        res.status(400).send("Invalid Request");
        return;
    }
    try {

        let check = await sql.awaitQuery("SELECT null FROM teammember  WHERE userid = ? AND teamid = ?", [user_id, teamId]);
        if (check.length == 0) {
            res.status(401).send("Forbidden")
            return;
        }
        let resultTeam = await sql.awaitQuery("SELECT name FROM team WHERE team_id = ?", [teamId]);
        let resultTeammember = await sql.awaitQuery("SELECT userid, leader, user.email, user.firstname, user.lastname, user.tags FROM teammember INNEER JOIN user ON userid=user.user_id WHERE teamId = ?", [teamId]);
        let member = [];
        for (let item of resultTeammember) {
            let email = aes.decrypt(item.email);
            let firstname = aes.decrypt(item.firstname);
            let lastname = aes.decrypt(item.lastname);
            let encTags = JSON.parse(item.tags);
            let tags = [];
            for (let tag of encTags) {
                tags.push(aes.decrypt(tag))
            }
            let obj = {"email": email, "firstname": firstname, "lastname": lastname, "tags": tags}
            member.push(obj)
        }
        let obj = {"teamname": aes.decrypt(resultTeam[0].name), "teamid": teamId, "member": member};
        res.send(obj)
    } catch (e) {
        console.error(e)
        res.status(500).send()
        return;
    }
})

router.post("/promoteTeamLeader", function (req, res, next) {

})

router.post("/addTeamMember", function (req, res, next) {

})

router.post("/acceptInvitation", function (req, res, next) {

})

router.post("/removeTeamMember", function (req, res, next) {

})

router.post("/leaveTeam", function (req, res, next) {

})


export {router as teamRouter}