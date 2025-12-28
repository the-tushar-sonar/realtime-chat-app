import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

df = pd.read_csv("data.csv")

X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["toxic"], test_size=0.2, random_state=42
)

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        stop_words="english",
        ngram_range=(1,2),
        max_features=15000
    )),
    ("clf", LogisticRegression(max_iter=1000))
])

pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)

print("\n📊 Model Evaluation:")
print(classification_report(y_test, y_pred))

joblib.dump(pipeline, "toxic_model.pkl")
print("✅ toxic_model.pkl saved")
