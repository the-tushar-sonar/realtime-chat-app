import pandas as pd

df = pd.read_csv("train.csv")

# Combine all toxicity labels into one
df["toxic_label"] = (
    df["toxic"]
    | df["severe_toxic"]
    | df["obscene"]
    | df["threat"]
    | df["insult"]
    | df["identity_hate"]
)

# Keep only what we need
final_df = df[["comment_text", "toxic_label"]]
final_df.columns = ["text", "toxic"]

# Optional: balance dataset (important)
toxic = final_df[final_df.toxic == 1].sample(5000, random_state=42)
clean = final_df[final_df.toxic == 0].sample(5000, random_state=42)

balanced = pd.concat([toxic, clean]).sample(frac=1)

balanced.to_csv("data.csv", index=False)

print("✅ data.csv created with", len(balanced), "rows")
