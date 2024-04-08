import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { userDto } from "../models/userDto.model.js";

export const createTeam = async (req, res) => {
	try {
		const { teamMembers, teamName } = req.body;
		
		if (!teamMembers || teamMembers.length !== 5) {
			return res.status(400).json({
				message: "Invalid team size",
			});
		}

		await Promise.all(
			teamMembers.map(async (memberId) => {
				await userDto.findByIdAndUpdate(memberId, { available: false });
			})
		);

		const newTeam = new Team({
			teamName,
			teamMembers,
			createdBy: req.user._id,
		});

		const result = await newTeam.save();

		if (result) {
			await User.findByIdAndUpdate(
				req.user._id,
				{ $push: { saved: newTeam._id } },
				{ new: true }
			);
			return res
				.status(201)
				.json({ message: "Team created successfully", team: newTeam });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const getTeam = async (req, res) => {
	try {
		const userId = req.user._id;
		if (userId) {
			const teams = await Team.find({ createdBy: userId }).populate({
				path: "teamMembers",
				model: "UserDto",
			});
			return res.status(200).json({
				teams,
			});
		} else {
			return res.status(403).json({ message: "user unauthorized" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const deleteTeam = async (req, res) => {
	try {
		const teamId = req.params.id;
		if (!teamId) {
			return res.status(403).json({
				message: "Invalid request",
			});
		}
		const team = await Team.findByIdAndDelete(teamId);

		if (team) {
			const teamMembers = team.teamMembers;

			await Promise.all(
				teamMembers.map(async (memberId) => {
					await userDto.findByIdAndUpdate(memberId, { available: true });
				})
			);
			return res.status(200).json({
				message: "team deleted Successfully",
			});
		} else {
			return res.status(400).json({
				message: "Unable to delete team",
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};
