export interface Showtime {
  id: string;
  start_time: string;
  end_time: string;

  room?: {
    id: string;
    name: string;
  };

  room_id?: string;
}