import express from "express";
const router = express.Router();

// import {getTopicCards, createCard, deleteCards} from '../controllers/personal.js'
import { updateTemporary, getTemporary, stealFromTemporary } from "../../controllers/personal/temporary.js"
router.route('/temporary').patch(updateTemporary).post(stealFromTemporary)
router.route('/temporary/:tempId').get(getTemporary)
// router.route('/:topicName').get(getTopicCards).post(createCard).delete(deleteCards)

export  default router