import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { publicRoutes } from "./routes/public.routes";
import { userRoutes } from "./routes/user.routes";
import { adminRoutes } from "./routes/admin.routes";
import { staffRoutes } from "./routes/staff.routes";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Toaster />

        <div className="pt-[72px]">
          <Routes>
            {publicRoutes}
            {userRoutes}
            {adminRoutes}
            {staffRoutes}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;