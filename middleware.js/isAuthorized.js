import jwt from "jsonwebtoken";

const isAuthorized = async (req, res, next) => {
	try {
		const authorization = req.headers.authorization;
		if (!authorization) {
			return res.status(401).json({
				message: "Invalid request",
				success: false,
			});
		}
		const token = authorization.split(" ")[1];
		if (!token) {
			return res.status(401).json({
				message: "Token required",
				success: false,
			});
		}
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		if (decoded) {
			req.user = decoded;
			next();
		}
	} catch (err) {
		console.log("Error in middleware", err);
		return res.status(401).json({
			message: "Token expired",
			success: false,
		});
	}
};
export default isAuthorized;
