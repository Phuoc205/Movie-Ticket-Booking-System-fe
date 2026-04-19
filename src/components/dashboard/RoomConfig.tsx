import { useEffect, useState } from "react";
import api from "../../services/api";

export default function RoomConfig() {
  const [rooms, setRooms] = useState<any[]>([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    totalSeats: "",
    seatsPerRow: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= FETCH ROOMS =================
  const fetchRooms = async () => {
    const res = await api.get("/rooms");
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    if (!form.name || !form.totalSeats || !form.seatsPerRow) {
      alert("Nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        total_seats: Number(form.totalSeats),
        seats_per_row: Number(form.seatsPerRow),
      };

      if (form.id) {
        // UPDATE
        await api.patch(`/rooms/${form.id}`, payload);
        alert("Cập nhật phòng thành công");
      } else {
        // CREATE
        await api.post("/rooms", payload);
        alert("Tạo phòng thành công");
      }

      resetForm();
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Lỗi!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      totalSeats: "",
      seatsPerRow: "",
    });
  };

  // ================= EDIT =================
  const handleEdit = (room: any) => {
    setForm({
      id: room.id,
      name: room.name,
      totalSeats: room.total_seats,
      seatsPerRow: room.seats_per_row,
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Xóa phòng này?")) return;

    await api.delete(`/rooms/${id}`);
    fetchRooms();
  };

  return (
    <div className="p-6 text-white">
      {/* ================= FORM ================= */}
      <div className="card-container mb-10">
        <h2 className="text-2xl font-bold mb-6">
          {form.id ? "Chỉnh sửa phòng" : "Tạo phòng"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Tên phòng"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="input-field"
          />

          <input
            placeholder="Tổng ghế"
            type="number"
            value={form.totalSeats}
            onChange={(e) =>
              setForm({ ...form, totalSeats: e.target.value })
            }
            className="input-field"
          />

          <input
            placeholder="Ghế / hàng"
            type="number"
            value={form.seatsPerRow}
            onChange={(e) =>
              setForm({ ...form, seatsPerRow: e.target.value })
            }
            className="input-field"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading
              ? "Đang xử lý..."
              : form.id
              ? "Cập nhật"
              : "Tạo phòng"}
          </button>

          {form.id && (
            <button onClick={resetForm} className="btn-secondary">
              Hủy
            </button>
          )}
        </div>
      </div>

      {/* ================= ROOM LIST ================= */}
      <div className="card-container">
        <h2 className="text-2xl font-bold mb-6">
          Danh sách phòng
        </h2>

        {rooms.length === 0 ? (
          <p className="text-gray-400">Chưa có phòng</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-4 bg-black/30 rounded-xl border border-white/10"
              >
                <h3 className="text-xl font-bold">
                  {room.name}
                </h3>

                <p className="text-gray-400 text-sm">
                  {room.total_seats} ghế -{" "}
                  {room.seats_per_row} ghế / hàng
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(room)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(room.id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}