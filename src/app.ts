import express, {Request, Response} from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session';
import cors from "cors"

const MySQLStore = require('express-mysql-session')(session);
//define the session cookie
declare module "express-session" {
    interface SessionData {
        user_id?: number;
    }
}
//routes
import {accountRouter} from './routes/accountRoute'
import {profileRouter} from "./routes/profileRoute";
import {teamRouter} from "./routes/teamRoute";
import {moodRouter} from "./routes/moodRoute";

const app = express()
const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

const sessionStore = new MySQLStore(options);

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

app.use(function (req, res) {
    res.status(404).send();
})
app.use(function (err: any, req: Request, res: Response) {
    console.error(err)
    res.status(err.status || 500).send();
})


export {app}