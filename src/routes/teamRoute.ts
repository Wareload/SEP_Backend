import express from "express";
import * as func from "./teamFunctionality.js"

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
    const user_id = req.session.user_id;
    const teamName = req.body.teamname;
    const result = await func.createTeam(user_id, teamName);
    res.status(result.status).send(result.body)
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
    const user_id = req.session.user_id;
    const teamId = req.body.teamid;
    const result = await func.deleteTeam(user_id, teamId)
    res.status(result.status).send(result.body)
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
    const user_id = req.session.user_id;
    const result = await func.getTeams(user_id)
    res.status(result.status).send(result.body)
})
/**
 * get Team by user id
 *
 * require json body schema:
 * {"teamid": 5}
 *
 */
router.post("/getTeam", async function (req, res, next) {
    const user_id = req.session.user_id;
    const teamId = req.body.teamid;
    const result = await func.getTeam(user_id, teamId)
    res.status(result.status).send(result.body)
})
/**
 * remove team member as team leader
 *
 * require json body schema:
 * {
 * "teamid": 3,
 * "userId": 25
 * }
 */
router.post("/removeTeamMember", async function (req, res, next) {
    const user_id = req.session.user_id;
    const memberId = req.body.userId;
    const teamId = req.body.teamid;
    const result = await func.removeTeamMember(user_id, memberId, teamId)
    res.status(result.status).send(result.body)
})
/**
 * leave Team as non teamleader
 *
 * require json body schema:
 * {"teamid": 5}
 *
 */
router.post("/leaveTeam", async function (req, res, next) {
    const user_id = req.session.user_id;
    const teamId = req.body.teamid;
    const result = await func.leaveTeam(user_id, teamId)
    res.status(result.status).send(result.body)
})
/**
 * get Invitation for current user
 */
router.post("/getInvitations", async function (req, res, next) {
    const user_id = req.session.user_id;
    const result = await func.getInvitations(user_id);
    res.status(result.status).send(result.body)
})
/**
 * promote another team member to team leader and set the current user to normal team member
 *
 * require json body schema:
 * {
 * "teamid": 3,
 * "userId": 25
 * }
 */
router.post("/promoteTeamLeader", async function (req, res, next) {
    const user_id = req.session.user_id;
    const memberId = req.body.userId;
    const teamId = req.body.teamid;
    const result = await func.promoteTeamLeader(user_id, memberId, teamId)
    res.status(result.status).send(result.body)
})
/**
 * add team member invitation for another user
 *
 * require json body schema:
 * {
 * "userEmail": "3@wareload.net",
 * "teamId": 2
 * }
 */
router.post("/addTeamMember", async function (req, res, next) {
    const user_id = req.session.user_id;
    const userEmail = req.body.userEmail;
    const teamId = req.body.teamId;
    const result = await func.addTeamMember(user_id, userEmail, teamId)
    res.status(result.status).send(result.body)
})
/**
 * accept team invitation to get a team member
 *
 * require json body schema:
 * {
 * "teamid": 22
 * }
 */
router.post("/acceptInvitation", async function (req, res, next) {
    const user_id = req.session.user_id;
    const teamId = req.body.teamid;
    const result = await func.acceptInvitation(user_id, teamId)
    res.status(result.status).send(result.body)

})

export {router as teamRouter}