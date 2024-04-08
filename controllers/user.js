import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils.js/generateToken.js";

export const userRegister = async (req, res) => {
	try {
		const { first_name, last_name = "", password, email } = req.body;
		if (!first_name || !password || !email) {
			return res.status(401).json({
				success: false,
				massage: "please fill all the fields",
			});
		}
		const userExist = await User.findOne({ email });

		if (userExist) {
			return res.status(401).json({
				success: false,
				message: "user already exist",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const createdUser = await User.create({
			first_name,
			last_name,
			email,
			password: hashedPassword,
		});

		if (createdUser) {
			return res.status(201).json({
				success: true,
				message: "user registered successfully",
			});
		} else {
			return res.status(403).json({
				success: false,
				message: "Unable to register",
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal server error",
			success: false,
		});
	}
};

export const userLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(401).json({
				success: false,
				massage: "please fill fields",
			});
		}
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Register before Login",
			});
		}
		const isMatch = await bcrypt.compare(password, user.password);

		if (isMatch) {
			const { password: _, ...userDetails } = user.toObject();
			const token = generateToken(userDetails);
			return res.status(200).json({
				success: true,
				message: "user login successfully",
				userDetails,
				token: token,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}
	} catch (err) {
		res.status(500).json({
			message: "Internal server error " + err,
			success: false,
		});
	}
};
