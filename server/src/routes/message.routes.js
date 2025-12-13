import express from "express";
import { fetchMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/", fetchMessages);

export default router;
