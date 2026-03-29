import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase";

const BUSINESS = {
  name: "صالون لمى",
  type: "salon",
  location: "القاهرة الجديدة",
  theme: "#7c3aed",
  services: [
    { name: "قص وتصفيف", duration: 60, price: 150 },
    { name: "صبغ شعر", duration: 120, price: 300 },
    { name: "مانيكير", duration: 45, price: 100 },
    { name: "بروتين", duration: 180, price: 400 },
    { name: "كيراتين", duration: 180, price: 500 },
  ],
  staff: ["منى", "ريم", "أي مصففة متاحة"],
  hours: [
    "9:00 ص", "10:00 ص", "11:00 ص",
    "12:00 م", "1:00 م", "2:00 م",
    "3:00 م", "4:00 م", "5:00 م",
    "6:00 م", "7:00 م", "8:00 م",
    "9:00 م"
  ],
};

export default function BookingPage() {
  const { slug } = useParams();
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    service: null, staff: "", time: "", date: new Date().toISOString().split("T")[0], name: "", phone: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const submitBooking = async () => {
    if (!booking.name || !booking.phone) return;
    setLoading(true);
    const { error } = await supabase.from("bookings").insert([{
      client_name: booking.name,
      client_phone: booking.phone,
      service: booking.service.name,
      staff_name: booking.staff,
      booking_time: booking.time,
      booking_date: booking.date,
      status: "pending"
    }]);
    setLoading(false);
    if (!error) setSubmitted(true);
  };

  const s = {
    page: { minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif", direction: "rtl", paddingBottom: "40px" },
    header: { backgroundColor: BUSINESS.theme, padding: "32px 20px", textAlign: "center", color: "white" },
    headerName: { fontSize: "26px", fontWeight: "bold", margin: "0 0 6px" },
    headerSub: { fontSize: "14px", opacity: 0.85, margin: 0 },
    content: { maxWidth: "480px", margin: "0 auto", padding: "24px 16px" },
    stepTitle: { fontSize: "20px", fontWeight: "bold", color: "#111827", marginBottom: "20px", textAlign: "center" },
    card: { backgroundColor: "white", borderRadius: "16px", padding: "16px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: "10px", cursor: "pointer" },
    cardSelected: { backgroundColor: "#faf5ff", borderRadius: "16px", padding: "16px", border: `2px solid ${BUSINESS.theme}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: "10px", cursor: "pointer" },
    serviceName: { fontWeight: "600", fontSize: "15px", color: "#111827" },
    serviceDetail: { fontSize: "13px", color: "#6b7280", marginTop: "4px" },
    timeGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" },
    btn: { padding: "10px", borderRadius: "12px", border: "1px solid #e5e7eb", backgroundColor: "white", fontSize: "13px", cursor: "pointer", textAlign: "center" },
    btnSelected: { padding: "10px", borderRadius: "12px", border: `2px solid ${BUSINESS.theme}`, backgroundColor: "#faf5ff", fontSize: "13px", cursor: "pointer", textAlign: "center", fontWeight: "600", color: BUSINESS.theme },
    input: { width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", marginBottom: "12px", outline: "none", boxSizing: "border-box", fontFamily: "Arial", direction: "rtl" },
    nextBtn: { width: "100%", backgroundColor: BUSINESS.theme, color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "8px" },
    backBtn: { width: "100%", backgroundColor: "#f3f4f6", color: "#6b7280", border: "none", padding: "12px", borderRadius: "12px", fontSize: "14px", cursor: "pointer", marginTop: "8px" },
    steps: { display: "flex", justifyContent: "center", gap: "8px", marginBottom: "28px" },
    stepDot: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#e5e7eb" },
    stepDotActive: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: BUSINESS.theme },
    summaryBox: { backgroundColor: "#f9fafb", borderRadius: "12px", padding: "14px 16px", marginBottom: "12px", fontSize: "13px", color: "#6b7280", lineHeight: "2" },
    sectionLabel: { fontSize: "13px", color: "#6b7280", marginBottom: "8px", fontWeight: "500" },
    staffGrid: { display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "8px", marginBottom: "16px" },
  };

  if (submitted) {
    return (
      <div style={s.page}>
        <div style={s.header}>
          <p style={s.headerName}>{BUSINESS.name}</p>
          <p style={s.headerSub}>{BUSINESS.location}</p>
        </div>
        <div style={s.content}>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#111827", marginBottom: "10px" }}>تم استلام حجزك!</div>
            <div style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.8" }}>
              شكراً {booking.name}، سنتواصل معك على {booking.phone} لتأكيد الموعد.
            </div>
            <div style={{ ...s.summaryBox, marginTop: "24px", textAlign: "right" }}>
              <strong>تفاصيل الحجز:</strong><br />
              الخدمة: {booking.service?.name}<br />
              المصففة: {booking.staff}<br />
              التاريخ: {booking.date}<br />
              الوقت: {booking.time}<br />
              السعر: EGP {booking.service?.price}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <p style={s.headerName}>{BUSINESS.name}</p>
        <p style={s.headerSub}>{BUSINESS.location}</p>
      </div>

      <div style={s.content}>
        <div style={s.steps}>
          {[1, 2, 3].map(i => (
            <div key={i} style={step >= i ? s.stepDotActive : s.stepDot} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={s.stepTitle}>اختر الخدمة</div>
            {BUSINESS.services.map((service, i) => (
              <div key={i}
                style={booking.service?.name === service.name ? s.cardSelected : s.card}
                onClick={() => setBooking({ ...booking, service })}>
                <div style={s.serviceName}>{service.name}</div>
                <div style={s.serviceDetail}>{service.duration} دقيقة · EGP {service.price}</div>
              </div>
            ))}
            <button style={s.nextBtn} onClick={() => booking.service && setStep(2)}>
              التالي ←
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={s.stepTitle}>اختر الموعد</div>

            <div style={s.sectionLabel}>اختري المصففة</div>
            <div style={s.staffGrid}>
              {BUSINESS.staff.map((staff, i) => (
                <div key={i}
                  style={booking.staff === staff ? s.btnSelected : s.btn}
                  onClick={() => setBooking({ ...booking, staff })}>
                  {staff}
                </div>
              ))}
            </div>

            <div style={s.sectionLabel}>التاريخ</div>
            <input style={s.input} type="date" min={today}
              value={booking.date}
              onChange={e => setBooking({ ...booking, date: e.target.value })} />

            <div style={s.sectionLabel}>الوقت</div>
            <div style={s.timeGrid}>
              {BUSINESS.hours.map((time, i) => (
                <div key={i}
                  style={booking.time === time ? s.btnSelected : s.btn}
                  onClick={() => setBooking({ ...booking, time })}>
                  {time}
                </div>
              ))}
            </div>

            <button style={s.nextBtn} onClick={() => booking.staff && booking.time && setStep(3)}>
              التالي ←
            </button>
            <button style={s.backBtn} onClick={() => setStep(1)}>← رجوع</button>
          </>
        )}

        {step === 3 && (
          <>
            <div style={s.stepTitle}>بياناتك الشخصية</div>
            <input style={s.input} placeholder="اسمك الكامل"
              value={booking.name}
              onChange={e => setBooking({ ...booking, name: e.target.value })} />
            <input style={s.input} placeholder="رقم هاتفك" type="tel"
              value={booking.phone}
              onChange={e => setBooking({ ...booking, phone: e.target.value })} />
            <div style={s.summaryBox}>
              <strong>ملخص الحجز:</strong><br />
              الخدمة: {booking.service?.name}<br />
              المصففة: {booking.staff}<br />
              التاريخ: {booking.date}<br />
              الوقت: {booking.time}<br />
              السعر: EGP {booking.service?.price}
            </div>
            <button style={s.nextBtn} onClick={submitBooking} disabled={loading}>
              {loading ? "جاري الحجز..." : "تأكيد الحجز ✓"}
            </button>
            <button style={s.backBtn} onClick={() => setStep(2)}>← رجوع</button>
          </>
        )}
      </div>
    </div>
  );
}
