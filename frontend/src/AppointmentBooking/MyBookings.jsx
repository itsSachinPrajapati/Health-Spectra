import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MapPin, Stethoscope, Calendar, Clock, Trash2 } from "lucide-react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = "sachinprajapati2622@gmail.com"; // replace dynamically

    axios
      .get(`http://127.0.0.1:5000/api/bookings?email=${email}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.delete(`http://127.0.0.1:5000/api/booking/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  const renderBookingCard = (booking) => (
    <div
      key={booking.id}
      className="flex flex-col md:flex-row items-center md:items-start justify-between bg-white p-5 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-5">
        <img
          src={booking.image || "/default-doctor.png"}
          alt={booking.doctor_name}
          className="w-24 h-24 rounded-full object-cover border border-gray-200"
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
            <Stethoscope className="w-5 h-5 text-blue-500" />
            {booking.doctor_name}
          </div>

          {/* Status Badge */}
          <div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                booking.status === "expired"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {booking.status?.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-red-500" />
            {booking.doctor_address}
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-green-500" />
            {booking.appointment_date}
            <Clock className="w-4 h-4 text-purple-500 ml-2" />
            {booking.time_slot}
          </div>
        </div>
      </div>

      {/* Cancel only if upcoming */}
      {booking.status === "upcoming" && (
        <div className="mt-3 md:mt-0">
          <Button
            variant="destructive"
            className="flex items-center gap-2 px-4 py-2"
            onClick={() => handleCancel(booking.id)}
          >
            <Trash2 className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "upcoming"
  );

  const expiredBookings = bookings.filter(
    (booking) => booking.status === "expired"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto mt-20 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          My Bookings
        </h1>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="border-b border-gray-300 mb-4">
            <TabsTrigger value="upcoming" className="px-4 py-2 font-medium">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="expired" className="px-4 py-2 font-medium">
              Expired
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Tab */}
          <TabsContent value="upcoming">
            {loading ? (
              <p className="text-gray-500">Loading bookings...</p>
            ) : upcomingBookings.length === 0 ? (
              <p className="text-gray-500">No upcoming bookings</p>
            ) : (
              upcomingBookings.map(renderBookingCard)
            )}
          </TabsContent>

          {/* Expired Tab */}
          <TabsContent value="expired">
            {loading ? (
              <p className="text-gray-500">Loading bookings...</p>
            ) : expiredBookings.length === 0 ? (
              <p className="text-gray-500">No expired bookings</p>
            ) : (
              expiredBookings.map(renderBookingCard)
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default MyBookings;
