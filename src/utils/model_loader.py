# your_python_script.py
import sys
import joblib
import json

# Load the model
model = joblib.load("./src/utils/model.pkl")

# Get data from command line arguments
data = json.loads(sys.argv[1])

# Format the data according to your model's requirements
# Misalnya, jika Anda memiliki model yang mengharapkan Engine Size(L), Cylinders, dan lainnya
input_data = [
    [
        data["engine_size"],
        data["cylinders"],
        data["fuel_consumption_city"],
        data["fuel_consumption_hwy"],
        data["fuel_consumption_comb"],
        data["fuel_consumption_comb_mpg"],
    ]
]

# Perform prediction
result = model.predict(input_data)

# Print the result
print(result[0])
