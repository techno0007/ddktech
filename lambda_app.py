"""
Lambda entry point for DDK-i Chatbot
This file serves as the WSGI application entry point for AWS Lambda
"""
import os
import logging
from flask import Flask, render_template, request, jsonify, session, send_from_directory
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging for AWS Lambda
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the Flask app
app = Flask(__name__)

# Configure for Lambda environment
app.secret_key = os.environ.get("SESSION_SECRET", "ddktech-chatbot-lambda-secret")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Disable Flask's default logging in Lambda
if os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
    app.logger.disabled = True

# Mock client data - to be replaced with DynamoDB
MOCK_CLIENT_DATA = {
    "DDK001": {
        "name": "রাহুল দাস / Rahul Das",
        "project_name": "জিম ম্যানেজমেন্ট অ্যাপ / Gym Management App",
        "renewal_date": "২০২৫-০৯-১৫ / 2025-09-15",
        "pending_amount": "₹৫,০০০ / ₹5,000",
        "status": "সক্রিয় / Active",
        "last_update": "২০২৫-০৮-১০ / 2025-08-10"
    },
    "DDK002": {
        "name": "ডাঃ প্রিয়া সেন / Dr. Priya Sen", 
        "project_name": "ফার্মেসি ম্যানেজমেন্ট সিস্টেম / Pharmacy Management System",
        "renewal_date": "২০২৫-১০-২২ / 2025-10-22",
        "pending_amount": "₹০ / ₹0",
        "status": "সক্রিয় / Active",
        "last_update": "২০২৫-০৮-০৫ / 2025-08-05"
    },
    "DDK003": {
        "name": "অমিত চক্রবর্তী / Amit Chakraborty",
        "project_name": "ফটোগ্রাফি স্টুডিও অ্যাপ / Photography Studio App",
        "renewal_date": "২০২৫-১২-৩১ / 2025-12-31",
        "pending_amount": "₹২,৫০০ / ₹2,500",
        "status": "পেন্ডিং পেমেন্ট / Pending Payment",
        "last_update": "২০২৫-০৮-১২ / 2025-08-12"
    }
}

# Service information
SERVICE_INFO = {
    "gym": {
        "en": "Gym Management App: Complete solution for membership tracking, payment collection, trainer scheduling, and equipment management. Features include member registration, automated billing, workout plans, and progress tracking.",
        "bn": "জিম ম্যানেজমেন্ট অ্যাপ: সদস্যতা ট্র্যাকিং, পেমেন্ট সংগ্রহ, প্রশিক্ষক সময়সূচী এবং সরঞ্জাম ব্যবস্থাপনার জন্য সম্পূর্ণ সমাধান। বৈশিষ্ট্যগুলির মধ্যে রয়েছে সদস্য নিবন্ধন, স্বয়ংক্রিয় বিলিং, ওয়ার্কআউট প্ল্যান এবং অগ্রগতি ট্র্যাকিং।"
    },
    "pharmacy": {
        "en": "Pharmacy Management System: Advanced inventory tracking, prescription management, customer database, automated billing, and supplier management. Perfect for medical stores and pharmacies.",
        "bn": "ফার্মেসি ম্যানেজমেন্ট সিস্টেম: উন্নত ইনভেন্টরি ট্র্যাকিং, প্রেসক্রিপশন ব্যবস্থাপনা, গ্রাহক ডেটাবেস, স্বয়ংক্রিয় বিলিং এবং সরবরাহকারী ব্যবস্থাপনা। মেডিকেল স্টোর এবং ফার্মেসির জন্য নিখুঁত।"
    },
    "photography": {
        "en": "Photography Studio App: Complete studio management with booking system, client galleries, payment tracking, equipment management, and automated workflows for photographers.",
        "bn": "ফটোগ্রাফি স্টুডিও অ্যাপ: বুকিং সিস্টেম, ক্লায়েন্ট গ্যালারি, পেমেন্ট ট্র্যাকিং, সরঞ্জাম ব্যবস্থাপনা এবং ফটোগ্রাফারদের জন্য স্বয়ংক্রিয় ওয়ার্কফ্লো সহ সম্পূর্ণ স্টুডিও ব্যবস্থাপনা।"
    },
    "custom": {
        "en": "Custom Business Apps: We develop tailored applications for any business type. From restaurants to retail stores, we create solutions that fit your specific needs with 7-14 days delivery.",
        "bn": "কাস্টম বিজনেস অ্যাপস: আমরা যেকোনো ব্যবসার ধরনের জন্য কাস্টমাইজড অ্যাপ্লিকেশন তৈরি করি। রেস্তোরাঁ থেকে খুচরা দোকান পর্যন্ত, আমরা ৭-১৪ দিনের মধ্যে ডেলিভারি সহ আপনার নির্দিষ্ট প্রয়োজন অনুযায়ী সমাধান তৈরি করি।"
    }
}

