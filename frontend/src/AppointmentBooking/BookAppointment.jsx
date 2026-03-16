import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import axios from "axios";

function BookAppointment() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({});
  const [loadingDoctor, setLoadingDoctor] = useState(false);

  const [date, setDate] = useState(null);
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);

  // Generate slots
  const generateSlots = (start, end, duration) => {
    const list = [];

    let current = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    while (current < endTime) {
      list.push(
        current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      current = new Date(current.getTime() + duration * 60000);
    }

    return list;
  };

  useEffect(() => {
    if (!id) return;

    setLoadingDoctor(true);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/${id}`)
      .then((res) => {
        const d = res.data;

        setDoctor(d);

        if (d.slot_start_time && d.slot_end_time) {
          const generated = generateSlots(
            d.slot_start_time,
            d.slot_end_time,
            d.slot_duration
          );
          setSlots(generated);
        }
      })
      .catch(() => setDoctor({ id, name: "Unknown Doctor" }))
      .finally(() => setLoadingDoctor(false));
  }, [id]);

  const disablePastDates = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  };

  const isFormValid = date && issue.trim().length > 0;

  const handleSubmit = async () => {
    if (!user) {
      setMessage("Please login to book appointment");
      setSuccess(false);
      setShowMessageBox(true);
      return;
    }

    if (!isFormValid) {
      setMessage("Please fill all fields before submitting");
      setSuccess(false);
      setShowMessageBox(true);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        doctor_id: doctor.id,
        patient_name: user.fullName,
        patient_email: user.primaryEmailAddress.emailAddress,
        appointment_date: date.toISOString().split("T")[0],
        time_slot: selectedSlot || null,
        issue: issue.trim(),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/booking`,
        payload
      );

      if (res.data.success) {
        if (selectedSlot) {
          setMessage(`Appointment booked for ${selectedSlot}`);
        } else {
          setMessage(
            `Appointment booked successfully. Your queue number is ${res.data.queue_number}`
          );
        }

        setSuccess(true);
      } else {
        setMessage(res.data.message || "Booking failed");
        setSuccess(false);
      }

      setShowMessageBox(true);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error booking appointment");
      setSuccess(false);
      setShowMessageBox(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMessageBox = () => {
    setShowMessageBox(false);
    if (success) navigate("/book-appointment");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={loadingDoctor}>
          {loadingDoctor ? "Loading..." : "Book Appointment"}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <div className="flex flex-col gap-4 mt-4">

            {/* Calendar */}
            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <span>Select Date</span>
              </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={disablePastDates}
                className="rounded-lg border p-2"
              />
            </div>

            {/* Fixed Slots */}
            {slots.length > 0 && (
              <div className="border rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>Consultation Slots</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-full text-sm border ${
                        selectedSlot === slot
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Issue */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Describe your issue
              </label>

              <textarea
                className="w-full border rounded-lg p-2 resize-none"
                rows={3}
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe your issue..."
              />
            </div>

          </div>
        </DialogDescription>

        <DialogFooter className="flex flex-col gap-3 mt-4">

          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button
              disabled={!isFormValid || loading}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isFormValid
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </Button>
          </div>

          {showMessageBox && (
            <div
              className={`w-full border-l-4 p-3 rounded shadow-md flex justify-between items-center ${
                success
                  ? "bg-green-50 border-green-500 text-green-800"
                  : "bg-red-50 border-red-500 text-red-800"
              }`}
            >
              <span>{message}</span>

              <Button
                onClick={handleCloseMessageBox}
                className={`ml-4 px-3 py-1 font-semibold rounded ${
                  success ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                Close
              </Button>
            </div>
          )}

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BookAppointment;