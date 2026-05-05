import express from "express"
import {
  createLeave,
  getLeaves,
  deleteLeave,
  updateLeaveStatus
} from "../controllers/leaveController.js"

const router = express.Router()

// 🔥 ROUTES
router.post("/", createLeave)
router.get("/", getLeaves)
router.delete("/:id", deleteLeave)
router.put("/:id", updateLeaveStatus)

export default router