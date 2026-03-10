import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import ViewReport from "./ViewReport.jsx";
import { useUser } from "@clerk/clerk-react";

export default function HistoryTable({ consultations = [] }) {
  const { user } = useUser();

  return (
    <Table>
      <TableCaption>Your recent consultations.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Sr.No</TableHead>
          <TableHead>Patient / Name</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-500">
              No consultations found
            </TableCell>
          </TableRow>
        ) : (
          consultations.map((c, index) => (
            <TableRow key={c.session_id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{user?.firstName || "User"}</TableCell>
            <TableCell>{c.selected_doctor}</TableCell>
            <TableCell>{new Date(c.created_on).toLocaleString()}</TableCell>
            <TableCell>{c.notes || "-"}</TableCell>
            <TableCell className="text-center">
              <ViewReport consultation={c} />
            </TableCell>
          </TableRow>

          ))
        )}
      </TableBody>
    </Table>
  );
}
