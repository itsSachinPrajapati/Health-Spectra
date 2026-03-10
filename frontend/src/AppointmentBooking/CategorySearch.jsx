import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CategorySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/doctor-categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Optional: implement search functionality later
  };

  const handleCategoryClick = (cat) => {
    // Redirect to /book-appointment/category with selected category state
    navigate("/book-appointment/category", { state: { selectedCategory: cat } });
  };

  return (
    <div className="max-w-4xl mx-auto mt-28 px-5 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
        Find Your Perfect Doctor
      </h1>

      <p className="text-lg md:text-xl text-gray-700 mb-8">
        Search for top specialists near you and book your appointment instantly.
        <br />
        Get professional advice and care at your fingertips.
      </p>

      <form
        onSubmit={handleSearch}
        className="flex justify-center items-center mb-10"
      >
        <input
          type="text"
          placeholder="Search by doctor name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-2/3 border-2 border-blue-200 rounded-l-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-r-full hover:bg-blue-700 transition"
        >
          🔍
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-3xl mx-auto">
        {categories.slice(0, 6).map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer 
                       transform transition duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => handleCategoryClick(cat)}
          >
            <img
              src={`http://127.0.0.1:5000/static/${cat.image}`}
              alt={cat.name}
              className="w-12 h-12 object-contain mb-2"
            />
            <span className="text-xs font-medium text-center">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySearch;
