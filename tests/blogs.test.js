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

describe("when login in", async () => {
	beforeEach(async () => {
		await page.login();
		await page.click("a.btn-floating");
	});

	test("should show create blog page", async () => {
		const label = await page.getContentsOf(".title label");
		expect(label).toBe("Blog Title");
	});

	describe("and using valid inputs", async () => {
		beforeEach(async () => {
			await page.type(".title input", "my title");
			await page.type(".content input", "my content");
			await page.click("form button");
		});
		test("submitting takes user to review screen", async () => {
			const text = await page.getContentsOf("h5");
			expect(text).toEqual("Please confirm your entries");
		});

		test("submitting then saving adds blog to index page", async () => {
			await page.click("button.green");
			await page.waitFor(".card");

			const title = await page.getContentsOf(".card-title");
			const content = await page.getContentsOf("p");

			expect(title).toEqual("my title");
			expect(content).toEqual("my content");
		});
	});

	describe("and using invalid inputs", async () => {
		beforeEach(async () => {
			await page.click("form button");
		});

		test("the form shows an error message", async () => {
			const titleError = await page.getContentsOf(".title .red-text");
			const contentError = await page.getContentsOf(".content .red-text");

			expect(titleError).toEqual("You must provide a value");
			expect(contentError).toEqual("You must provide a value");
		});
	});
});

describe("user is not logged in", async () => {
	test("User cannot create blog posts", async () => {
		const result = await page.evaluate(async () => {
			return fetch("/api/blogs", {
				method: "POST",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: "my title",
					content: "my content",
				}),
			}).then((res) => res.json());
		});
		expect(result).toEqual({ error: "You must log in!" });
	});
	test("User cannot get blog posts", async () => {
		const result = await page.evaluate(async () => {
			return fetch("/api/blogs", {
				method: "GET",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());
		});
		expect(result).toEqual({ error: "You must log in!" });
	});
});
