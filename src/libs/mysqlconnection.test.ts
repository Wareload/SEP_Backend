import {sql} from "./mysqlconnection.js";

describe("Test MySQL Connection", () => {
    test("check if Table exists", async () => {
        expect(sql).not.toBe(undefined)
        expect(Array.isArray(await sql.awaitQuery("select null from mood;"))).toBe(true);
        expect(Array.isArray(await sql.awaitQuery("select null from invitation;"))).toBe(true);
        expect(Array.isArray(await sql.awaitQuery("select null from team;"))).toBe(true);
        expect(Array.isArray(await sql.awaitQuery("select null from teammember;"))).toBe(true);
        expect(Array.isArray(await sql.awaitQuery("select null from user;"))).toBe(true);
    })
})