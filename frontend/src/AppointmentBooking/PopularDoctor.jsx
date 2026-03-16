import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PopularDoctor() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/doctors`)
      .then((res) => setDoctors(res.data.slice(0, 8))) // 8 doctors only
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">Our Top Doctors</h2>
        <p className="text-lg font-semibold">
          Book appointments with experienced specialists
        </p>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-4 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/static/${doc.image}`}
              alt={doc.name}
              className="w-full h-44 object-cover object-top rounded-md mb-4"
            />

            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-1">{doc.name}</h3>

              <p className="text-sm mb-1">
                <strong>Experience:</strong> {doc.years_of_experience} yrs
              </p>

              <p className="text-sm">
                <strong>Address:</strong> {doc.address}
              </p>
            </div>

            <button
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => navigate(`/book-appointment/doctor/${doc.id}`)}
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularDoctor;