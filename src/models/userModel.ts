import mongoose, { Schema } from "mongoose";

const bcrypt = require("bcrypt");

const userSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

userSchema.path("username").validate(async (username: String) => {
	let usernameCount = await mongoose.models.User.countDocuments({ username });
	return !usernameCount;
}, "Username already exist");

userSchema.path("email").validate(async (email: String) => {
	let emailCount = await mongoose.models.User.countDocuments({ email });
	return !emailCount;
}, "Email already exist");

userSchema.pre("save", async function (this: any, next: any) {
	try {
		let salt = await bcrypt.getSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		console.log(err);
	}
});

export default mongoose.model("User", userSchema);
