import express from "express";
import * as func from "./moodFunctionality.js"

let router = express.Router();

router.post("/getTimer", async function (req, res, next) {
    const user_id = req.session.user_id;
    const teamId = req.body.teamid;
    const result = await func.getTimer(user_id, teamId);
    res.status(result.status).send(result.body)
})
router.post("/setMood", async function (req, res, next) {
    const user_id = req.session.user_id;
    const mood = req.body.mood;
    const note = req.body.note;
    const teamId = req.body.teamid;
    const result = await func.setMood(user_id, mood, note, teamId)
    res.status(result.status).send(result.body)
})
router.post("/getPersonalMood", async function (req, res, next) {
    const user_id = req.session.user_id;
    const teamId = req.body.teamid;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const result = await func.getPersonalMood(user_id, teamId, startDate, endDate);
    res.status(result.status).send(result.body)
})
router.post("/getTeamMood", async function (req, res, next) {
    const user_id = req.session.user_id;
    const teamId = req.body.teamid;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const result = await func.getTeamMood(user_id, teamId, startDate, endDate);
    res.status(result.status).send(result.body)
})

export {router as moodRouter}