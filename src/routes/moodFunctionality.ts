import * as aes from '../libs/aes.js'
import {sql} from '../libs/mysqlconnection.js'
import * as validator from '../libs/validator.js'

/**
 * checks if mood in a specific team for the user is already set for the current date
 * @param user_id
 * @param teamId
 */
async function getTimer(user_id: any, teamId: any): Promise<{ status: number, user_id?: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!validator.isId(teamId)) {
        return {status: 400}
    }
    try {
        const result = await sql.awaitQuery("SELECT * FROM mood WHERE user_id = ? AND team_id = ? AND CAST(datestamp as DATE) BETWEEN CAST(CURRENT_TIMESTAMP as DATE) AND CAST(CURRENT_TIMESTAMP as DATE)", [user_id, teamId])
        if (result.length == 0) {
            return {status: 200}
        } else {
            return {status: 409}
        }
    } catch (e) {
        return {status: 500}
    }
}

/**
 * set the mood in a specific team for the user for the current day
 * @param user_id
 * @param mood
 * @param note
 * @param teamId
 */
async function setMood(user_id: any, mood: any, note: any, teamId: any): Promise<{ status: number, user_id?: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!(validator.isId(teamId) && validator.isIdMood(mood) && validator.isId(teamId) && validator.isText70(note))) {
        return {status: 400}
    }
    try {
        const result = await sql.awaitQuery("SELECT * FROM mood WHERE user_id = ? AND team_id = ? AND CAST(datestamp as DATE) BETWEEN CAST(CURRENT_TIMESTAMP as DATE) AND CAST(CURRENT_TIMESTAMP as DATE)", [user_id, teamId])
        if (result.length == 0) {
            if (note == undefined) {
                note = "";
            }
            note = aes.encrypt(note);
            if (await isUserInTeam(user_id, teamId)) {
                await sql.awaitQuery("INSERT INTO mood (user_id, team_id, mood, note) VALUES (?,?,?,?);", [user_id, teamId, mood, note]);
                return {status: 200}
            } else {
                return {status: 403}
            }
        } else {
            return {status: 409}
        }
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * get the Personal Mood from a team for the user
 * @param user_id
 * @param teamId
 * @param startDate
 * @param endTime
 */
async function getPersonalMood(user_id: any, teamId: any, startDate: any, endTime: any): Promise<{ status: number, user_id?: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!(validator.isId(teamId) && validator.isId(teamId) && validator.isDate(startDate) && validator.isDate(endTime))) {
        return {status: 400}
    }
    try {
        const result = await sql.awaitQuery("SELECT mood, note, datestamp FROM mood WHERE user_id = ? AND team_id = ? AND CAST(datestamp as DATE) BETWEEN ? AND ?", [user_id, teamId, startDate, endTime])
        const arr = handleGetMood(result);
        return {status: 200, body: {moods: arr}};
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * get the Team Mood from a team for the user
 * @param user_id
 * @param teamId
 * @param startDate
 * @param endTime
 */
async function getTeamMood(user_id: any, teamId: any, startDate: any, endTime: any): Promise<{ status: number, user_id?: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!(validator.isId(teamId) && validator.isId(teamId) && validator.isDate(startDate) && validator.isDate(endTime))) {
        return {status: 400}
    }
    try {
        const result = await sql.awaitQuery("SELECT mood, note, datestamp FROM mood WHERE team_id = ? AND CAST(datestamp as DATE) BETWEEN ? AND ?", [teamId, startDate, endTime])
        const arr = handleGetMood(result);
        return {status: 200, body: {moods: arr}};
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * check if user is in the team
 * @param user_id
 * @param teamId
 */
async function isUserInTeam(user_id: number, teamId: number): Promise<boolean> {
    return (await sql.awaitQuery("SELECT null FROM teammember WHERE teamid = ? AND userid = ?;", [teamId, user_id])).length > 0;
}

/**
 * transform date to string
 * @param date
 */
function getDateToString(date: Date) {
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    return year + "-" + month + "-" + day
}

/**
 * transform sql result to mood array
 * @param result
 */
function handleGetMood(result: any): { mood: number, note: string, date: string }[] {
    const arr: { mood: number; note: string; date: string }[] = [];
    result.forEach((element: any) => {
        const mood = element.mood;
        const note = aes.decrypt(element.note)
        const date = getDateToString(new Date(element.datestamp))
        arr.push({mood: mood, note: note, date: date})
    })
    return arr;
}

export {getTimer, setMood, getTeamMood, getPersonalMood}
