import {sql} from '../libs/mysqlconnection.js'
import {decrypt} from "../libs/aes.js";

async function getAlert(user_id: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    try {
        const result = await sql.awaitQuery("SELECT teamid from teammember WHERE userid = ? AND leader = ?", [user_id, 1]);
        const body: { moods: any[] } = {moods: []};
        for (const element of result) {
            const teamId = element.teamid;
            const res = await sql.awaitQuery("SELECT AVG(mood) as avg, MAX(mood) as min, team.name as teamname FROM mood INNER JOIN team ON mood.team_id = team.team_id WHERE CAST(datestamp as DATE) BETWEEN CAST(CURRENT_TIMESTAMP as DATE) AND CAST(CURRENT_TIMESTAMP as DATE) AND mood.team_id = ? GROUP BY mood.team_id", [teamId])
            if (res.length != 0) {
                const obj: any = {
                    "teamid": teamId,
                    "teamname": decrypt(res[0].teamname),
                    "avg": res[0].avg,
                    "min": res[0].min
                };
                body.moods.push(obj)
            }
        }
        return {status: 200, body: body}
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}


export {getAlert}