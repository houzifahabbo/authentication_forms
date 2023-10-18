const express = require('express');
const routes = express.Router();
const User = require('./userModel');


routes.get('/', (req, res) => {
    res.render("index",{ error: "" ,endpoint:"home"});
});

routes.get('/signup', (req, res) => {
    res.render("index", { error: "" ,endpoint:"signup"});
});

routes.get('/signin', (req, res) => {
    res.render("index", { error: "" ,endpoint:"signin"});
});

routes.post("/signin", async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).render("index", {
				error: "Username or password incorrect",
				endpoint: "signin",
			});
		}
		const valid = user.comparePassword(password);
		if (!valid) {
			return res.status(401).render("index", {
				error: "Username or password incorrect",
				endpoint: "signin",
			});
		}
		res.status(200).redirect("/");
	} catch (error) {
		res.render("index", { error: error.message, endpoint: "signin" });
	}
});

routes.post("/signup", async (req, res) => {
	const { username, password } = req.body;
	try {
		let user = await User.findOne({ username });
		if (user) {
			return res.status(401).render("index", {
				error: "Username already exists",
				endpoint: "signup",
			});
		}
		user = new User({
			username,
			password,
		});
		await user.save();
		res.status(200).redirect("/");
	} catch (error) {
		console.log(error);
		res.render("index", { error: error.message, endpoint: "signup" });
	}
});  

module.exports = routes;