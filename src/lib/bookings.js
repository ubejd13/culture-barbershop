import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const BOOKINGS_COLLECTION = "bookings";

export async function createBooking({ phone, isGroup, people }) {
  if (!db) {
    throw new Error("Firebase is not configured yet.");
  }

  const booking = {
    phone,
    isGroup,
    people,
    groupSize: people.length,
    createdAt: serverTimestamp(),
    createdAtClient: new Date().toISOString(),
  };

  const bookingRef = await addDoc(collection(db, BOOKINGS_COLLECTION), booking);

  return {
    ...booking,
    id: bookingRef.id,
    createdAt: booking.createdAtClient,
  };
}

export function subscribeToBookings(onChange, onError) {
  if (!db) return () => {};

  const bookingsQuery = query(
    collection(db, BOOKINGS_COLLECTION),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    bookingsQuery,
    (snapshot) => {
      const bookings = snapshot.docs.map((bookingDoc) => {
        const data = bookingDoc.data();

        return {
          id: bookingDoc.id,
          ...data,
          createdAt:
            data.createdAt?.toDate?.().toISOString() ??
            data.createdAtClient ??
            "",
        };
      });

      onChange(bookings);
    },
    onError,
  );
}
