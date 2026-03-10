import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CategoryPage() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  // Fetch all categories
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/doctor-categories")
      .then((res) => {
        setCategories(res.data);

        // Set default selected category
        const initialCategory =
          location.state?.selectedCategory ||
          res.data[0]; // default to first category if state not provided
        setSelectedCategory(initialCategory);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [location.state]);

  // Fetch doctors for selected category
  useEffect(() => {
    if (!selectedCategory) return;

    axios
      .get(`http://127.0.0.1:5000/api/doctors?category_id=${selectedCategory.id}`)
      .then((res) => setDoctors(res.data || []))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, [selectedCategory]);

  return (
    <div>
      <Header />

      <div className="flex mt-20 px-4 gap-8 overflow-visible">
  {/* Sidebar */}
  <div className="w-1/4 pr-2 overflow-visible">
    <Command className="overflow-visible">
      <CommandInput placeholder="Search categories..." className="mb-2" />
      <CommandList className="overflow-visible">
        <CommandEmpty>No categories found.</CommandEmpty>
        <CommandGroup heading="Categories">
          {categories.map((cat) => (
            <CommandItem
              key={cat.id}
              onSelect={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition ${
                selectedCategory?.id === cat.id
                  ? "bg-blue-100 font-semibold"
                  : "hover:bg-blue-50"
              }`}
            >
              <img
                src={`http://127.0.0.1:5000/static/${cat.image}`}
                alt={cat.name}
                className="w-8 h-8 object-contain"
              />
              <span>{cat.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </div>

  {/* Right content */}
  <div className="w-3/4 overflow-visible">
    {selectedCategory ? (
      <>
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          {selectedCategory.name}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-visible">
          {doctors.length === 0 ? (
            <p>No doctors found in this category.</p>
          ) : (
            doctors.map((doc) => (
              <div
                      key={doc.id}
                      className="bg-white border rounded-lg shadow flex flex-col h-full hover:shadow-md transition cursor-pointer overflow-visible"
                      onClick={() => navigate(`/book-appointment/doctor/${doc.id}`)}                   >
                {/* Image container */}
                
                <div className="w-full aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src={`http://127.0.0.1:5000/static/${doc.image}`}
                    alt={doc.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Doctor info */}
                <div className="p-4 flex flex-col flex-1 justify-between overflow-visible">
                  <div>
                    <h3 className="font-semibold text-lg">{doc.name}</h3>
                    <p className="text-sm">
                      <strong>Experience:</strong> {doc.years_of_experience} yrs
                    </p>
                    <p className="text-sm">
                      <strong>Address:</strong> {doc.address}
                    </p>
                  </div>
                  <button
                    className="mt-3 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    ) : (
      <p className="text-gray-500">Select a category to see doctors.</p>
    )}
  </div>
</div>
</div>

  );
}

export default CategoryPage;
