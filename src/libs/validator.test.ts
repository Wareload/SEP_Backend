import * as validator from "./validator";

test("Test Validator isEmail", () => {
    let email: any[] = ["1.1@1", "bugs@bunny.best", "test@test.test", "G65Sl14t9A9Nwf0W6PqUOlUDUrNmXaFLnDrjvnB2DwWuKRPCfia1zDqwQxyVRpbuqoB8WwdBAm9CV1KMgF55RJxCCSbJUk4lNjANFDTLB0GGWXhPIBQpYrVmdzOPSQJuZPJ4FksqAmXgE3zepCBg2E78eZ2hnffZS14.LfeIkNUEiriP45UzylTQeMZFfVzF7WSKJJ3n0TSB@bPlNS7PUO0yszmIoqVZ0zzoZwGYJKiGuPCgvNv1uI9DavDKD3xTkkLjorjynlc0frFBWnKajkZRasHznVVl8KZNWDOxbkh05XLn8cgIdcvuLonu5wVnnD"];
    let notEmail: any[] = [5, true, false, {}, [], " . @ ", ".@", "1", "sample.test", "G65Sl14t9A9Nwf0W6PqUOlUDUrNmXaFLnDrjvnB2DwWuKRPCfia1zDqwQxyVRpbuqoB8WwdBAm9CV1KMgF55RJxCCSbJUk4lNjANFDTLB0GGWXhPIBQpYrVmdzOPSQJuZPJ4FksqAmXgE3zepCBg2E78eZ2hnffZS143"];
    email.forEach((element) => {
        expect(validator.isEmail(element)).toBe(true);
    })
    notEmail.forEach((element) => {
        expect(validator.isEmail(element)).toBe(false);
    })
})
test("Test Validator isPassword", () => {
    let password: any[] = ["12345678901234567890123456789012345678901234567b1A", "TestTest123", "P234567t", "SAD123abc"];
    let notPassword: any[] = [1, true, false, "1", "B23456a", "123456678658dvsyf", "gredsnihjosduihogf", "HUIUHIUHILUHIAFSSFA", "HKJLDFGSAHKJ32423", "12345678901234567890123456789012345678901234567b1Ac"];
    password.forEach((element) => {
        expect(validator.isPassword(element)).toBe(true);
    })
    notPassword.forEach((element) => {
        expect(validator.isPassword(element)).toBe(false);
    })
})
test("Test Validator isisText45", () => {
    let text: any[] = ["T", "Test", "Test123&%", "123456789012345678901234567890123456789012345"];
    let notText: any[] = ["", undefined, [], {}, 1, 14, "1234567890123456789012345678901234567890123456"];
    text.forEach((element) => {
        expect(validator.isText45(element)).toBe(true);
    })
    notText.forEach((element) => {
        expect(validator.isText45(element)).toBe(false);
    })
})
test("Test Validator isTagArray", () => {
    let tagArray: any[] = [["Test", "Sample", "Strings"]];
    let notTagArray: any[] = [[1, 2, 3, 45]];
    tagArray.forEach((element) => {
        expect(validator.isTagsArray(element)).toBe(true);
    })
    notTagArray.forEach((element) => {
        expect(validator.isTagsArray(element)).toBe(false);
    })
})
test("Test Validator isId", () => {
    expect(validator.isId({})).toBe(false);
    expect(validator.isId({number: 5})).toBe(false);
    expect(validator.isId([])).toBe(false);
    expect(validator.isId(true)).toBe(false);
    expect(validator.isId(false)).toBe(false);
    expect(validator.isId(5)).toBe(true);
    expect(validator.isId("5")).toBe(true);

})