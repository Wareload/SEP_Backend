import express from "express";
import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import * as validator from '../libs/validator'


let router = express.Router();


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

router.post("/deleteTeam", function (req, res, next) {
    // @ts-ignore
    let user_id = req.session.user_id;
    if (!user_id) {
        res.status(401).send();
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