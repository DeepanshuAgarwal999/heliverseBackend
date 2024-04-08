import { userDto } from "../models/userDto.model.js";

export const getPlayers = async (req, res) => {
	try {
		const {
			page = 1,
			limit = 20,
			search,
			gender,
			available,
			domain,
		} = req.query;
		const skip = (page * 1 - 1) * limit;

		const query = {};

		if (search) {
			query.$or = [
				{ first_name: { $regex: new RegExp(search, "i") } },
				{ last_name: { $regex: new RegExp(search, "i") } },
			];
		}
		if (gender && gender.length > 0) {
			query.gender = { $regex: new RegExp(`^${gender}$`, "i") };
		}
		if (available === "false") {
			query.available = { $in: [false, null] };
		} else if (available === "true") {
			query.available = true;
		}
		if (domain) {
			query.domain = { $regex: new RegExp(`^${domain}$`, "i") };
		}

		const totalUsersCount = await userDto.countDocuments(query);
		const totalPages = Math.ceil(totalUsersCount / limit);

		const users = await userDto.find(query).skip(skip).limit(limit);

		return res.status(200).json({
			message:
				users.length > 0
					? "Users found successfully"
					: "No users found matching the criteria",
			success: true,
			users,
			totalPages,
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updatePlayerById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(404).json({
				message: "userId required",
			});
		}

		const { first_name, last_name, email, domain, avatar, gender, available } =
			req.body;

		const updateFields = {
			first_name,
			last_name,
			email,
			domain,
			gender,
			avatar,
			available,
		};

		// Find and update the user document
		const user = await userDto.findByIdAndUpdate(userId, updateFields, {
			new: true,
		});

		if (user) {
			return res.status(200).json({
				message: "User updated successfully",
				user: user,
			});
		} else {
			return res.status(400).json({
				message: "Unable to update user",
			});
		}
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(404).json({
				message: "userId required",
			});
		}

		const deletedUser = await userDto.findByIdAndDelete(userId);

		if (deletedUser) {
			return res.status(200).json({
				message: "User deleted successfully",
				user: deletedUser,
			});
		} else {
			return res.status(400).json({
				message: "Unable to delete user",
			});
		}
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export const createUser = async (req, res) => {
	try {
		const { first_name, last_name, email, domain, avatar, gender, available } =
			req.body;

		const newUser = new userDto({
			first_name,
			last_name,
			email,
			domain,
			gender,
			avatar,
			available,
		});

		const savedUser = await newUser.save();

		if (savedUser) {
			return res.status(201).json({
				message: "User created successfully",
				user: savedUser,
			});
		} else {
			return res.status(400).json({
				message: "Unable to create user",
			});
		}
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
