import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBooking, setNewBooking] = useState({ client: "", service: "", time: "", staff: "منى", phone: "", date: new Date().toISOString().split("T")[0] });
  const [activeTab, setActiveTab] = useState("today");
  const [editingId, setEditingId] = useState(null);
  const [editTime, setEditTime] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("bookings").select("*").order("booking_date", { ascending: true });
    if (error) console.error(error);
    else setBookings(data || []);
    setLoading(false);
  };

  const addBooking = async () => {
    if (!newBooking.client || !newBooking.service || !newBooking.time) return;
    const { data, error } = await supabase.from("bookings").insert([{
      client_name: newBooking.client,
      client_phone: newBooking.phone,
      service: newBooking.service,
      staff_name: newBooking.staff,
      booking_time: newBooking.time,
      booking_date: newBooking.date,
      status: "confirmed"
    }]).select();
    if (error) { console.error(error); }
    else {
      setBookings([...bookings, data[0]].sort((a, b) => a.booking_date > b.booking_date ? 1 : -1));
      setNewBooking({ client: "", service: "", time: "", staff: "منى", phone: "", date: new Date().toISOString().split("T")[0] });
      setShowAdd(false);
    }
  };

  const confirmBooking = async (id) => {
    const { error } = await supabase.from("bookings").update({ status: "confirmed" }).eq("id", id);
    if (!error) setBookings(bookings.map(b => b.id === id ? { ...b, status: "confirmed" } : b));
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الحجز؟")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (!error) setBookings(bookings.filter(b => b.id !== id));
  };

  const saveEdit = async (id) => {
    const { error } = await supabase.from("bookings")
      .update({ booking_time: editTime, booking_date: editDate })
      .eq("id", id);
    if (!error) {
      setBookings(bookings.map(b => b.id === id ? { ...b, booking_time: editTime, booking_date: editDate } : b));
      setEditingId(null);
      setEditTime("");
      setEditDate("");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredBookings = bookings.filter(b => {
    if (activeTab === "today") return b.booking_date === today;
    if (activeTab === "upcoming") return b.booking_date > today;
    return true;
  });

  const styles = {
    page: { minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif", direction: "rtl" },
    header: { backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logoIcon: { width: "40px", height: "40px", backgroundColor: "#7c3aed", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "18px" },
    logoText: { fontWeight: "bold", fontSize: "20px", color: "#111827" },
    logoSub: { fontSize: "12px", color: "#6b7280", margin: 0 },
    addBtn: { backgroundColor: "#7c3aed", color: "white", border: "none", padding: "10px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
    content: { maxWidth: "800px", margin: "0 auto", padding: "24px 16px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" },
    statCard: { backgroundColor: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
    statVal: { fontSize: "28px", fontWeight: "bold", color: "#111827", margin: "8px 0 4px" },
    statLabel: { fontSize: "13px", color: "#6b7280" },
    tabs: { display: "flex", gap: "8px", marginBottom: "16px" },
    tabActive: { backgroundColor: "#7c3aed", color: "white", border: "none", padding: "8px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
    tabInactive: { backgroundColor: "white", color: "#6b7280", border: "1px solid #e5e7eb", padding: "8px 20px", borderRadius: "12px", fontSize: "14px", cursor: "pointer" },
    bookingCard: { backgroundColor: "white", borderRadius: "16px", padding: "16px", border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" },
    avatar: { width: "44px", height: "44px", backgroundColor: "#ede9fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#7c3aed", fontWeight: "bold", fontSize: "16px", marginLeft: "12px" },
    clientName: { fontWeight: "600", fontSize: "15px", color: "#111827" },
    clientSub: { fontSize: "13px", color: "#6b7280" },
    clientDate: { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },
    timeText: { fontWeight: "bold", fontSize: "15px", color: "#111827", textAlign: "center" },
    confirmBtn: { backgroundColor: "#7c3aed", color: "white", border: "none", padding: "4px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", marginTop: "4px" },
    confirmedBadge: { fontSize: "12px", color: "#16a34a", marginTop: "4px" },
    phoneBtn: { width: "36px", height: "36px", backgroundColor: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: "16px" },
    deleteBtn: { width: "36px", height: "36px", backgroundColor: "#fee2e2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", cursor: "pointer", border: "none" },
    editBtn: { width: "36px", height: "36px", backgroundColor: "#e0f2fe", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", cursor: "pointer", border: "none" },
    rightSide: { display: "flex", alignItems: "center", gap: "8px" },
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000 },
    modal: { backgroundColor: "white", width: "100%", maxWidth: "480px", borderRadius: "24px 24px 0 0", padding: "24px" },
    modalTitle: { fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px" },
    input: { width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", marginBottom: "10px", outline: "none", boxSizing: "border-box", fontFamily: "Arial", direction: "rtl" },
    select: { width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", marginBottom: "10px", outline: "none", boxSizing: "border-box", backgroundColor: "white", direction: "rtl" },
    modalBtns: { display: "flex", gap: "10px", marginTop: "16px" },
    saveBtn: { flex: 1, backgroundColor: "#7c3aed", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
    cancelBtn: { flex: 1, backgroundColor: "#f3f4f6", color: "#6b7280", border: "none", padding: "14px", borderRadius: "12px", fontSize: "15px", cursor: "pointer" },
    loadingText: { textAlign: "center", padding: "40px", color: "#6b7280", fontSize: "16px" },
    emptyText: { textAlign: "center", padding: "40px", color: "#6b7280", fontSize: "14px" },
    editInput: { border: "1px solid #7c3aed", borderRadius: "8px", padding: "4px 8px", fontSize: "12px", width: "90px", textAlign: "center", outline: "none", marginBottom: "4px" },
    saveEditBtn: { backgroundColor: "#7c3aed", color: "white", border: "none", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" },
    dateLabel: { fontSize: "12px", color: "#6b7280", marginBottom: "4px", display: "block" },
  };

  const todayBookings = bookings.filter(b => b.booking_date === today).length;
  const upcomingBookings = bookings.filter(b => b.booking_date > today).length;

  const stats = [
    { label: "حجوزات اليوم", value: todayBookings, icon: "📅" },
    { label: "حجوزات قادمة", value: upcomingBookings, icon: "🗓️" },
    { label: "إجمالي العملاء", value: new Set(bookings.map(b => b.client_phone)).size, icon: "👥" },
    { label: "تذكيرات أُرسلت", value: bookings.filter(b => b.reminder_sent).length, icon: "🔔" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={styles.logoIcon}>م</div>
          <div>
            <div style={styles.logoText}>موعد</div>
            <p style={styles.logoSub}>صالون لمى - القاهرة الجديدة</p>
          </div>
        </div>
        <button style={styles.addBtn} onClick={() => setShowAdd(true)}>+ حجز جديد</button>
      </div>

      <div style={styles.content}>
        <div style={styles.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div>{s.icon}</div>
              <div style={styles.statVal}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.tabs}>
          {[["today", "اليوم"], ["upcoming", "القادمة"], ["all", "الكل"]].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={activeTab === key ? styles.tabActive : styles.tabInactive}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loadingText}>جاري التحميل...</div>
        ) : filteredBookings.length === 0 ? (
          <div style={styles.emptyText}>لا توجد حجوزات</div>
        ) : (
          filteredBookings.map((b) => (
            <div key={b.id} style={styles.bookingCard}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={styles.avatar}>{b.client_name[0]}</div>
                <div>
                  <div style={styles.clientName}>{b.client_name}</div>
                  <div style={styles.clientSub}>{b.service} · {b.staff_name}</div>
                  <div style={styles.clientDate}>{b.booking_date}</div>
                </div>
              </div>
              <div style={styles.rightSide}>
                <div style={{ textAlign: "center" }}>
                  {editingId === b.id ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <input style={styles.editInput} value={editTime}
                        onChange={e => setEditTime(e.target.value)} placeholder="الوقت" />
                      <input style={{...styles.editInput, width: "120px"}} type="date"
                        value={editDate} onChange={e => setEditDate(e.target.value)} />
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button style={styles.saveEditBtn} onClick={() => saveEdit(b.id)}>✓ حفظ</button>
                        <button style={{...styles.saveEditBtn, backgroundColor:"#6b7280"}} onClick={() => setEditingId(null)}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={styles.timeText}>{b.booking_time}</div>
                      {b.status === "pending" ? (
                        <button style={styles.confirmBtn} onClick={() => confirmBooking(b.id)}>تأكيد ✓</button>
                      ) : (
                        <div style={styles.confirmedBadge}>✓ مؤكد</div>
                      )}
                    </>
                  )}
                </div>
                <a href={`tel:${b.client_phone}`} style={styles.phoneBtn}>📞</a>
                <button style={styles.editBtn} onClick={() => { setEditingId(b.id); setEditTime(b.booking_time); setEditDate(b.booking_date); }}>✏️</button>
                <button style={styles.deleteBtn} onClick={() => deleteBooking(b.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div style={styles.overlay} onClick={() => setShowAdd(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalTitle}>➕ حجز جديد</div>
            <input style={styles.input} placeholder="اسم العميل"
              value={newBooking.client} onChange={e => setNewBooking({ ...newBooking, client: e.target.value })} />
            <input style={styles.input} placeholder="رقم الهاتف"
              value={newBooking.phone} onChange={e => setNewBooking({ ...newBooking, phone: e.target.value })} />
            <select style={styles.select} value={newBooking.service}
              onChange={e => setNewBooking({ ...newBooking, service: e.target.value })}>
              <option value="">اختر الخدمة</option>
              <option>قص وتصفيف</option>
              <option>صبغ شعر</option>
              <option>مانيكير</option>
              <option>بروتين</option>
              <option>كيراتين</option>
            </select>
            <select style={styles.select} value={newBooking.staff}
              onChange={e => setNewBooking({ ...newBooking, staff: e.target.value })}>
              <option>منى</option>
              <option>ريم</option>
            </select>
            <label style={styles.dateLabel}>التاريخ</label>
            <input style={styles.input} type="date" min={today}
              value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} />
            <input style={styles.input} placeholder="الوقت (مثال: 3:00 م)"
              value={newBooking.time} onChange={e => setNewBooking({ ...newBooking, time: e.target.value })} />
            <div style={styles.modalBtns}>
              <button style={styles.saveBtn} onClick={addBooking}>حفظ الحجز</button>
              <button style={styles.cancelBtn} onClick={() => setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

