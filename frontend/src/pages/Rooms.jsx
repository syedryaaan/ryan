import React, { useState, useEffect } from "react";

// ==============================================================================
// Rooms — Beginner-Friendly Campus Dormitories List Page
// Displays all rooms, supports search & block filters, and shows bed vacancies.
// ==============================================================================
function Rooms({ initialBlock = "", initialSearch = "", onNavigate }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBlock, setSelectedBlock] = useState(initialBlock || "All");
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");

  // Update filters if props change
  useEffect(() => {
    if (initialBlock) setSelectedBlock(initialBlock);
    if (initialSearch) setSearchTerm(initialSearch);
  }, [initialBlock, initialSearch]);

  const fallbackRooms = [
    {
      _id: "r1",
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
      _id: "r2",
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
      _id: "r3",
      roomNumber: "A-201",
      block: "Block A (Boys)",
      category: "Triple Sharing",
      floor: "2nd Floor",
      capacity: 3,
      occupiedBeds: 3,
      pricePerSemester: 45000,
      amenities: ["High-Speed Wi-Fi", "Common Bath", "Balcony View"],
      status: "Occupied",
    },
    {
      _id: "r4",
      roomNumber: "B-101",
      block: "Block B (Girls)",
      category: "Double Sharing",
      floor: "1st Floor",
      capacity: 2,
      occupiedBeds: 2,
      pricePerSemester: 55000,
      amenities: ["High-Speed Wi-Fi", "Attached Bathroom", "Air Conditioning"],
      status: "Occupied",
    },
    {
      _id: "r5",
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
      _id: "r6",
      roomNumber: "C-301",
      block: "Block C (Scholars)",
      category: "Single Scholar",
      floor: "3rd Floor",
      capacity: 1,
      occupiedBeds: 1,
      pricePerSemester: 80000,
      amenities: ["Gigabit Ethernet", "Attached Bath", "AC", "Quiet Zone"],
      status: "Occupied",
    },
  ];

  // Fetch Rooms from Backend
  const fetchRooms = () => {
    setLoading(true);
    setError("");

    let url = "http://localhost:5001/api/rooms";
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch rooms");
        return res.json();
      })
      .then((data) => {
        const fetched = Array.isArray(data) ? data : data.data || data.rooms || [];
        if (fetched.length > 0) {
          setRooms(fetched);
        } else {
          setRooms(fallbackRooms);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading rooms, using fallback:", err.message);
        setRooms(fallbackRooms);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter in memory for instantaneous beginner-friendly UI feedback
  const filteredRooms = rooms.filter((r) => {
    // Block filter
    if (selectedBlock && selectedBlock !== "All") {
      if (!r.block || !r.block.toLowerCase().includes(selectedBlock.toLowerCase().split(" ")[0])) {
        return false;
      }
    }

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchNumber = r.roomNumber && r.roomNumber.toLowerCase().includes(q);
      const matchBlock = r.block && r.block.toLowerCase().includes(q);
      const matchCategory = r.category && r.category.toLowerCase().includes(q);
      if (!matchNumber && !matchBlock && !matchCategory) return false;
    }

    return true;
  });

  return (
    <div className="rooms-page-container">
      <div className="rooms-page-header">
        <div>
          <h1>Campus Dormitories & Bed Inventory</h1>
          <p>Explore residential accommodation across Block A, Block B, and Block C wings</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rooms-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by room number, block, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-block-select">Wing:</label>
          <select
            id="filter-block-select"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="form-select"
          >
            <option value="All">All Hostel Wings</option>
            <option value="Block A">Block A (Boys)</option>
            <option value="Block B">Block B (Girls)</option>
            <option value="Block C">Block C (Scholars)</option>
          </select>
        </div>
      </div>

      {/* Rooms Content */}
      {loading ? (
        <p className="status-notice">Loading dormitory rooms...</p>
      ) : error ? (
        <p className="alert alert-error">{error}</p>
      ) : filteredRooms.length === 0 ? (
        <div className="empty-state-box">
          <span className="empty-icon">🛏️</span>
          <h3>No Dormitories Found</h3>
          <p>Try clearing your search query or selecting another campus block.</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {filteredRooms.map((room) => {
            const vacant =
              room.vacantBeds !== undefined
                ? room.vacantBeds
                : room.availableBeds !== undefined
                ? room.availableBeds
                : Math.max(0, (room.capacity || 2) - (room.occupiedBeds || 0));

            return (
              <div className="room-card" key={room._id || room.roomNumber}>
                <div className="room-card-header">
                  <span className="room-block-pill">{room.block}</span>
                  <span className={`vacancy-tag ${vacant > 0 ? "vacant" : "full"}`}>
                    {vacant > 0 ? `${vacant} Beds Available` : "Occupied"}
                  </span>
                </div>

                <h3 className="room-title">Room {room.roomNumber}</h3>
                <p className="room-category-text">{room.category || room.sharingCategory || "Double Sharing"} • {room.floor || "Floor 1"}</p>

                {room.amenities && room.amenities.length > 0 && (
                  <div className="room-amenities-tags">
                    {room.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="amenity-mini-tag">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                )}

                <div className="room-price-box">
                  <span className="room-currency">₹{Number(room.pricePerSemester).toLocaleString()}</span>
                  <span className="room-per-sem"> / Semester</span>
                </div>

                <button
                  type="button"
                  className="btn-apply-card"
                  onClick={() => onNavigate && onNavigate("/my-bookings")}
                >
                  Apply for Bed →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Rooms;
