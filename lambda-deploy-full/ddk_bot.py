"""
DDK-i Bot - Intelligent Service Assistant
"""
import json
from datetime import datetime

class DDKBot:
    def __init__(self):
        self.conversation_state = {}
        self.service_responses = {
            'pricing': {
                'response': 'Our pricing starts from ₹199 and depends on the complexity and features you need. We offer flexible payment plans and can work within your budget.',
                'category': 'pricing'
            },
            'delivery': {
                'response': 'Standard delivery time is 7-14 days. For urgent projects, we can deliver in 5-6 days with express service.',
                'category': 'delivery'
            },
            'customization': {
                'response': 'We offer full customization for all our services. Our team will work with you to create exactly what you need.',
                'category': 'customization'
            },
            'industry': {
                'response': 'We serve multiple industries including healthcare, education, retail, and manufacturing. Each solution is tailored to industry-specific requirements.',
                'category': 'industry'
            },
            'support': {
                'response': 'We provide 24/7 support with dedicated account managers. Support includes maintenance, updates, and technical assistance.',
                'category': 'support'
            }
        }
    
    def process_message(self, message, session_id):
        """Process user message and return bot response"""
        message = message.lower().strip()
        
        # Initialize session if new
        if session_id not in self.conversation_state:
            self.conversation_state[session_id] = {
                'step': 'greeting',
                'name': None,
                'mobile': None,
                'client_id': None,
                'is_existing_client': False
            }
        
        session = self.conversation_state[session_id]
        
        # Handle conversation flow
        if session['step'] == 'greeting':
            return self.handle_greeting(session)
        
        elif session['step'] == 'client_type':
            return self.handle_client_type(message, session)
        
        elif session['step'] == 'new_client_name':
            return self.handle_new_client_name(message, session)
        
        elif session['step'] == 'new_client_mobile':
            return self.handle_new_client_mobile(message, session)
        
        elif session['step'] == 'existing_client_id':
            return self.handle_existing_client_id(message, session)
        
        elif session['step'] == 'service_query':
            return self.handle_service_query(message, session)
        
        else:
            return self.handle_service_query(message, session)
    
    def handle_greeting(self, session):
        """Handle initial greeting"""
        session['step'] = 'client_type'
        return {
            'message': "Hello! I'm DDK-i, your intelligent service assistant. Are you a new client or an existing client?",
            'options': ['New Client', 'Existing Client'],
            'step': 'client_type'
        }
    
    def handle_client_type(self, message, session):
        """Handle client type selection"""
        if 'new' in message:
            session['is_existing_client'] = False
            session['step'] = 'new_client_name'
            return {
                'message': "Great! I'll help you get started. What's your name?",
                'step': 'new_client_name'
            }
        elif 'existing' in message:
            session['is_existing_client'] = True
            session['step'] = 'existing_client_id'
            return {
                'message': "Welcome back! Please provide your client ID:",
                'step': 'existing_client_id'
            }
        else:
            return {
                'message': "Please choose: Are you a new client or an existing client?",
                'options': ['New Client', 'Existing Client'],
                'step': 'client_type'
            }
    
    def handle_new_client_name(self, message, session):
        """Handle new client name input"""
        session['name'] = message
        session['step'] = 'new_client_mobile'
        return {
            'message': f"Nice to meet you, {message}! What's your mobile number?",
            'step': 'new_client_mobile'
        }
    
    def handle_new_client_mobile(self, message, session):
        """Handle new client mobile input"""
        session['mobile'] = message
        session['step'] = 'service_query'
        return {
            'message': f"Thank you! Now, how can I help you today? You can ask about: pricing, delivery, customization, industry solutions, or support.",
            'step': 'service_query',
            'client_info': {
                'name': session['name'],
                'mobile': session['mobile'],
                'status': 'new_client'
            }
        }
    
    def handle_existing_client_id(self, message, session):
        """Handle existing client ID input"""
        session['client_id'] = message
        session['step'] = 'service_query'
        # For now, simulate existing client data
        return {
            'message': f"Client ID {message} verified! Welcome back. How can I help you today? You can ask about: pricing, delivery, customization, industry solutions, or support.",
            'step': 'service_query',
            'client_info': {
                'client_id': session['client_id'],
                'status': 'existing_client'
            }
        }
    
    def handle_service_query(self, message, session):
        """Handle service-related queries"""
        for key, response in self.service_responses.items():
            if key in message:
                return {
                    'message': response['response'],
                    'category': response['category'],
                    'step': 'service_query'
                }
        
        # Default response for unrecognized queries
        return {
            'message': "I can help you with: pricing, delivery, customization, industry solutions, or support. What would you like to know?",
            'step': 'service_query'
        }
    
    def get_service_info(self, query, language='en'):
        """Get service information based on query"""
        query = query.lower().strip()
        
        # Service information in both languages
        service_data = {
            'pricing': {
                'en': {
                    'title': 'Pricing Information',
                    'description': 'Our pricing starts from ₹199 and depends on the complexity and features you need. We offer flexible payment plans and can work within your budget.',
                    'details': [
                        'Basic Package: ₹199 - Simple business app',
                        'Standard Package: ₹499 - Medium complexity app',
                        'Premium Package: ₹999 - Full-featured custom app',
                        'Enterprise: Custom pricing for large projects'
                    ]
                },
                'bn': {
                    'title': 'মূল্য নির্ধারণের তথ্য',
                    'description': 'আমাদের মূল্য ₹199 থেকে শুরু হয় এবং আপনার প্রয়োজনীয় জটিলতা এবং বৈশিষ্ট্যের উপর নির্ভর করে। আমরা নমনীয় অর্থ প্রদানের পরিকল্পনা প্রদান করি এবং আপনার বাজেটের মধ্যে কাজ করতে পারি।',
                    'details': [
                        'বেসিক প্যাকেজ: ₹199 - সরল ব্যবসায়িক অ্যাপ',
                        'স্ট্যান্ডার্ড প্যাকেজ: ₹499 - মাঝারি জটিলতার অ্যাপ',
                        'প্রিমিয়াম প্যাকেজ: ₹999 - সম্পূর্ণ বৈশিষ্ট্যযুক্ত কাস্টম অ্যাপ',
                        'এন্টারপ্রাইজ: বড় প্রকল্পের জন্য কাস্টম মূল্য'
                    ]
                }
            },
            'delivery': {
                'en': {
                    'title': 'Delivery Timeline',
                    'description': 'Standard delivery time is 7-14 days. For urgent projects, we can deliver in 5-6 days with express service.',
                    'details': [
                        'Express Delivery: 5-6 days (+₹100)',
                        'Standard Delivery: 7-14 days',
                        'Complex Projects: 15-21 days',
                        'Enterprise Solutions: 4-6 weeks'
                    ]
                },
                'bn': {
                    'title': 'ডেলিভারি সময়সীমা',
                    'description': 'মানক ডেলিভারি সময় 7-14 দিন। জরুরি প্রকল্পের জন্য, আমরা এক্সপ্রেস পরিষেবা সহ 5-6 দিনে ডেলিভারি করতে পারি।',
                    'details': [
                        'এক্সপ্রেস ডেলিভারি: 5-6 দিন (+₹100)',
                        'মানক ডেলিভারি: 7-14 দিন',
                        'জটিল প্রকল্প: 15-21 দিন',
                        'এন্টারপ্রাইজ সমাধান: 4-6 সপ্তাহ'
                    ]
                }
            },
            'customization': {
                'en': {
                    'title': 'Customization Options',
                    'description': 'We offer full customization for all our services. Our team will work with you to create exactly what you need.',
                    'details': [
                        'UI/UX Design: Custom interfaces',
                        'Backend Logic: Tailored functionality',
                        'Integration: Third-party services',
                        'Branding: Your company identity'
                    ]
                },
                'bn': {
                    'title': 'কাস্টমাইজেশন বিকল্পগুলি',
                    'description': 'আমরা আমাদের সমস্ত পরিষেবার জন্য সম্পূর্ণ কাস্টমাইজেশন প্রদান করি। আমাদের দল আপনার সাথে কাজ করবে ঠিক আপনার প্রয়োজনীয় জিনিস তৈরি করতে।',
                    'details': [
                        'UI/UX ডিজাইন: কাস্টম ইন্টারফেস',
                        'ব্যাকএন্ড লজিক: উপযুক্ত কার্যকারিতা',
                        'ইন্টিগ্রেশন: তৃতীয় পক্ষের পরিষেবা',
                        'ব্র্যান্ডিং: আপনার কোম্পানির পরিচয়'
                    ]
                }
            }
        }
        
        # Find matching service
        for service_key, service_info in service_data.items():
            if service_key in query:
                return service_info.get(language, service_info['en'])
        
        # Default response
        default_response = {
            'en': {
                'title': 'Our Services',
                'description': 'We provide comprehensive business app development services including custom solutions, web development, and mobile applications.',
                'details': [
                    'Custom Business Apps',
                    'Web Development',
                    'Mobile Applications',
                    'API Integration',
                    'Maintenance & Support'
                ]
            },
            'bn': {
                'title': 'আমাদের পরিষেবা',
                'description': 'আমরা কাস্টম সমাধান, ওয়েব ডেভেলপমেন্ট এবং মোবাইল অ্যাপ্লিকেশন সহ বিস্তৃত ব্যবসায়িক অ্যাপ ডেভেলপমেন্ট পরিষেবা প্রদান করি।',
                'details': [
                    'কাস্টম ব্যবসায়িক অ্যাপ',
                    'ওয়েব ডেভেলপমেন্ট',
                    'মোবাইল অ্যাপ্লিকেশন',
                    'API ইন্টিগ্রেশন',
                    'রক্ষণাবেক্ষণ এবং সহায়তা'
                ]
            }
        }
        
        return default_response.get(language, default_response['en'])
