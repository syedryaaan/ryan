const Room = require("../models/Room");
const mongoose = require("mongoose");

// Resilient seed rooms for local development mode
const fallbackRooms = [
  {
    _id: "661234567890abcdef200101",
    name: "Room A-101",
    roomNumber: "A-101",
    block: "Block A (Boys)",
    category: "Double Sharing",
    floor: "1st Floor",
    capacity: 2,
    occupiedBeds: 2,
    pricePerSemester: 55000,
    amenities: ["High-Speed Wi-Fi", "Attached Bathroom", "Study Desk"],
    status: "Occupied",
  },
  {
    _id: "661234567890abcdef200102",
    name: "Room A-102",
    roomNumber: "A-102",
    block: "Block A (Boys)",
    category: "Double Sharing",
    floor: "1st Floor",
    capacity: 2,
    occupiedBeds: 1,
    pricePerSemester: 55000,
    amenities: ["High-Speed Wi-Fi", "Attached Bathroom", "Study Desk"],
    status: "Available",
  },
  {
    _id: "661234567890abcdef200202",
    name: "Room B-205",
    roomNumber: "B-205",
    block: "Block B (Girls)",
    category: "Single Scholar",
    floor: "2nd Floor",
    capacity: 1,
    occupiedBeds: 0,
    pricePerSemester: 75000,
    amenities: ["High-Speed Wi-Fi", "Attached Bath", "Mini Refrigerator"],
    status: "Available",
  },
  {
    _id: "661234567890abcdef200301",
    name: "Room C-301",
    roomNumber: "C-301",
    block: "Block C (Scholars)",
    category: "Single Scholar",
    floor: "3rd Floor",
    capacity: 1,
    occupiedBeds: 1,
    pricePerSemester: 80000,
    amenities: ["Gigabit Ethernet", "Attached Bath", "AC"],
    status: "Occupied",
  },
];

const roomController = {
  // GET /api/rooms - Get all rooms with filtering, search & pagination
  getRooms: async (req, res) => {
    try {
      const {
        block,
        category,
        gender,
        minPrice,
        maxPrice,
        search,
        page = 1,
        limit = 10
      } = req.query;

      // If MongoDB is not directly active, safely return fallback seed data
      if (mongoose.connection.readyState !== 1) {
        let list = [...fallbackRooms];
        if (block) list = list.filter((r) => r.block === block);
        if (category) list = list.filter((r) => r.category === category);
        if (search) {
          const q = search.toLowerCase();
          list = list.filter(
            (r) =>
              (r.name && r.name.toLowerCase().includes(q)) ||
              (r.roomNumber && r.roomNumber.toLowerCase().includes(q))
          );
        }
        const lim = Number(limit) || 10;
        return res.status(200).json({
          success: true,
          count: list.length,
          total: list.length,
          page: 1,
          pages: 1,
          data: list.slice(0, lim),
        });
      }


      const query = {};

      if (block) query.block = block;
      if (category) query.category = category;
      if (gender) query.gender = gender;

      if (minPrice || maxPrice) {
        query.pricePerSemester = {};
        if (minPrice) query.pricePerSemester.$gte = Number(minPrice);
        if (maxPrice) query.pricePerSemester.$lte = Number(maxPrice);
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { roomNumber: { $regex: search, $options: "i" } }
        ];
      }

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const totalRooms = await Room.countDocuments(query);
      const rooms = await Room.find(query)
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: rooms.length,
        total: totalRooms,
        page: pageNum,
        pages: Math.ceil(totalRooms / limitNum),
        data: rooms
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // GET /api/rooms/:id - Get single room by ID
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/rooms - Create new dormitory room
  createRoom: async (req, res) => {
    try {
      const { roomNumber } = req.body;

      const existingRoom = await Room.findOne({ roomNumber });
      if (existingRoom) {
        return res.status(400).json({
          success: false,
          message: "Room number already exists"
        });
      }

      const room = await Room.create(req.body);

      res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // PUT /api/rooms/:id - Update room details
  updateRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Room updated successfully",
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // DELETE /api/rooms/:id - Delete room with safety check
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      if (room.occupiedBeds && room.occupiedBeds > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete room with active bed occupants"
        });
      }

      await room.deleteOne();

      res.status(200).json({
        success: true,
        message: "Room deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // POST /api/rooms/:id/reviews - Add review to room
  addReview: async (req, res) => {
    try {
      const { rating, comment, studentName } = req.body;
      const room = await Room.findById(req.params.id);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      const review = {
        rating: Number(rating),
        comment,
        studentName: studentName || "Student"
      };

      if (!room.reviews) {
        room.reviews = [];
      }

      room.reviews.push(review);
      await room.save();

      res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: room
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = roomController;