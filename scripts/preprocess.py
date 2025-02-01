import json
import pandas as pd

# Load the JSON data
with open("data.json", "r") as f:
    data = json.load(f)

# Extract relevant fields
df = pd.DataFrame([
    {
        "date": item["block_date"],
        "token": item["token"],
        "symbol": item["token_symbol"],
        "open_price": item["open"],
        "predicted_price": item["prediction"],
        "prediction_lb": item["prediction_lb"],
        "prediction_ub": item["prediction_ub"]
    }
    for item in data.get("data", [])
])

# Save as CSV
df.to_csv("cleaned_data.csv", index=False)
print("✅ Data preprocessing complete. Saved as cleaned_data.csv")
