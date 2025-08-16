from flask import render_template, request, jsonify, session
from app import app, MOCK_CLIENT_DATA, SERVICE_INFO
import logging

@app.route('/')
def index():
    """Main page with chatbot integration demo"""
    return render_template('integration.html')

@app.route('/chatbot')
def chatbot():
    """Standalone chatbot widget"""
    return render_template('chatbot.html')

@app.route('/api/check_client', methods=['POST'])
def check_client():
    """API endpoint to check client ID and return client information"""
    try:
        data = request.get_json()
        client_id = data.get('client_id', '').strip().upper()
        
        logging.debug(f"Checking client ID: {client_id}")
        
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
        logging.error(f"Error checking client: {e}")
        return jsonify({
            'success': False,
            'message': {
                'en': 'An error occurred. Please try again.',
                'bn': 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            }
        })

@app.route('/api/get_service_info', methods=['POST'])
def get_service_info():
    """API endpoint to get service information based on query"""
    try:
        data = request.get_json()
        query = data.get('query', '').lower()
        language = data.get('language', 'en')
        
        logging.debug(f"Service query: {query}, Language: {language}")
        
        # Simple keyword matching for service information
        if any(word in query for word in ['gym', 'জিম', 'fitness', 'ফিটনেস']):
            service_key = 'gym'
        elif any(word in query for word in ['pharmacy', 'ফার্মেসি', 'medicine', 'ওষুধ', 'medical', 'মেডিকেল']):
            service_key = 'pharmacy'
        elif any(word in query for word in ['photography', 'ফটোগ্রাফি', 'photo', 'ছবি', 'studio', 'স্টুডিও']):
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
        logging.error(f"Error getting service info: {e}")
        return jsonify({
            'success': False,
            'message': {
                'en': 'An error occurred. Please try again.',
                'bn': 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            }
        })

@app.route('/widget')
def widget():
    """Embeddable chatbot widget"""
    return render_template('chatbot.html')
