import express from "express";
import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import * as validator from '../libs/validator'



let router = express.Router();


router.post("/adjustProfile", function (req, res, next) {

})

router.post("/getProfile", function (req, res, next) {

})


export {router as profileRouter}