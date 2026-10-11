import React, { useState, useEffect } from "react";

// ==============================================================================
// Home — Beginner-Friendly Smart Campus Home Page
// Includes:
// 1. Hero Section with Call to Action
// 2. Search & Vacancy Filter Bar
// 3. Campus Features (6 cards)
// 4. Featured Dormitories (fetched from /api/rooms?limit=3)
// 5. Student Resident Testimonials
// 6. Frequently Asked Questions (FAQ with simple <details> elements)
// ==============================================================================
function Home({ onNavigate }) {
  // Search & Filter State
  const [block, setBlock] = useState("");
  const [sharing, setSharing] = useState("");
  const [search, setSearch] = useState("");

  // Featured Rooms State
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Campus Features Array
  const features = [
    {
      title: "Gigabit Mesh Wi-Fi",
      icon: "📶",
      text: "Fast and reliable Wi-Fi across the hostel campus.",
    },
    {
      title: "4-Meal Hygienic Dining",
      icon: "🍽️",
      text: "Fresh, healthy meals served four times daily in multi-cuisine mess.",
    },
    {
      title: "Biometric Security",
      icon: "🛡️",
      text: "Automated turnstiles, biometric scanners, and 24x7 security desk.",
    },
    {
      title: "Air-Conditioned Study Lounges",
      icon: "📚",
      text: "Quiet dedicated study zones equipped with high-speed ethernet ports.",
    },
    {
      title: "On-Campus Laundromat",
      icon: "✨",
      text: "Modern automated washing machines and clean drying yards.",
    },
    {
      title: "Sports & Recreation Court",
      icon: "🏸",
      text: "Indoor badminton, table tennis, and outdoor recreation facilities.",
    },
  ];

  // 2. Student Testimonials Array
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "B.Tech Student (Block A)",
      text: "The hostel is exceptionally clean and the quiet study floors make exam preparation painless and productive.",
    },
    {
      name: "Ananya Singh",
      role: "Research Scholar (Block B)",
      text: "The facilities, hygienic mess meals, and automated security system provide total peace of mind for research scholars.",
    },
    {
      name: "Vikram Patel",
      role: "M.Tech Resident (Block C)",
      text: "Gigabit internet speeds, attached baths, and approachable wardens make XSHostel feel like a second home.",
    },
  ];

  // 3. Fallback Seed Rooms in case backend database is offline or empty
  const fallbackRooms = [
    {
      _id: "seed_1",
      roomNumber: "A-101",
      block: "Block A (Boys)",
      category: "Double Sharing",
      pricePerSemester: 55000,
      capacity: 2,
      occupiedBeds: 0,
      vacantBeds: 2,
    },
    {
      _id: "seed_2",
      roomNumber: "B-205",
      block: "Block B (Girls)",
      category: "Single Scholar",
      pricePerSemester: 75000,
      capacity: 1,
      occupiedBeds: 0,
      vacantBeds: 1,
    },
    {
      _id: "seed_3",
      roomNumber: "C-301",
      block: "Block C (Scholars)",
      category: "Double Sharing",
      pricePerSemester: 60000,
      capacity: 2,
      occupiedBeds: 1,
      vacantBeds: 1,
    },
  ];

  // 4. Fetch Featured Rooms from API
  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("/api/rooms?limit=3")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load rooms.");
        }
        return response.json();
      })
      .then((data) => {
        // Adapt to API structure: either array or { data: [...] }
        const list = Array.isArray(data) ? data : data.data || data.rooms || [];
        if (list.length > 0) {
          setRooms(list.slice(0, 3));
        } else {
          setRooms(fallbackRooms);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Unable to load rooms.");
        setRooms(fallbackRooms);
        setLoading(false);
      });
  }, []);

  // 5. Handle Search Button Click
  const handleCheckRooms = () => {
    let queryParams = [];
    if (block && block !== "All") queryParams.push(`block=${encodeURIComponent(block)}`);
    if (sharing && sharing !== "All") queryParams.push(`sharing=${encodeURIComponent(sharing)}`);
    if (search.trim()) queryParams.push(`search=${encodeURIComponent(search.trim())}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    if (onNavigate) {
      onNavigate(`/rooms${queryString}`);
    }
  };

  return (
    <div className="home-page-container">
      {/* ====================================================================
          1. Hero Section
          ==================================================================== */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-pill-badge">🎓 Fall Semester 2026 Allocations Open</span>
          <h1 className="hero-title">
            Smart Campus Living & <br />
            <span className="gradient-text">Modern Hostel Accommodation</span>
          </h1>
          <p className="hero-subtitle">
            Enjoy high-speed Gigabit Wi-Fi, hygienic 4-meal dining, biometric security,
            and dedicated quiet study floors designed for university students.
          </p>

          <div className="hero-actions-row">
            <button
              type="button"
              className="btn-primary-action"
              onClick={() => onNavigate && onNavigate("/rooms")}
            >
              Explore Dorms
            </button>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={() => onNavigate && onNavigate("/rooms")}
            >
              Apply for Bed
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. Search & Vacancy Filter Bar
          ==================================================================== */}
      <section className="search-section">
        <div className="search-card-container">
          <div className="search-form-grid">
            {/* Filter 1: Block */}
            <div className="search-field">
              <label htmlFor="block-select">Hostel Block</label>
              <select
                id="block-select"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="search-select"
              >
                <option value="">All Blocks</option>
                <option value="Block A (Boys)">Block A (Boys)</option>
                <option value="Block B (Girls)">Block B (Girls)</option>
                <option value="Block C (Scholars)">Block C (Scholars)</option>
              </select>
            </div>

            {/* Filter 2: Sharing Type */}
            <div className="search-field">
              <label htmlFor="sharing-select">Sharing Type</label>
              <select
                id="sharing-select"
                value={sharing}
                onChange={(e) => setSharing(e.target.value)}
                className="search-select"
              >
                <option value="">All Sharing Types</option>
                <option value="Single Scholar">Single Scholar</option>
                <option value="Double Sharing">Double Sharing</option>
                <option value="Triple Sharing">Triple Sharing</option>
                <option value="Quad Sharing">Quad Sharing</option>
              </select>
            </div>

            {/* Filter 3: Search Query */}
            <div className="search-field search-text-field">
              <label htmlFor="search-input">Room Number</label>
              <input
                id="search-input"
                type="text"
                placeholder="Search room number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-text-input"
              />
            </div>

            {/* Submit Button */}
            <div className="search-action-field">
              <button
                type="button"
                className="btn-search-submit"
                onClick={handleCheckRooms}
              >
                🔍 Check Bed Vacancy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. Campus Features Section (6 Cards)
          ==================================================================== */}
      <section className="features-section">
        <div className="section-header-centered">
          <span className="section-badge">CAMPUS AMENITIES</span>
          <h2>Everything You Need for Academic Success</h2>
          <p>Built from the ground up for comfort, privacy, safety, and focused studying.</p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon-box">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          4. Featured Dormitories Section
          ==================================================================== */}
      <section className="featured-rooms-section">
        <div className="section-header-flex">
          <div>
            <span className="section-badge">HOSTEL WINGS</span>
            <h2>Featured Dormitory Rooms</h2>
            <p>Spacious, fully-furnished dorms with biometric security and high-speed Wi-Fi.</p>
          </div>
          <button
            type="button"
            className="btn-view-all-link"
            onClick={() => onNavigate && onNavigate("/rooms")}
          >
            View All Dorms →
          </button>
        </div>

        {/* Loading State */}
        {loading && <p className="status-notice">Loading rooms...</p>}

        {/* Error State */}
        {error && <p className="alert alert-error">{error}</p>}

        {/* Rooms Grid */}
        {!loading && (
          <div className="rooms-grid">
            {rooms.map((room) => {
              // Calculate vacant beds safely
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
                      {vacant > 0 ? `${vacant} Beds Available` : "Fully Occupied"}
                    </span>
                  </div>

                  <h3 className="room-title">Room {room.roomNumber}</h3>
                  <p className="room-category-text">{room.category || room.sharingCategory || "Double Sharing"}</p>

                  <div className="room-price-box">
                    <span className="room-currency">₹{Number(room.pricePerSemester).toLocaleString()}</span>
                    <span className="room-per-sem"> / Semester</span>
                  </div>

                  <button
                    type="button"
                    className="btn-apply-card"
                    onClick={() => onNavigate && onNavigate("/rooms")}
                  >
                    Explore & Apply →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ====================================================================
          5. Student Testimonials Section
          ==================================================================== */}
      <section className="testimonials-section">
        <div className="section-header-centered">
          <span className="section-badge">STUDENT LIFE</span>
          <h2>Resident Experiences</h2>
          <p>Read what university scholars and undergraduate students say about life at XSHostel.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <div className="quote-mark">“</div>
              <p className="testimonial-quote">{t.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          6. Frequently Asked Questions (FAQ Section)
          ==================================================================== */}
      <section className="faq-section">
        <div className="section-header-centered">
          <span className="section-badge">CAMPUS POLICIES</span>
          <h2>Frequently Asked Questions</h2>
          <p>Essential policies, dining plans, and curfew regulations for hostel residents.</p>
        </div>

        <div className="faq-container">
          <details className="faq-item" open>
            <summary className="faq-question">What is the hostel curfew?</summary>
            <p className="faq-answer">
              The standard campus curfew is 10:00 PM. Gate turnstiles lock automatically.
              Late passes must be applied for through the student portal in advance.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">What meals are provided?</summary>
            <p className="faq-answer">
              The standard mess plan provides four meals per day: hearty breakfast, wholesome lunch,
              evening tea with snacks, and dinner with vegetarian and non-vegetarian options.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">Is biometric security available?</summary>
            <p className="faq-answer">
              Yes, the hostel uses biometric access and security monitoring across all wing entries,
              elevators, and main entrance turnstiles.
            </p>
          </details>

          <details className="faq-item">
            <summary className="faq-question">What is the refundable caution deposit?</summary>
            <p className="faq-answer">
              A standard refundable institutional caution deposit of ₹5,000 is collected upon initial room
              allotment and returned during room vacating clearance.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}

export default Home;
