import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# Minimal toxic dataset (for demo)
data = {
    "text": [
        "I hate you",
        "you are stupid",
        "go to hell",
        "nice work",
        "thank you",
        "good job",
        "this is awesome",
        "you are an idiot"
    ],
    "toxic": [1,1,1,0,0,0,0,1]
}

df = pd.DataFrame(data)

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(stop_words="english")),
    ("clf", LogisticRegression())
])

pipeline.fit(df["text"], df["toxic"])

joblib.dump(pipeline, "toxic_model.pkl")
print("✅ Model trained & saved")