# Routes
@app.route('/')
def index():
    """Main page with integrated chatbot"""
    # For Lambda, we'll serve the HTML directly
    chatbot_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DDK TECH - DDK-i Chatbot</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com/3.4.16"></script>
    <style>
        /* Basic styles - full CSS should be served from S3/CloudFront */
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; }
        .chat-button { position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; border: none; border-radius: 50px; padding: 16px 24px; cursor: pointer; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <h1>DDK TECH - DDK-i Chatbot</h1>
    <p>Your bilingual AI assistant for custom business app development services.</p>
    <p>The chatbot is now deployed on AWS Lambda!</p>
    
    <div id="chatButton" class="chat-button">
        <i class="ri-message-3-line"></i> DDK-i
    </div>
    
    <script>
        // Basic functionality - full JS should be served from S3/CloudFront
        document.getElementById('chatButton').addEventListener('click', function() {
            alert('Chatbot integration complete! Deploy CSS/JS files to S3 for full functionality.');
        });
    </script>
</body>
</html>"""
    return chatbot_html

@app.route('/health')
def health_check():
    """Health check endpoint for AWS Lambda"""
    return jsonify({
        "status": "healthy",
        "service": "DDK-i Chatbot",
        "version": "1.0.0"
    })

@app.route('/api/check_client', methods=['POST'])
def check_client():
    """API endpoint to check client ID"""
    try:
        data = request.get_json()
        client_id = data.get('client_id', '').strip().upper()
        
        logger.info(f"Checking client ID: {client_id}")
        
        if client_id in MOCK_CLIENT_DATA:
            client_info = MOCK_CLIENT_DATA[client_id]
            return jsonify({
                'success': True,
                'client_info': client_info
            })
        else:
            return jsonify({
                'success': False,
                'message': {
                    'en': 'Client ID not found. Please check your Client ID or contact support.',
                    'bn': 'ক্লায়েন্ট আইডি পাওয়া যায়নি। অনুগ্রহ করে আপনার ক্লায়েন্ট আইডি চেক করুন বা সাপোর্টের সাথে যোগাযোগ করুন।'
                }
            })
    except Exception as e:
        logger.error(f"Error checking client: {e}")
        return jsonify({
            'success': False,
            'message': {
                'en': 'An error occurred. Please try again.',
                'bn': 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            }
        }), 500

@app.route('/api/get_service_info', methods=['POST'])
def get_service_info():
    """API endpoint to get service information"""
    try:
        data = request.get_json()
        query = data.get('query', '').lower()
        language = data.get('language', 'en')
        
        logger.info(f"Service query: {query}, Language: {language}")
        
        # Simple keyword matching
        if any(word in query for word in ['gym', 'জিম', 'fitness', 'ফিটনেস']):
            service_key = 'gym'
        elif any(word in query for word in ['pharmacy', 'ফার্মেসি', 'medicine', 'ওষুধ']):
            service_key = 'pharmacy'
        elif any(word in query for word in ['photography', 'ফটোগ্রাফি', 'photo', 'ছবি']):
            service_key = 'photography'
        else:
            service_key = 'custom'
        
        service_info = SERVICE_INFO[service_key][language]
        
        return jsonify({
            'success': True,
            'service_info': service_info,
            'service_type': service_key
        })
        
    except Exception as e:
        logger.error(f"Error getting service info: {e}")
        return jsonify({
            'success': False,
            'message': {
                'en': 'An error occurred. Please try again.',
                'bn': 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            }
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested resource was not found.'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An internal server error occurred.'
    }), 500

# For local testing
if __name__ == '__main__':
    app.run(debug=True)