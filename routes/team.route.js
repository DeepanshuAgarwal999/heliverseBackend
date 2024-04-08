import express from "express";
import isAuthorized from "../middleware.js/isAuthorized.js";
import { createTeam, deleteTeam, getTeam } from "../controllers/team.js";

const router = express.Router();

router.post("/register-team", isAuthorized, createTeam);
router.get("/get-team",isAuthorized, getTeam);
router.delete("/delete-team/:id", isAuthorized, deleteTeam);

export default router;
