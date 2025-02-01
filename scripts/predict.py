import pandas as pd
import numpy as np
import joblib
from datetime import datetime, timedelta

# Load the trained model
model = joblib.load("model.pkl")

# Generate the next 10 days of data
def predict_next_10_days(open_price: float):
    today = datetime.today()
    predictions = []

    for i in range(10):
        next_day = today + timedelta(days=i + 1)
        # Ensure input has column names
        prediction = model.predict(pd.DataFrame([[open_price]], columns=["open_price"]))[0]
        predictions.append({
            "date": next_day.strftime("%Y-%m-%d"),
            "predicted_price": prediction
        })
        open_price = prediction  # Use the predicted price as the next day's open price

    return predictions

# Load last open_price from cleaned_data.csv
df = pd.read_csv("cleaned_data.csv")
last_open_price = df["open_price"].iloc[-1]

# Predict
predictions = predict_next_10_days(last_open_price)

# Save predictions to JSON
predictions_df = pd.DataFrame(predictions)
predictions_df.to_json("predictions.json", orient="records", indent=2)
print("✅ Predictions for the next 10 days saved to predictions.json")
