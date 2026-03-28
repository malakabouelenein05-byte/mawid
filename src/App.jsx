import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBooking, setNewBooking] = useState({ client: "", service: "", time: "", staff: "منى", phone: "" });
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
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
      status: "confirmed"
    }]).select();
    if (error) { console.error(error); alert("خطأ: " + error.message); }
    else {
      setBookings([data[0], ...bookings]);
      setNewBooking({ client: "", service: "", time: "", staff: "منى", phone: "" });
      setShowAdd(false);
    }
  };

  const confirmBooking = async (id) => {
    const { error } = await supabase.from("bookings").update({ status: "confirmed" }).eq("id", id);
    if (!error) setBookings(bookings.map(b => b.id === id ? { ...b, status: "confirmed" } : b));
  };

  const styles = {
    page: { minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif", direction: "rtl" },
    header: { backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", alignItems: "center", gap: "12px" },
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
    timeText: { fontWeight: "bold", fontSize: "15px", color: "#111827", textAlign: "left" },
    confirmBtn: { backgroundColor: "#7c3aed", color: "white", border: "none", padding: "4px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", marginTop: "4px" },
    confirmedBadge: { fontSize: "12px", color: "#16a34a", marginTop: "4px" },
    phoneBtn: { width: "36px", height: "36px", backgroundColor: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: "16px", marginRight: "8px" },
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
  };

  const stats = [
    { label: "حجوزات اليوم", value: bookings.length, icon: "📅" },
    { label: "العملاء النشطون", value: new Set(bookings.map(b => b.client_phone)).size, icon: "👥" },
    { label: "ساعات العمل", value: "8", icon: "🕐" },
    { label: "تذكيرات أُرسلت", value: bookings.filter(b => b.reminder_sent).length, icon: "🔔" },
  ];

  const filteredBookings = bookings.filter(b => {
    if (activeTab === "upcoming") return b.status === "pending";
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>
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
                </div>
              </div>
              <div style={styles.rightSide}>
                <div style={{ textAlign: "center" }}>
                  <div style={styles.timeText}>{b.booking_time}</div>
                  {b.status === "pending" ? (
                    <button style={styles.confirmBtn} onClick={() => confirmBooking(b.id)}>تأكيد ✓</button>
                  ) : (
                    <div style={styles.confirmedBadge}>✓ مؤكد</div>
                  )}
                </div>
                <a href={`tel:${b.client_phone}`} style={styles.phoneBtn}>📞</a>
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
