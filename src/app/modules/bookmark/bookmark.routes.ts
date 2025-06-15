import express from "express";
import { BookmarkController } from "./bookmark.controller";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";

const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.USER),
        BookmarkController.toggleBookmark
    )
    .get(
        auth(USER_ROLES.USER),
        BookmarkController.getBookmark
    );

export const BookmarkRoutes = router;