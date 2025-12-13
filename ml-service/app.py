from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

model = joblib.load("model/toxic_model.pkl")

class Message(BaseModel):
    text: str

@app.post("/predict")
def predict(msg: Message):
    result = model.predict([msg.text])
    return {"toxic": bool(result[0])}
