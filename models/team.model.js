import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
	teamName: { type: String, required: true }, 
	teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserDto" }], 
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	createdAT: { type: Date, default: Date.now() },
});

export const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
