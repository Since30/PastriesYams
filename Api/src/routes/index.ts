import express, { Router } from "express";

import pastrie from "./pastrie";
import user from "./user";
import auth from "./auth";
import game from "./game";
import contact from "./contact";

const router: Router = express.Router();

router.use("/api", pastrie )
router.use("/", user )
router.use("/", auth )
router.use("/game", game);
router.use("/contact", contact );



export default router;