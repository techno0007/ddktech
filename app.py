import os
import logging
from flask import Flask, render_template, request, jsonify, session
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "ddktech-chatbot-secret-key-2025")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Mock client data - will be replaced with AWS DB later
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

# Service information in both languages
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

from routes import *

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
