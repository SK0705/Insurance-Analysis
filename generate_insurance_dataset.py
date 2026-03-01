import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

# Configuration
n = 600

# Define data categories
areas = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"]
cities = {
    "North Zone": ["Delhi", "Jaipur", "Chandigarh", "Lucknow", "Kanpur"],
    "South Zone": ["Chennai", "Bangalore", "Hyderabad", "Kochi", "Coimbatore"],
    "East Zone": ["Kolkata", "Bhubaneswar", "Patna", "Ranchi", "Guwahati"],
    "West Zone": ["Mumbai", "Pune", "Ahmedabad", "Surat", "Nagpur"],
    "Central Zone": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"]
}

policy_types = ["Life", "Health", "Vehicle", "Property"]
age_groups = ["18-30", "31-45", "46-60", "60+"]
income_levels = ["Low", "Middle", "High"]
genders = ["Male", "Female", "Other"]
occupations = ["Salaried", "Self-Employed", "Business", "Retired", "Student", "Professional"]
payment_modes = ["Monthly", "Quarterly", "Half-Yearly", "Annual"]
claim_statuses = ["No Claim", "Claim Filed", "Claim Approved", "Claim Rejected"]

# Premium ranges by policy type and income level (realistic amounts)
premium_ranges = {
    "Life": {"Low": (5000, 15000), "Middle": (15000, 30000), "High": (30000, 50000)},
    "Health": {"Low": (8000, 20000), "Middle": (20000, 40000), "High": (40000, 60000)},
    "Vehicle": {"Low": (3000, 10000), "Middle": (10000, 25000), "High": (25000, 45000)},
    "Property": {"Low": (10000, 25000), "Middle": (25000, 45000), "High": (45000, 70000)}
}

# Generate random customer names
first_names = ["Aarav", "Aanya", "Arjun", "Ananya", "Vivaan", "Diya", "Arnav", "Pari", "Reyansh", "Myra",
               "Krishna", "Saanvi", "Ayaan", "Pihu", "Ishaan", "Avni", "Sai", "Kiara", "Vihaan", "Anika",
               "Aditya", "Siddharth", "Priya", "Rahul", "Neha", "Amit", "Sunita", "Rajesh", "Meera", "Raj",
               "Suresh", "Kavita", "Anil", "Pooja", "Vikram", "Rani", "Mahesh", "Lakshmi", "Gopal", "Sarita"]

last_names = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Rao", "Joshi", "Shah", "Mehta",
              "Verma", "Chowdhury", "Mukherjee", "Iyer", "Nair", "Menon", "Pillai", "Bhatia", "Saxena",
              "Kapoor", "Malhotra", "Khanna", "Bajaj", "Trivedi", "Desai"]

def generate_name():
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def generate_premium(policy_type, income_level):
    low, high = premium_ranges[policy_type][income_level]
    return round(np.random.uniform(low, high), 2)

def generate_claim_amount(claim_status):
    if claim_status == "No Claim":
        return 0
    elif claim_status == "Claim Rejected":
        return 0
    else:
        # Claim amounts based on policy type
        return round(np.random.uniform(5000, 50000), 2)

# Generate dates
start_date = datetime(2023, 1, 1)
dates = [start_date + timedelta(days=random.randint(0, 730)) for _ in range(n)]

# Create DataFrame
data = {
    "Policy_ID": range(10001, 10001 + n),
    "Date": dates,
    "Customer_Name": [generate_name() for _ in range(n)],
    "Gender": np.random.choice(genders, n),
    "Age": np.random.choice([random.randint(18, 30), random.randint(31, 45), random.randint(46, 60), random.randint(61, 75)], n),
    "Area": np.random.choice(areas, n),
    "City": [],
    "Occupation": np.random.choice(occupations, n),
    "Policy_Type": np.random.choice(policy_types, n),
    "Customer_Age_Group": np.random.choice(age_groups, n),
    "Income_Level": np.random.choice(income_levels, n),
    "Premium_Amount": [],
    "Payment_Mode": np.random.choice(payment_modes, n, p=[0.3, 0.25, 0.2, 0.25]),
    "Policy_Duration": np.random.choice([1, 2, 3, 5], n, p=[0.3, 0.3, 0.25, 0.15]),
    "Claim_Status": np.random.choice(claim_statuses, n, p=[0.6, 0.1, 0.2, 0.1]),
    "Claim_Amount": []
}

# Fill City based on Area
for area in data["Area"]:
    data["City"].append(random.choice(cities[area]))

# Fill Premium and Claim Amount based on policy type and income
for i in range(n):
    policy_type = data["Policy_Type"][i]
    income_level = data["Income_Level"][i]
    data["Premium_Amount"].append(generate_premium(policy_type, income_level))
    data["Claim_Amount"].append(generate_claim_amount(data["Claim_Status"][i]))

df = pd.DataFrame(data)

# Sort by date
df = df.sort_values('Date').reset_index(drop=True)

# Format date column
df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')

# Save to CSV
df.to_csv("insurance_data.csv", index=False)

print("=" * 60)
print("ENHANCED INSURANCE DATASET GENERATED")
print("=" * 60)
print(f"\nTotal Records: {len(df)}")
print(f"\nDataset Fields: {', '.join(df.columns.tolist())}")
print("\n" + "-" * 60)
print("DATA SUMMARY:")
print("-" * 60)
print(f"\nTotal Premium Revenue: ${df['Premium_Amount'].sum():,.2f}")
print(f"Total Claims: ${df['Claim_Amount'].sum():,.2f}")
print(f"Average Premium: ${df['Premium_Amount'].mean():,.2f}")
print(f"Claim Rate: {(df['Claim_Status'] != 'No Claim').sum() / len(df) * 100:.1f}%")
print("\n" + "-" * 60)
print("BREAKDOWN BY POLICY TYPE:")
print("-" * 60)
for ptype in policy_types:
    count = len(df[df['Policy_Type'] == ptype])
    premium = df[df['Policy_Type'] == ptype]['Premium_Amount'].sum()
    print(f"  {ptype}: {count} policies, ${premium:,.2f} revenue")
print("\n" + "-" * 60)
print("BREAKDOWN BY AREA:")
print("-" * 60)
for area in areas:
    count = len(df[df['Area'] == area])
    premium = df[df['Area'] == area]['Premium_Amount'].sum()
    print(f"  {area}: {count} policies, ${premium:,.2f} revenue")
print("\n" + "=" * 60)
print("Dataset saved to: insurance_data.csv")
print("=" * 60)

# Display first few rows
print("\nSample Data (First 5 rows):")
print(df.head().to_string())
