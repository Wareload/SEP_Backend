import express from "express";
import {getAlert} from "./notificationFunctionality.js";

let router = express.Router();

router.post("/getAlert", async function (req, res, next) {
    const user_id = req.session.user_id;
    const result = await getAlert(user_id);
    res.status(result.status).send(result.body);
})

export {router as notificationRouter}