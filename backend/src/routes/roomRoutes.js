const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// Public endpoints
router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);

// Warden / Admin endpoints
router.post("/", roomController.createRoom);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

// Student review endpoint
router.post("/:id/reviews", roomController.addReview);

module.exports = router;