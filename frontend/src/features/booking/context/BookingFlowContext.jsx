import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { INSURANCE_FEE_INR } from '../constants';

const BookingFlowContext = createContext(null);

const initialPassenger = () => ({
  fullName: '',
  age: '',
  gender: '',
  idType: 'aadhaar',
  idNumber: '',
  email: '',
  phone: '',
});

export function BookingFlowProvider({ children }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [searchTab, setSearchTab] = useState('flights');
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [cabinClass, setCabinClass] = useState('ECONOMY');
  const [flights, setFlights] = useState([]);
  const [flightsMeta, setFlightsMeta] = useState({ source: null, warning: null });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [expandedFlightId, setExpandedFlightId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([initialPassenger()]);
  const [insurance, setInsurance] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [hotelCity, setHotelCity] = useState('Mumbai');
  const [hotels, setHotels] = useState([]);
  const [cabFrom, setCabFrom] = useState('');
  const [cabTo, setCabTo] = useState('');
  const [cabEstimate, setCabEstimate] = useState(null);
  const [searchingFlights, setSearchingFlights] = useState(false);

  const syncPassengers = useCallback((count) => {
    setPassengers((prev) => {
      const next = [...prev];
      while (next.length < count) next.push(initialPassenger());
      if (next.length > count) next.length = count;
      return next;
    });
  }, []);

  const setPassengerCountSafe = useCallback(
    (n) => {
      const c = Math.min(9, Math.max(1, n));
      setPassengerCount(c);
      syncPassengers(c);
    },
    [syncPassengers]
  );

  const baseFare = selectedFlight?.priceTotal || 0;
  const seatFeePer = 199;
  const seatsFee = selectedSeats.length * seatFeePer;
  const insuranceFee = insurance ? INSURANCE_FEE_INR : 0;
  const taxesAndFees = Math.round(baseFare * 0.12) + 389;
  const grandTotal = Math.round(baseFare + seatsFee + taxesAndFees + insuranceFee);

  const resetFlow = useCallback(() => {
    setStepIndex(0);
    setFlights([]);
    setFlightsMeta({ source: null, warning: null });
    setSelectedFlight(null);
    setExpandedFlightId(null);
    setSelectedSeats([]);
    setPassengers([initialPassenger()]);
    setInsurance(false);
    setBookingId('');
  }, []);

  const goStep = useCallback((idx) => {
    setStepIndex(Math.max(0, Math.min(5, idx)));
  }, []);

  const flightContextForAi = useMemo(() => {
    if (!selectedFlight) return null;
    return {
      route: `${selectedFlight.departure?.iataCode} → ${selectedFlight.arrival?.iataCode}`,
      airline: selectedFlight.airlineName,
      flightNumber: selectedFlight.flightNumber,
      depart: selectedFlight.departure?.at,
      arrive: selectedFlight.arrival?.at,
      priceINR: selectedFlight.priceTotal,
      seats: selectedSeats,
      passengers: passengerCount,
    };
  }, [selectedFlight, selectedSeats, passengerCount]);

  const value = useMemo(
    () => ({
      stepIndex,
      setStepIndex: goStep,
      searchTab,
      setSearchTab,
      tripType,
      setTripType,
      from,
      setFrom,
      to,
      setTo,
      departDate,
      setDepartDate,
      returnDate,
      setReturnDate,
      passengerCount,
      setPassengerCount: setPassengerCountSafe,
      cabinClass,
      setCabinClass,
      flights,
      setFlights,
      flightsMeta,
      setFlightsMeta,
      selectedFlight,
      setSelectedFlight,
      expandedFlightId,
      setExpandedFlightId,
      selectedSeats,
      setSelectedSeats,
      passengers,
      setPassengers,
      insurance,
      setInsurance,
      bookingId,
      setBookingId,
      hotelCity,
      setHotelCity,
      hotels,
      setHotels,
      cabFrom,
      setCabFrom,
      cabTo,
      setCabTo,
      cabEstimate,
      setCabEstimate,
      searchingFlights,
      setSearchingFlights,
      baseFare,
      seatsFee,
      taxesAndFees,
      insuranceFee,
      grandTotal,
      resetFlow,
      flightContextForAi,
    }),
    [
      stepIndex,
      goStep,
      searchTab,
      tripType,
      from,
      to,
      departDate,
      returnDate,
      passengerCount,
      setPassengerCountSafe,
      cabinClass,
      flights,
      flightsMeta,
      selectedFlight,
      expandedFlightId,
      selectedSeats,
      passengers,
      insurance,
      bookingId,
      hotelCity,
      hotels,
      cabFrom,
      cabTo,
      cabEstimate,
      searchingFlights,
      baseFare,
      seatsFee,
      taxesAndFees,
      insuranceFee,
      grandTotal,
      resetFlow,
      flightContextForAi,
    ]
  );

  return <BookingFlowContext.Provider value={value}>{children}</BookingFlowContext.Provider>;
}

export function useBookingFlow() {
  const ctx = useContext(BookingFlowContext);
  if (!ctx) throw new Error('useBookingFlow must be used within BookingFlowProvider');
  return ctx;
}
