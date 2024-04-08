// DBconn.js

import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
	if (isConnected) {
		console.log("MongoDB is already connected");
		return;
	}

	try {
		const res = await mongoose.connect(process.env.DATABASE_URL, {
			dbName: "heliverse",
		});
		isConnected = true;
		console.log("MongoDB connected successfully", res.connection.name);
	} catch (error) {
		console.warn("MongoDB unable to connect", error);
	}
};

export default connectToDB;
