import express from "express";

let router = express.Router();

router.post("/getTimer", function (req, res, next) {
})
router.post("/setMood", function (req, res, next) {
})
router.post("/getDailyQuote", function (req, res, next) {
    res.send({"quote": "Work smart, not hard!"})
})
router.post("/getPersonalMood", function (req, res, next) {
})
router.post("/getTeamMood", function (req, res, next) {
})


export {router as moodRouter}