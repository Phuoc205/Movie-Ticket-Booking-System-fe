export default function SeatSection({
  seats,
  selectedSeats,
  onToggle,
  isLoading,
  seatsPerRow = 10, // fallback
}: any) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  const sortedSeats = [...seats].sort((a, b) => {
    const rowA = a.seat_number[0];
    const rowB = b.seat_number[0];

    if (rowA !== rowB) {
      return rowA.localeCompare(rowB);
    }

    const numA = parseInt(a.seat_number.slice(1));
    const numB = parseInt(b.seat_number.slice(1));

    return numA - numB;
  });

  return (
    <div className="card-container mt-8 relative overflow-hidden">
      
      {/* TITLE */}
      <h3 className="text-2xl font-bold mb-10 text-center drop-shadow-md">
        Sơ đồ ghế
      </h3>

      {/* SCREEN */}
      <div className="cinema-screen">
        <span className="text-[var(--accent-blue)] text-sm font-bold uppercase tracking-[0.5em]">
          Màn Hình
        </span>
      </div>

      {/* GRID */}
      <div className="flex justify-center flex-col items-center gap-6 mt-10">
        <div
          className="grid gap-3 md:gap-4 p-4 md:p-8 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm"
          style={{
            gridTemplateColumns: `repeat(${seatsPerRow}, minmax(0, 1fr))`,
          }}
        >
          
          {sortedSeats.map((seat: any) => {
            const isSelected = selectedSeats.some(
              (s) => s.id === seat.id
            );

            let seatClass = "seat ";
            if (seat.is_booked) seatClass += "seat-booked";
            else if (isSelected) seatClass += "seat-selected";
            else seatClass += "seat-available";

            return (
              <button
                key={seat.id}
                disabled={seat.is_booked}
                onClick={() => onToggle(seat)}
                className={seatClass}
                title={`Ghế ${seat.seat_number} ${
                  seat.is_booked ? "(Đã đặt)" : ""
                }`}
              >
                {seat.seat_number}
              </button>
            );
          })}
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center flex-wrap gap-8 mt-8 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="seat seat-available w-6 h-6 text-[0px]"></div>
          <span className="text-gray-300">Còn trống</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="seat seat-selected w-6 h-6 text-[0px]"></div>
          <span className="text-gray-300">Đang chọn</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="seat seat-booked w-6 h-6 text-[0px]"></div>
          <span className="text-gray-400">Đã đặt</span>
        </div>
      </div>

      {/* SELECTED SEATS */}
      {selectedSeats.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            Ghế đã chọn
          </p>

          <div className="flex justify-center flex-wrap gap-2">
            {selectedSeats.map((s: any) => (
              <span
                key={s.id}
                className="bg-[var(--accent-glow)] text-white px-3 py-1 rounded-md text-sm font-bold"
              >
                {s.seat_number}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}