import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "صالون",
    phone: "",
    location: "",
    slug: "",
  });

  const handleSlug = (name) => {
    return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm({ ...form, name, slug: handleSlug(name) });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.location) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.from("businesses").insert([{
      user_id: user.id,
      name: form.name,
      type: form.type,
      phone: form.phone,
      location: form.location,
      slug: form.slug,
    }]);

    setLoading(false);
    if (error) {
      if (error.code === "23505") setError("هذا الرابط مستخدم بالفعل، جرب رابطاً آخر");
      else setError(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  const styles = {
    page: { minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "Arial, sans-serif", direction: "rtl", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" },
    card: { backgroundColor: "white", borderRadius: "24px", padding: "32px", width: "100%", maxWidth: "480px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
    logo: { fontSize: "36px", fontWeight: "bold", color: "#7c3aed", textAlign: "center", marginBottom: "4px" },
    subtitle: { textAlign: "center", color: "#6b7280", fontSize: "14px", marginBottom: "28px" },
    label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
    input: { width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", marginBottom: "16px", outline: "none", boxSizing: "border-box", fontFamily: "Arial", direction: "rtl" },
    select: { width: "100%", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", marginBottom: "16px", outline: "none", boxSizing: "border-box", backgroundColor: "white", direction: "rtl" },
    slugBox: { backgroundColor: "#f3f4f6", borderRadius: "12px", padding: "12px 16px", fontSize: "13px", color: "#6b7280", marginBottom: "16px", direction: "ltr" },
    btn: { width: "100%", backgroundColor: "#7c3aed", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
    error: { backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "12px", padding: "12px", fontSize: "13px", marginBottom: "16px" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>موعد</div>
        <div style={styles.subtitle}>أخبرنا عن نشاطك التجاري 👋</div>

        <label style={styles.label}>اسم النشاط التجاري *</label>
        <input style={styles.input} placeholder="مثال: صالون لمى" value={form.name} onChange={handleNameChange} />

        <label style={styles.label}>نوع النشاط *</label>
        <select style={styles.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option>صالون</option>
          <option>عيادة</option>
          <option>صالة رياضية</option>
          <option>مركز تجميل</option>
          <option>حلاق</option>
          <option>أخرى</option>
        </select>

        <label style={styles.label}>المدينة / المنطقة *</label>
        <input style={styles.input} placeholder="مثال: القاهرة الجديدة" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />

        <label style={styles.label}>رقم الهاتف</label>
        <input style={styles.input} placeholder="01XXXXXXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

        {form.slug && (
          <>
            <label style={styles.label}>رابط الحجز الخاص بك</label>
            <div style={styles.slugBox}>mawid.app/book/{form.slug}</div>
          </>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "جاري الحفظ..." : "ابدأ الآن ←"}
        </button>
      </div>
    </div>
  );
}
