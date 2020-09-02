jest.setTimeout(35000);

const Page = require("./helpers/page.js");

let page;

beforeEach(async () => {
	page = await Page.build();
	page.setDefaultNavigationTimeout(0);
	await page.goto("http://localhost:3000");
});

afterEach(async () => {
	await page.close();
});

test("Header has the correct logo text", async () => {
	// const text = await page.$eval(, (el) => el.innerHTML);
	const text = await page.getContentsOf("a.brand-logo");
	expect(text).toEqual("Blogster");
});

test("clicking login start oauth flow ", async () => {
	await page.click(".right a");
	const url = await page.url();
	expect(url).toMatch("https://accounts.google.com/o/oauth2");
});

test("when sign in. show logout button", async () => {
	await page.login();
	const text = await page.$eval(
		'a[href="/auth/logout"] ',
		(el) => el.innerHTML
	);

	expect(text).toBe("Logout");
});
