// src/firebaseEvents.js
import db from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// salvar evento
export async function saveEvent(date, event) {
  try {
    await addDoc(collection(db, "eventos"), {
      date,
      ...event
    });
    console.log("Evento salvo com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar evento: ", e);
  }
}

// buscar eventos por data
export async function getEventsByDate(date) {
  const q = query(collection(db, "eventos"), where("date", "==", date));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
}
