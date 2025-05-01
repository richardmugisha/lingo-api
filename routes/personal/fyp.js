import express from "express"
const router = express.Router();

import getFyp from "../../controllers/personal/fyp/getFyp.js"
import updateFyp from "../../controllers/personal/fyp/updateFyp.js";

router.route('/').get(getFyp).patch(updateFyp)

export default router