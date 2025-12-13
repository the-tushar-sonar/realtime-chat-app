import axios from "axios";

export const checkToxic = async (text) => {
  const url = (process.env.PYTHON_URL || "http://127.0.0.1:8000") + "/predict";
  try {
    const res = await axios.post(url, { text }, { timeout: 3000 });
    // Expect response shape: { toxic: true/false }
    if (res?.data?.toxic !== undefined) return Boolean(res.data.toxic);
    return false;
  } catch (err) {
    console.warn("ML service error (fallback safe):", err.message);
    // fallback: non-blocking, assume not toxic so chat continues. Alternatively, you can flag and hold.
    return false;
  }
};
