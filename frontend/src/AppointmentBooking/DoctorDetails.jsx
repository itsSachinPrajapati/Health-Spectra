import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import BookAppointment from "./BookAppointment";
import axios from "axios";
import {
  MapPin,
  Award,
  Clock,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Users,
} from "lucide-react";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch main doctor
    axios
      .get(`http://127.0.0.1:5000/api/doctor/${id}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => console.error(err));

    // Fetch suggested doctors
    axios
      .get("http://127.0.0.1:5000/api/doctors")
      .then((res) => {
        const filtered = res.data
          .filter((d) => d.id !== parseInt(id))
          .slice(0, 6);
        setSuggestions(filtered);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!doctor) return null;

  const handleSocialClick = (platform) => {
    alert(`Opening ${platform} profile for ${doctor.name}`);
  };

  const handleSuggestionClick = (docId) => {
    navigate(`/book-appointment/doctor/${docId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex pt-20 px-4 max-w-[1200px] mx-auto gap-6">
        {/* Left: Main Doctor 70% */}
        <div className="w-[70%]">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Details</h2>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Image */}
              <div className="lg:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex justify-center items-center p-4">
                <img
                  src={`http://127.0.0.1:5000/static/${doctor.image}`}
                  alt={doctor.name}
                  className="h-full w-full object-contain rounded-2xl"
                />
              </div>

              {/* Info */}
              <div className="lg:w-2/3 flex flex-col gap-3">
                <h1 className="text-3xl font-bold text-gray-800">
                  {doctor.name}
                </h1>

                <div className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <Award className="w-4 h-4" />
                    <span>{doctor.years_of_experience} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <Users className="w-4 h-4" />
                    <span>{doctor.patients || 0}+ Patients</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-700 mb-1">
                      Specialization
                    </h3>
                    <p className="text-blue-600 font-semibold">{doctor.category}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-700 mb-1">
                      Contact
                    </h3>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{doctor.phone}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" /> Address
                    </h3>
                    <p className="text-gray-700 text-sm">{doctor.address}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" /> Availability
                    </h3>
                    <p className="text-green-700 font-semibold text-sm">
                    {doctor.queue_start_time && doctor.queue_end_time && (
                      <>Queue: {doctor.queue_start_time} - {doctor.queue_end_time}</>
                    )}

                    {doctor.slot_start_time && doctor.slot_end_time && (
                      <>
                        {doctor.queue_start_time ? " | " : ""}
                        Slots: {doctor.slot_start_time} - {doctor.slot_end_time}
                      </>
                    )}

                    {!doctor.queue_start_time && !doctor.slot_start_time && "N/A"}
                  </p>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="flex gap-2 mt-4">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSocialClick(Icon.name)}
                      className="bg-blue-600 p-2 rounded-full text-white hover:scale-110 transition-transform"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                {/* Main Book Button */}
                <div className="mt-4">
                  <BookAppointment
                    doctorName={doctor.name}
                    triggerClassName="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Suggested Doctors 30% */}
        <div className="w-[30%]">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Suggested Doctors</h2>
          <div className="space-y-4">
            {suggestions.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleSuggestionClick(doc.id)}
                className="cursor-pointer bg-white p-3 rounded-xl shadow flex items-center gap-3 hover:bg-gray-100 transition"
              >
                <img
                  src={`http://127.0.0.1:5000/static/${doc.image}`}
                  alt={doc.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div className="flex flex-col w-full">
                  <h3 className="font-semibold text-gray-800 text-sm">{doc.name}</h3>
                  <p className="text-xs text-gray-500">{doc.category}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      navigate(`/book-appointment/doctor/${doc.id}`);
                    }}
                    className="mt-1 border-2 hover:bg-blue-600 hover:text-white px-2 py-1 rounded-xl text-xs transition-colors"
                  >
                    Book
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
