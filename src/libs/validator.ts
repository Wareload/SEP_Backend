/**
 * test for valid email with max length of 322
 * @param email
 * @returns {boolean}
 */
function isEmail(email: any): boolean {
    if (email != undefined && typeof email == 'string' && email.length > 3 && email.length <= 322 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return true;
    }
    return false
}


/**
 * test for valid password with min 8, max 50 letters, containing at least one number, one uppercase and lowercase letter
 * @param password
 * @returns {boolean}
 */
function isPassword(password: any): boolean {
    if (password != undefined && typeof password == 'string' && password.length > 7 && password.length < 51 && /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
        return true;
    }
    return false;
}

/**
 * is text with length >0 ad length <46
 * @param text
 */
function isText45(text: any): boolean {
    if (text != undefined && typeof text == 'string' && text.length > 0 && text.length < 46) {
        return true;
    }
    return false;
}

/**
 * check if tags is an array of strings
 * @param tags
 */
function isTagsArray(tags: any): boolean {
    if (Array.isArray(tags)) {
        for (let item of tags) {
            if (typeof item !== 'string') {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

/**
 * check if id is a number
 * @param id
 */
function isId(id: any): boolean {
    if (id != undefined && typeof id != "boolean" && Number(id)) {
        return true;
    }
    return false;
}


export {isEmail, isPassword, isText45, isTagsArray, isId}