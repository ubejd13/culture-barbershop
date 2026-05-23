import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const BARBERS_COLLECTION = "barbers";

export const DEFAULT_BARBER_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&q=80&fit=crop&crop=face";

const fallbackBarbers = [
  {
    id: "dritan-ambari",
    name: "Dritan Ambari",
    role: "Master Barber",
    img: DEFAULT_BARBER_IMAGE,
  },
  {
    id: "erdi-tairi",
    name: "Erdi Tairi",
    role: "Barber",
    img: DEFAULT_BARBER_IMAGE,
  },
  {
    id: "berat-doci",
    name: "Berat Doçi",
    role: "Barber",
    img: DEFAULT_BARBER_IMAGE,
  },
  {
    id: "musab-qaili",
    name: "Musab Qaili",
    role: "Barber",
    img: DEFAULT_BARBER_IMAGE,
  },
];

function normalizeBarber(barberDoc) {
  const data = barberDoc.data();

  return {
    id: barberDoc.id,
    name: data.name?.trim() || "",
    role: data.role?.trim() || "Barber",
    img: data.img?.trim() || DEFAULT_BARBER_IMAGE,
  };
}

export function subscribeToBarbers(onChange, onError) {
  if (!db) {
    onChange(fallbackBarbers);
    return () => {};
  }

  const barbersQuery = query(
    collection(db, BARBERS_COLLECTION),
    orderBy("name", "asc"),
  );

  return onSnapshot(
    barbersQuery,
    (snapshot) => {
      const barbers = snapshot.docs
        .map(normalizeBarber)
        .filter((barber) => barber.name);

      onChange(barbers);
    },
    onError,
  );
}

export async function createBarber({ name, role, img }) {
  if (!db) {
    throw new Error("Firebase is not configured yet.");
  }

  if (!name.trim()) {
    throw new Error("Barber name is required.");
  }

  const nextBarber = {
    name: name.trim(),
    role: role?.trim() || "Barber",
    img: img?.trim() || DEFAULT_BARBER_IMAGE,
    createdAt: serverTimestamp(),
  };

  return addDoc(collection(db, BARBERS_COLLECTION), nextBarber);
}

export async function removeBarber(id) {
  if (!db) {
    throw new Error("Firebase is not configured yet.");
  }

  return deleteDoc(doc(db, BARBERS_COLLECTION, id));
}
