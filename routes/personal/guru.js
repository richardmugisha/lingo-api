
import express from "express";

const router = express.Router();

import {
    getGuru, createGuru, updateGuru,
} from "../../controllers/personal/guru/structure.js";

import {
    getGuruChat, createGuruChat, updateGuruChat, chatWithAI
} from "../../controllers/personal/guru/chat.js";

router.route("/chats/:id").get(getGuruChat).patch(updateGuruChat);
router.route("/chats").post(createGuruChat);

router.route("/chat").post(chatWithAI)

router.route("/:id").get(getGuru).patch(updateGuru);
router.route("/").post(createGuru)


export default router;