import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const useBooking = () => {
  const [loading, setLoading] = useState(false);

  const book = async (payload: any) => {
    setLoading(true);
    try {
      const res = await api.post("/bookings", payload);
      return res.data;
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Lỗi booking");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { book, loading };
};