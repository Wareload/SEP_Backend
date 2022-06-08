import * as crypto from 'crypto';
//aes requirements
const ENC_KEY = process.env.AES_ENC_KEY;
const IV = process.env.AES_IV;
/**
 * encrypt value with aes
 * @type {function(*=): string}
 */
const encrypt = ((val: string): string => {
    // @ts-ignore
    let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
});

/**
 * decrypt value with aes
 * @type {function(*=): string}
 */
const decrypt = ((encrypted: string): string => {
    // @ts-ignore
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
});

export {
    encrypt,
    decrypt
};