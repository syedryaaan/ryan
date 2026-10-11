const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Dynamic auth middleware lookup
let protect = (req, res, next) => next();
try {
  const auth = require("../middleware/authMiddleware");
  if (auth && auth.protect) protect = auth.protect;
} catch (e) {
  // Fallback if auth is unavailable
}

router.get("/", (req, res) => {
  if (bookingController && bookingController.getMyBookings) {
    return bookingController.getMyBookings(req, res);
  }
  res.json({ success: true, bookings: [] });
});

if (bookingController) {
  if (bookingController.createBooking) {
    router.post("/", protect, bookingController.createBooking);
  }
  if (bookingController.getMyBookings) {
    router.get("/my", protect, bookingController.getMyBookings);
    router.get("/my-bookings", protect, bookingController.getMyBookings);
  }
  if (bookingController.getBookingById) {
    router.get("/:id", protect, bookingController.getBookingById);
  }
  if (bookingController.vacateBooking || bookingController.cancelBooking) {
    const vacateHandler =
      bookingController.vacateBooking || bookingController.cancelBooking;
    router.patch("/:id/cancel", protect, vacateHandler);
    router.patch("/:id/vacate", protect, vacateHandler);
  }
}

module.exports = router;
