import { Route } from "react-router-dom";
import Staff from "../pages/Staff";

import ProtectedRoute from "../components/ProtectedRoute";
import ManageHistory from "../components/dashboard/ManageHistory";

export const staffRoutes = (
  <>
    <Route
      path="/staff"
      element={
        <ProtectedRoute allowedRoles={["STAFF"]}>
          <Staff />
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

    {/* <Route
      path="/staff/book"
      element={
        <ProtectedRoute allowedRoles={["STAFF"]}>
          <BookTicket />
        </ProtectedRoute>
      }
    />*/}
  </>
);