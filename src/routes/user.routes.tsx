import { Route } from "react-router-dom";
import Payment from "../pages/Payment";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import History from "../pages/History";

export const userRoutes = (
  <>

    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />

    <Route
      path="/book-ticket/payment"
      element={
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      }
    />

    <Route
      path="/bookings/history"
      element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      }
    />
  </>
);