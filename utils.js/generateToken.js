import jwt from "jsonwebtoken";

const generateToken = (user) => {
	return jwt.sign(user, process.env.SECRET_KEY, {
		expiresIn: 30 * 24 * 60 * 60 * 1000,
	});
};
export default generateToken;
