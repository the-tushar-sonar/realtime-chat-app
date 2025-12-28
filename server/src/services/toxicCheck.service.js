import axios from "axios";

export const checkToxic = async (text) => {
  try {
    const res = await axios.post(
      process.env.ML_URL || "http://localhost:8000/predict",
      { text }
    );
    return res.data.toxic;
  } catch (err) {
    console.error("ML service down, skipping check");
    return false;
  }
};
