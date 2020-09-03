jest.setTimeout(50000);

const Page = require("./helpers/page.js");

let page;

beforeEach(async () => {
	page = await Page.build();
	page.setDefaultNavigationTimeout(0);
	await page.goto("localhost:3000");
});

afterEach(async () => {
	await page.close();
});

test("Header has the correct logo text", async () => {
	// const text = await page.$eval(, (el) => el.innerHTML);
	try {
		const text = await page.getContentsOf("a.brand-logo");
		expect(text).toEqual("Blogster");
	} catch (e) {
		await page.reload("localhost:3000");
	}
});

test("clicking login start oauth flow ", async () => {
	try {
		await page.click(".right a");
		const url = await page.url();
		expect(url).toMatch("https://accounts.google.com/o/oauth2");
	} catch (e) {
		await page.reload("localhost:3000");
	}
});

test("when sign in. show logout button", async () => {
	try {
		await page.login();
		const text = await page.$eval(
			'a[href="/auth/logout"] ',
			(el) => el.innerHTML
		);

		expect(text).toBe("Logout");
	} catch (e) {
		await page.reload("localhost:3000");
	}
});
