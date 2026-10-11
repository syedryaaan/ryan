require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

const seedData = async () => {
  try {
    await connectDB();

    // Wipe existing data safely
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed...");

    // 1. Seed Chief Warden & Student
    const adminUser = await User.create({
      name: "Chief Warden",
      email: "admin@xshostel.com",
      password: "Admin@123",
      passwordHash: "Admin@123",
      role: "admin",
      phone: "+91 9876543210"
    });

    const studentUser = await User.create({
      name: "Demo Student",
      email: "student@xshostel.com",
      password: "Student@123",
      passwordHash: "Student@123",
      role: "student",
      studentId: "STU-2026-1042",
      course: "Computer Science & Engineering",
      gender: "Male",
      phone: "+91 9876543211",
      guardianName: "Guardian Name",
      guardianPhone: "+91 9876543212"
    });

    // 2. Seed 8 Dormitory Rooms
    const rooms = await Room.insertMany([
      {
        name: "Block A Double Sharing Study Dorm",
        roomNumber: "A-101",
        block: "Block A (Boys)",
        category: "Double Sharing",
        gender: "Boys",
        floor: 1,
        capacity: 2,
        occupiedBeds: 1,
        pricePerSemester: 32000,
        amenities: ["High-Speed Gigabit Wi-Fi", "Study Desk with Lamp", "Attached Bath"],
        curfewTime: "10:00 PM"
      },
      {
        name: "Block A Triple Sharing Economy Dorm",
        roomNumber: "A-102",
        block: "Block A (Boys)",
        category: "Triple Sharing",
        gender: "Boys",
        floor: 1,
        capacity: 3,
        occupiedBeds: 1,
        pricePerSemester: 24000,
        amenities: ["High-Speed Gigabit Wi-Fi", "Study Desk"],
        curfewTime: "10:00 PM"
      },
      {
        name: "Block A Single Scholar Premium Dorm",
        roomNumber: "A-201",
        block: "Block A (Boys)",
        category: "Single Scholar",
        gender: "Boys",
        floor: 2,
        capacity: 1,
        occupiedBeds: 0,
        pricePerSemester: 48000,
        amenities: ["High-Speed Gigabit Wi-Fi", "Individual Locker", "Attached Bath"],
        curfewTime: "10:00 PM"
      },
      {
        name: "Block B Double Sharing Comfort Dorm",
        roomNumber: "B-101",
        block: "Block B (Girls)",
        category: "Double Sharing",
        gender: "Girls",
        floor: 1,
        capacity: 2,
        occupiedBeds: 0,
        pricePerSemester: 34000,
        amenities: ["High-Speed Gigabit Wi-Fi", "Study Desk", "Balcony View"],
        curfewTime: "10:00 PM"
      },
      {
        name: "Block B Quad Sharing Budget Dorm",
        roomNumber: "B-102",
        block: "Block B (Girls)",
        category: "Quad Sharing",
        gender: "Girls",
        floor: 1,
        capacity: 4,
        occupiedBeds: 0,
        pricePerSemester: 21000,
        amenities: ["High-Speed Gigabit Wi-Fi", "Individual Locker"],
        curfewTime: "10:00 PM"
      },
      {
        name: "Block B Single Scholar Executive Dorm",
        roomNumber: "B-201",
        block: "Block B (Girls)",
        category: "Single Scholar",
        gender: "Girls",
        floor: 2,
        capacity: 1,
        occupiedBeds: 0,
        pricePerSemester: 50000,
        amenities: ["High-Speed Gigabit Wi-Fi", "Attached Bath", "AC"],
        curfewTime: "10:00 PM"
      },
      {
        name: "Block C Single Scholar Research Suite",
        roomNumber: "C-101",
        block: "Block C (Scholars)",
        category: "Single Scholar",
        gender: "Co-ed",
        floor: 1,
        capacity: 1,
        occupiedBeds: 0,
        pricePerSemester: 55000,
        amenities: ["High-Speed Gigabit Wi-Fi", "Soundproof Study Pod", "Attached Bath"],
        curfewTime: "10:00 PM"
      },
      {
        name: "Block C Double Sharing Scholar Suite",
        roomNumber: "C-201",
        block: "Block C (Scholars)",
        category: "Double Sharing",
        gender: "Co-ed",
        floor: 2,
        capacity: 2,
        occupiedBeds: 0,
        pricePerSemester: 38000,
        amenities: ["High-Speed Gigabit Wi-Fi", "Study Desk", "Individual Locker"],
        curfewTime: "10:00 PM"
      }
    ]);

    // 3. Seed 2 Active Sample Bookings
    await Booking.create([
      {
        bookingReference: "HST-2026-100001",
        user: studentUser._id,
        room: rooms[0]._id,
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-12-15"),
        academicYear: "2026-2027",
        semester: "Fall Semester",
        messPlan: "Standard 4-Meal",
        baseSemesterFee: 32000,
        messFee: 18000,
        cautionDeposit: 5000,
        totalFee: 55000,
        status: "confirmed",
        paymentStatus: "paid",
        emergencyContact: {
          name: "Guardian Name",
          phone: "+91 9876543212",
          relationship: "Parent"
        }
      },
      {
        bookingReference: "HST-2026-100002",
        user: studentUser._id,
        room: rooms[1]._id,
        startDate: new Date("2027-01-05"),
        endDate: new Date("2027-05-20"),
        academicYear: "2026-2027",
        semester: "Spring Semester",
        messPlan: "Special Diet",
        baseSemesterFee: 24000,
        messFee: 24000,
        cautionDeposit: 5000,
        totalFee: 53000,
        status: "confirmed",
        paymentStatus: "paid",
        emergencyContact: {
          name: "Guardian Name",
          phone: "+91 9876543212",
          relationship: "Parent"
        }
      }
    ]);

    // 4. Seed 3 Student Reviews
    await Review.create([
      {
        user: studentUser._id,
        room: rooms[0]._id,
        rating: 5,
        comment: "Excellent dormitory facilities with reliable Wi-Fi and quiet study environment."
      },
      {
        user: studentUser._id,
        room: rooms[1]._id,
        rating: 4,
        comment: "Great room size and good maintenance. Very close to the campus library."
      },
      {
        user: studentUser._id,
        room: rooms[2]._id,
        rating: 5,
        comment: "Premium single room with high privacy and attached bath. Worth the fee."
      }
    ]);

    console.log("Data Imported Successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Seeder failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();