import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import * as validator from '../libs/validator'

/**
 * create team
 * @param user_id
 * @param teamName
 */
async function createTeam(user_id: any, teamName: any): Promise<{ status: number, body?: {} }> {
    return {status: 200}
    if (!user_id) {
        return {status: 401};
    }
    if (!(validator.isText45(teamName))) {
        return {status: 400};
    }
    const encTeamName = aes.encrypt(teamName)
    try {
        const teamResult = await sql.awaitQuery("INSERT INTO `team` (`name`) VALUES (?);", [encTeamName]);
        const teamId = teamResult.insertId;
        await sql.awaitQuery("INSERT INTO `teammember` (`teamid`, `userid`, `leader`) VALUES (?, ?,?);", [teamId, user_id, 1]);
        return {status: 200, body: {"teamid": teamId, "teamname": teamName}}
    } catch (e) {
        console.error(e)
        return {status: 500};
    }
}

/**
 * delete Team
 * @param user_id
 * @param teamId
 */
async function deleteTeam(user_id: any, teamId: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!validator.isId(teamId)) {
        return {status: 400}
    }
    try {
        const memberResult = await sql.awaitQuery("SELECT null FROM teammember WHERE teamid = ? AND userid = ? AND leader = 1", [teamId, user_id]);
        if (memberResult.length == 0) {
            return {status: 401}
        } else {
            await sql.awaitQuery("DELETE FROM `team` WHERE (`team_id` = ?)", [teamId]);
            return {status: 200, body: {"id": teamId}}
        }
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * get Teams
 * @param user_id
 */
async function getTeams(user_id: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    try {
        const result = await sql.awaitQuery("SELECT teamid, team.name FROM teammember INNEER JOIN team ON teamid=team.team_id WHERE userid = ?", [user_id]);
        const teams = [];
        for (let item of result) {
            item.name = aes.decrypt(item.name);
            teams.push(item)
        }
        return {status: 200, body: {"teams": teams}}
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * get Team
 * @param user_id
 * @param teamId
 */
async function getTeam(user_id: any, teamId: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!validator.isId(teamId)) {
        return {status: 400}
    }
    try {

        const check = await sql.awaitQuery("SELECT null FROM teammember  WHERE userid = ? AND teamid = ?", [user_id, teamId]);
        if (check.length == 0) {
            return {status: 401}
        }
        const resultTeam = await sql.awaitQuery("SELECT name FROM team WHERE team_id = ?", [teamId]);
        const resultTeamMember = await sql.awaitQuery("SELECT userid, leader, user.email, user.firstname, user.lastname, user.tags FROM teammember INNEER JOIN user ON userid=user.user_id WHERE teamId = ?", [teamId]);
        const member = [];
        for (const item of resultTeamMember) {
            const userId = item.userid
            const email = aes.decrypt(item.email);
            const firstname = aes.decrypt(item.firstname);
            const lastname = aes.decrypt(item.lastname);
            const encTags = JSON.parse(item.tags);
            const tags = [];
            for (const tag of encTags) {
                tags.push(aes.decrypt(tag))
            }
            const obj = {"userid": userId, "email": email, "firstname": firstname, "lastname": lastname, "tags": tags}
            member.push(obj)
        }
        const obj = {"teamname": aes.decrypt(resultTeam[0].name), "teamid": teamId, "member": member};
        return {status: 200, body: obj}
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * remove Teammember
 * @param user_id
 * @param teamId
 * @param memberId
 */
async function removeTeamMember(user_id: any, teamId: any, memberId: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!(validator.isId(teamId) && validator.isId(memberId))) {
        return {status: 400}
    }
    try {
        const check = await sql.awaitQuery("SELECT null FROM teammember WHERE userid = ? AND teamid = ? AND leader = ?", [user_id, teamId, 1]);
        if (check.length == 0) {
            return {status: 403}
        }
        const result = await sql.awaitQuery("DELETE FROM teammember WHERE userid = ? AND teamid = ? AND leader = ?", [memberId, teamId, 0]);
        if (result.affectedRows == 0) {
            return {status: 409}
        } else {
            return {status: 200, body: {"teamid": teamId}}
        }
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * leave team
 * @param user_id
 * @param teamId
 */
async function leaveTeam(user_id: any, teamId: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!validator.isId(teamId)) {
        return {status: 400}
    }
    try {
        const result = await sql.awaitQuery("DELETE FROM teammember WHERE userid = ? AND teamid = ? AND leader = ?", [user_id, teamId, 0]);
        if (result.affectedRows == 0) {
            return {status: 409}
        } else {
            return {status: 200, body: {"teamid": teamId}}
        }
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

async function getInvitations(user_id: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    try {
        const result = await sql.awaitQuery("SELECT team.team_id, team.name FROM invitation INNER JOIN team on invitation.team_id = team.team_id WHERE user_id = ?;", [user_id]);
        const arr = [];
        for (const item of result) {
            const obj = {"id": item.team_id, "name": aes.decrypt(item.name)}
            arr.push(obj)
        }
        return {status: 200, body: arr}
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * promote person to team leader
 * @param user_id
 * @param memberId
 * @param teamId
 */
async function promoteTeamLeader(user_id: any, memberId: any, teamId: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!(validator.isId(memberId) && validator.isId(teamId))) {
        return {status: 40}
    }
    try {
        const check = await sql.awaitQuery("SELECT null FROM teammember WHERE userid = ? AND teamid = ? AND leader = ?", [user_id, teamId, 1]);
        if (check.length == 0) {
            return {status: 403}
        }
        const result = await sql.awaitQuery("UPDATE teammember SET leader = ? WHERE teamid = ? AND userid = ?;", [1, teamId, memberId]);
        if (result.affectedRows == 0) {
            return {status: 409}
        } else {
            await sql.awaitQuery("UPDATE teammember SET leader = ? WHERE teamid = ? AND userid = ?;", [0, teamId, user_id]);
            return {status: 200}
        }
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * add team member
 * @param user_id
 * @param userEmail
 * @param teamId
 */
async function addTeamMember(user_id: any, userEmail: any, teamId: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401};
    }
    if (!(validator.isId(teamId) && validator.isEmail(userEmail))) {
        return {status: 400}
    }
    try {
        const result = await sql.awaitQuery("SELECT user_id FROM user WHERE email = ?", [aes.encrypt(userEmail)]);
        if (result.length == 0) {
            //TODO maybe think about better http status code
            return {status: 404}//user not found
        }
        const userId = result[0].user_id;
        const check = await sql.awaitQuery("SELECT * FROM teammember WHERE userid = ? AND teamid = ?", [userId, teamId]);
        if (check.length > 0) {
            return {status: 403}
        }
        await sql.awaitQuery("INSERT INTO invitation (user_id, team_id) VALUES (?, ?)", [userId, teamId]);
        return {status: 200}
    } catch (e) {
        // @ts-ignore
        if (e.errno == 1062) {
            return {status: 409}//already got an invitation
        }
        console.error(e)
        return {status: 500}
    }
}

/**
 * accept team invitation
 * @param user_id
 * @param teamId
 */
async function acceptInvitation(user_id: any, teamId: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401}
    }
    if (!validator.isId(teamId)) {
        return {status: 400}
    }
    try {
        const check = await sql.awaitQuery("DELETE FROM invitation WHERE user_id = ? AND team_id = ?", [user_id, teamId]);
        if (check.affectedRows == 0) {
            return {status: 409}
        }
        await sql.awaitQuery("INSERT INTO `bugsbunnies`.`teammember` (`teamid`, `userid`, `leader`) VALUES ('?', '?', '?')", [teamId, user_id, 0]);
        return {status: 200}
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

export {
    createTeam,
    deleteTeam,
    getTeams,
    getTeam,
    removeTeamMember,
    leaveTeam,
    getInvitations,
    promoteTeamLeader,
    addTeamMember,
    acceptInvitation
}