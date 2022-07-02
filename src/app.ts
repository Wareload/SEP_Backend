import express, {Request, Response} from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session';
import cors from "cors"
import fs from "fs"

import MySQLSessionStore from "express-mysql-session";


// @ts-ignore
const store = MySQLSessionStore(session);

//define the session cookie
declare module "express-session" {
    interface SessionData {
        user_id?: number;
    }
}
//routes
import {accountRouter} from './routes/accountRoute.js'
import {profileRouter} from "./routes/profileRoute.js";
import {teamRouter} from "./routes/teamRoute.js";
import {moodRouter} from "./routes/moodRoute.js";
import {notificationRouter} from "./routes/notificationRoute.js";

const app = express()
const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        ca: fs.readFileSync('cert/cert.pem')
    }
};

// @ts-ignore
const sessionStore = new store(options);

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
//app.set('trust proxy', 1)
app.use(session({
    name: "bugsbunnies.sid",
    secret: 'O3Z?)lXU!:%q(F6+D"cU6:2G*Xri?SW7',
    saveUninitialized: false,
    resave: true,
    cookie: {
        httpOnly: true,
        maxAge: 2628000000
    },
    store: sessionStore
}))

//router
app.use('/account', accountRouter)
app.use("/profile", profileRouter)
app.use("/team", teamRouter)
app.use("/mood", moodRouter)
app.use("/notification", notificationRouter)

app.use(function (req, res) {
    res.status(404).send();
})
app.use(function (err: any, req: Request, res: Response) {
    console.error(err)
    res.status(err.status || 500).send();
})


export {app}