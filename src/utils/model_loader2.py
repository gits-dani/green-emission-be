# model_loader.py
import joblib

# Load the model
model = joblib.load("./src/utils/model.pkl")

# Sample data for prediction
sample_data = [[2.0, 4, 10.1, 7.2, 8.6, 27]]

# Perform prediction
result = model.predict(sample_data)

# Print the result
print(result[0])
