// Calendário Compartilhado com Firebase e layout responsivo
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ date: "", title: "", owner: "geovane" });
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date"));
    const unsub = onSnapshot(q, (snap) => {
      const evs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(evs);
    });
    return () => unsub();
  }, []);

  async function addEvent(e) {
    e.preventDefault();
    if (!form.date || !form.title) return;
    await addDoc(collection(db, "events"), form);
    setForm({ date: "", title: "", owner: "geovane" });
  }

  async function removeEvent(id) {
    await deleteDoc(doc(db, "events", id));
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const days = [];
  for (let i = 0; i < startWeekDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const groupedEvents = events.reduce((acc, ev) => {
    acc[ev.date] = acc[ev.date] || [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  function getColor(owner) {
    if (owner === "geovane") return "lightgreen";
    if (owner === "mayara") return "lightpink";
    if (owner === "ambos") return "lightgray";
    return "white";
  }

  function changeMonth(offset) {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
        <div style={{ flex: 1, padding: 16, overflowY: "auto", borderRight: "1px solid #ccc" }}>
          <h1 style={{ textAlign: "center" }}>📅 Calendário Geovane & Mayara</h1>
          <form onSubmit={addEvent} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <input type="text" placeholder="Título do evento" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
              <option value="geovane">Geovane (verde)</option>
              <option value="mayara">Mayara (rosa)</option>
              <option value="ambos">Ambos (cinza)</option>
            </select>
            <button type="submit">Adicionar Evento</button>
          </form>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <button onClick={() => changeMonth(-1)}>{"<"}</button>
            <strong>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</strong>
            <button onClick={() => changeMonth(1)}>{">"}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: "bold", marginBottom: 4 }}>
            {dayNames.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {days.map((date, i) => {
              const dateStr = date ? date.toISOString().slice(0, 10) : null;
              return (
                <div key={i} style={{ minHeight: 60, border: "1px solid #ddd", padding: 4 }}>
                  {date && <strong>{date.getDate()}</strong>}
                  <div>
                    {dateStr && groupedEvents[dateStr]?.map((ev) => (
                      <div key={ev.id} style={{ backgroundColor: getColor(ev.owner), padding: 2, borderRadius: 4, marginTop: 2, fontSize: 12 }}>
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          <h2>📋 Lista de Eventos</h2>
          {events.length === 0 && <p>Nenhum evento cadastrado.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {events.map((ev) => (
              <li key={ev.id} style={{ backgroundColor: getColor(ev.owner), marginBottom: 8, padding: 6, borderRadius: 4, display: "flex", justifyContent: "space-between" }}>
                <span><strong>{ev.date}:</strong> {ev.title} <small>({ev.owner})</small></span>
                <button onClick={() => removeEvent(ev.id)} style={{ backgroundColor: "transparent", border: "none", color: "red", fontWeight: "bold", cursor: "pointer", fontSize: 18 }} title="Excluir evento">×</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}