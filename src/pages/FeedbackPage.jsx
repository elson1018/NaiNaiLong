import { useState } from "react";
import { useCoins } from "../context/CoinContext.jsx";

export default function FeedbackPage() {
  const { simulateStudentAction } = useCoins();
  const [form, setForm] = useState({ topic: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    simulateStudentAction("give_feedback");
    setSubmitted(true);
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1>Give Useful Feedback</h1>
      {!submitted ? (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <div>
            <label>Topic</label>
            <input name="topic" value={form.topic} onChange={onChange} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>
          <div>
            <label>Message</label>
            <textarea name="message" value={form.message} onChange={onChange} rows={5} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />
          </div>
          <button className="btn primary" type="submit">Submit Feedback</button>
        </form>
      ) : (
        <div style={{ marginTop: 12, background: "#ecfeff", border: "1px solid #a5f3fc", padding: 12, borderRadius: 8 }}>
          Thanks! Your feedback was submitted and coins have been awarded.
        </div>
      )}
    </div>
  );
}
