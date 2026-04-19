import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import RoomConfig from "../components/dashboard/RoomConfig";
import ManageMovies from "../components/dashboard/ManageMovies";
import ManageShowtimes from "../components/dashboard/ManageShowtimes";
import ManageBookingTickets from "../components/dashboard/ManageBookingTickets";
import ManageVouchers from "../components/dashboard/ManageVouchers";
import ReportPage from "../pages/Report";
import ManageHistory from "../components/dashboard/ManageHistory";

import ProtectedRoute from "../components/ProtectedRoute";

export const adminRoutes = (
  <>
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/movies"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ManageMovies />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/rooms"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <RoomConfig />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/showtimes"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ManageShowtimes />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/reports"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ReportPage />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/vouchers"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ManageVouchers />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/booking-ticket"
      element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ManageBookingTickets />
        </ProtectedRoute>
      }
    />

    <Route
      path="/all-history"
      element={
        <ProtectedRoute>
          <ManageHistory />
        </ProtectedRoute>
      }
    />
  </>
);