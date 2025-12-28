from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

model = joblib.load("model/toxic_model.pkl")

class TextIn(BaseModel):
    text: str

@app.post("/predict")
def predict(data: TextIn):
    pred = model.predict([data.text])[0]
    return {
        "toxic": bool(pred)
    }
