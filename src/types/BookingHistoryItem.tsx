export interface BookingHistoryItem {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  showtime?: {
    start_time: string;
    movie: { title: string };
    room: { name: string };
  };
  booking_seats?: {
    seat: { seat_number: string };
  }[];
}