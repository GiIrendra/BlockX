import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

# Load trained model
model = tf.keras.models.load_model('model.h5')

# Load last 10 days of data
df = pd.read_csv('../../../cleaned_data.csv')
scaler = MinMaxScaler()
df['open'] = scaler.fit_transform(df[['open']])

last_10_days = df['open'].values[-10:].reshape(1, 10, 1)

# Predict next 10 days
predictions = model.predict(last_10_days)

# Convert back to original scale
predictions = scaler.inverse_transform(predictions.reshape(-1, 1))

print(predictions.tolist())  # Return predictions as JSON
