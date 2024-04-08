import mongoose from "mongoose";

const userDtoSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	gender: { type: String, required: true },
	avatar: { type: String },
	domain: { type: String },
	available: { type: Boolean, required: true },
});
export const userDto = mongoose.model("UserDto", userDtoSchema);
