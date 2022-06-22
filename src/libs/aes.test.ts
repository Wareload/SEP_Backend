process.env.AES_ENC_KEY = "8768aea604fe0172d9273bfc27ehfb8a";
process.env.AES_IV = "4e6f85301e155e63"
import {decrypt, encrypt} from "./aes.js";

describe("Testing AES", () => {

    test("Testing AES", () => {
        let array: string[] = ["murder", "inspector", "cooperation", "particular", "opinion", "I often see the time 11:11 or 12:34 on clocks.", "There's an art to getting your way, and spitting olive pits across the table isn't it."];
        array.forEach((element: string) => {
            expect(encrypt(element)).not.toBe(element)
            expect(decrypt(encrypt(element))).toBe(element);
        })
    })
})

