/**
 * test for valid email with max length of 322
 * @param email
 * @returns {boolean}
 */
function isEmail(email: string | undefined): boolean {
    if (email != undefined && email.length > 3 && email.length < 322 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return true;
    }
    return false
}


/**
 * test for valid password with min 8, max 50 letters, containing at least one number, one uppercase and lowercase letter
 * @param password
 * @returns {boolean}
 */
function isPassword(password: string | undefined): boolean {
    if (password != undefined && /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}/.test(password)) {
        return true;
    }
    return false;
}


export {isEmail, isPassword}