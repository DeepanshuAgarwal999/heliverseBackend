import express from "express";
import {
	createUser,
	deleteUserById,
	getPlayers,
	updatePlayerById,
} from "../controllers/userDto.js";
import isAuthorized from "../middleware.js/isAuthorized.js";

const router = express.Router();

router.get("/allplayers", getPlayers);
router.put("/update-player/:id", isAuthorized, updatePlayerById);
router.delete("/delete-player/:id", isAuthorized, deleteUserById);
router.post("/create-player", isAuthorized, createUser);

export default router;
