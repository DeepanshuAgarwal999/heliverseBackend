import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectToDB from "./connectToDB.js";
import userRouter from "./routes/userRoute.js";
import userDtoRouter from "./routes/userDtoRoute.js";
import teamRouter from "./routes/team.route.js";

connectToDB();

const app = express();

app.use(express.json()); //middleware
app.use(
	cors({
		origin: [process.env.FRONTEND_URL],
		method: ["GET", "POST", "PUT", "DELETE"],
	})
);
app.use(cookieParser(""));
app.use(morgan("dev"));

const Port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
	res.send({
		message: "hello",
	});
});

app.use("/api/auth", userRouter);
app.use("/", userDtoRouter);
app.use("/team", teamRouter);

app.listen(Port, () => {
	console.log(`Server is running at port ${Port}`);
});
