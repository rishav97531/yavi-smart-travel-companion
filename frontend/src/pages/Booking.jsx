import { BookingFlowProvider } from '../features/booking/context/BookingFlowContext';
import BookingExperience from '../features/booking/BookingExperience';

export default function Booking() {
  return (
    <BookingFlowProvider>
      <BookingExperience />
    </BookingFlowProvider>
  );
}
