import express from "express";
import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import * as validator from '../libs/validator'


let router = express.Router();


router.post("/createTeam", function (req, res, next) {

})

router.post("/deleteTeam", function (req, res, next) {

})

router.post("/getTeams", function (req, res, next) {

})

router.post("/changeTeamRole", function (req, res, next) {

})

router.post("/addTeamMember", function (req, res, next) {

})

router.post("/removeTeamMember", function (req, res, next) {

})
export {router as teamRouter}