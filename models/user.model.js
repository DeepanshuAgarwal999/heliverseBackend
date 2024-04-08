	import mongoose from "mongoose";

	const userSchema = new mongoose.Schema({
		first_name: { type: String, required: true },
		last_name: { type: String },
		email: { type: String, required: true },
		password: { type: String, required: true },
		saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
		createdAt: { type: Date, default: Date.now() },
	});

	export const User = mongoose.model("User", userSchema) || mongoose.models.User;
