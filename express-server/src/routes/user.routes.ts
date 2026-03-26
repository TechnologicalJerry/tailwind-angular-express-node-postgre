import { Router } from "express";
import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  updateUserHandler,
} from "../controllers/user.controller";
import { asyncHandler } from "../middleware/async-handler";

const router = Router();

router.get("/", asyncHandler(getUsersHandler));
router.get("/:userId", asyncHandler(getUserHandler));
router.post("/", asyncHandler(createUserHandler));
router.put("/:userId", asyncHandler(updateUserHandler));
router.delete("/:userId", asyncHandler(deleteUserHandler));

export default router;