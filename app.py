from flask import Flask, render_template, jsonify, request, session
import pandas as pd
import os
from io import StringIO

app = Flask(__name__)
app.secret_key = 'insurance_analytics_secret_key'

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "insurance_data.csv")

# In-memory storage for uploaded data
user_data = None

def get_insurance_data():
    """Reads the CSV file and returns a DataFrame."""
    global user_data
    # If user has uploaded data, use that
    if user_data is not None:
        return user_data
    # Otherwise use default data file
    if not os.path.exists(DATA_FILE):
        return None
    return pd.read_csv(DATA_FILE)

@app.route('/')
def index():
    """Renders the dashboard template."""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_data():
    """Handle CSV file upload from user."""
    global user_data
    
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    try:
        # Read CSV from the uploaded file
        df = pd.read_csv(file)
        
        # Validate required columns exist
        required_columns = ['Area', 'Premium_Amount', 'Claim_Amount', 'Policy_Type', 'Income_Level', 'Claim_Status']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            return jsonify({"error": f"Missing required columns: {', '.join(missing_columns)}"}), 400
        
        # Store the uploaded data
        user_data = df
        session['has_user_data'] = True
        
        return jsonify({
            "success": True, 
            "message": f"Successfully uploaded {len(df)} records!",
            "total_records": len(df)
        })
        
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}"}), 400

@app.route('/reset', methods=['POST'])
def reset_data():
    """Reset to default data."""
    global user_data
    user_data = None
    session.pop('has_user_data', None)
    return jsonify({"success": True, "message": "Reset to default data"})

@app.route('/api/analytics')
def analytics_api():
    """Returns JSON data for the dashboard charts."""
    df = get_insurance_data()
    
    if df is None:
        return jsonify({"error": "Data file not found. Please upload a CSV file."}), 404

    # 1. Key Performance Indicators (KPIs)
    total_revenue = float(df['Premium_Amount'].sum())
    total_claims = float(df['Claim_Amount'].sum())
    net_profit = total_revenue - total_claims
    loss_ratio = (total_claims / total_revenue * 100) if total_revenue > 0 else 0
    
    # 2. Revenue by Policy Type
    rev_by_policy = df.groupby('Policy_Type')['Premium_Amount'].sum().sort_values(ascending=False)
    
    # 3. Policy Distribution by Area - THIS IS THE KEY ANALYSIS FOR YOUR PROJECT
    policies_by_area = df['Area'].value_counts()
    
    # 4. Claim Status Distribution
    claim_status_dist = df['Claim_Status'].value_counts()
    
    # 5. Average Premium by Income Level - Reorder properly
    income_order = ['Low', 'Middle', 'High']
    avg_prem_income = df.groupby('Income_Level')['Premium_Amount'].mean()
    # Reindex to ensure proper order
    avg_prem_income = avg_prem_income.reindex([idx for idx in income_order if idx in avg_prem_income.index])

    # 6. Additional analysis - Claims by Area
    claims_by_area = df.groupby('Area')['Claim_Amount'].sum()

    # Construct JSON response
    data = {
        "kpi": {
            "revenue": total_revenue,
            "claims": total_claims,
            "net_profit": net_profit,
            "loss_ratio": round(loss_ratio, 2),
            "total_policies": len(df)
        },
        "charts": {
            "policy_revenue": {
                "labels": rev_by_policy.index.tolist(),
                "data": [float(x) for x in rev_by_policy.values.tolist()]
            },
            "area_distribution": {
                "labels": policies_by_area.index.tolist(),
                "data": [int(x) for x in policies_by_area.values.tolist()]
            },
            "claim_status": {
                "labels": claim_status_dist.index.tolist(),
                "data": claim_status_dist.values.tolist()
            },
            "income_premium": {
                "labels": avg_prem_income.index.tolist(),
                "data": [float(x) for x in avg_prem_income.values.tolist()]
            },
            "claims_by_area": {
                "labels": claims_by_area.index.tolist(),
                "data": [float(x) for x in claims_by_area.values.tolist()]
            }
        },
        "data_source": "user_uploaded" if session.get('has_user_data') else "default"
    }
    return jsonify(data)

@app.route('/api/area-analysis')
def area_analysis_api():
    """Returns detailed area-wise analysis."""
    df = get_insurance_data()
    
    if df is None:
        return jsonify({"error": "Data file not found. Please upload a CSV file."}), 404

    # Detailed area analysis
    area_analysis = df.groupby('Area').agg({
        'Premium_Amount': ['sum', 'mean', 'count'],
        'Claim_Amount': ['sum', 'mean'],
    }).round(2)
    
    # Flatten column names
    area_analysis.columns = ['_'.join(col).strip() for col in area_analysis.columns.values]
    area_analysis = area_analysis.reset_index()
    
    # Calculate profit per area
    area_analysis['profit'] = area_analysis['Premium_Amount_sum'] - area_analysis['Claim_Amount_sum']
    area_analysis['loss_ratio'] = (area_analysis['Claim_Amount_sum'] / area_analysis['Premium_Amount_sum'] * 100).round(2)
    
    return jsonify({
        "area_data": area_analysis.to_dict(orient='records'),
        "total_areas": len(area_analysis)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
