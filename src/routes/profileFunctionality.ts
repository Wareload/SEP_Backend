import * as aes from '../libs/aes'
import {sql} from '../libs/mysqlconnection'
import * as validator from '../libs/validator'

/**
 * adjust profile
 * @param user_id
 * @param tags
 * @param firstname
 * @param lastname
 */
async function adjustProfile(user_id: any, tags: any, firstname: any, lastname: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401};
    }
    if (!(validator.isTagsArray(tags) && validator.isText45(firstname) && validator.isText45(lastname))) {
        return {status: 400};
    }
    firstname = aes.encrypt(firstname);
    lastname = aes.encrypt(lastname)
    const encTags = [];
    //encrypt string in json array
    for (let item of tags) {
        encTags.push(aes.encrypt(item));
    }
    try {
        await sql.awaitQuery("UPDATE `user` SET `firstname` = ?, `lastname` = ?, `tags` = ? WHERE (`user_id` = ?)", [firstname, lastname, JSON.stringify(encTags), user_id]);
        return {status: 200}
    } catch (e) {
        console.error(e)
        return {status: 500}
    }
}

/**
 * get profile
 * @param user_id
 */
async function getProfile(user_id: any): Promise<{ status: number, body?: {} }> {
    if (!user_id) {
        return {status: 401};
    }
    try {
        const result = await sql.awaitQuery("SELECT email, firstname, lastname, tags FROM user WHERE user_id = ?", [user_id]);
        const email = aes.decrypt(result[0].email);
        const firstname = aes.decrypt(result[0].firstname);
        const lastname = aes.decrypt(result[0].lastname);
        const encTags = JSON.parse(result[0].tags)
        const tags = [];
        for (let item of encTags) {
            tags.push(aes.decrypt(item));
        }
        return {status: 200, body: {"email": email, "fistname": firstname, "lastname": lastname, "tags": tags}}
    } catch (e) {
        console.error(e)
        return {status: 500};
    }
}

export {getProfile, adjustProfile}