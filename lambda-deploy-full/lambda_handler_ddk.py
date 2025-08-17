"""
DDK-i Bot Lambda Handler
"""
import json
import boto3
import os
from ddk_bot import DDKBot

# Initialize the bot and DynamoDB
bot = DDKBot()
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
table = dynamodb.Table('ddk-existing-clients')

def lambda_handler(event, context):
    """Lambda handler for DDK-i Bot"""
    try:
        # Extract request details
        http_method = event.get('httpMethod', 'GET')
        path = event.get('path', '/')
        
        # For Lambda Function URLs
        if 'requestContext' in event and 'http' in event['requestContext']:
            http_method = event['requestContext']['http']['method']
            path = event['requestContext']['http']['path']
        
        # Handle different endpoints
        if path == '/' and http_method == 'GET':
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'DDK-i Bot API',
                    'status': 'active',
                    'version': '1.0'
                }),
                'headers': {
                    'Content-Type': 'application/json'
                }
            }
        
        elif path == '/api/check_client' and http_method == 'POST':
            # Parse request body
            body = event.get('body', '{}')
            if isinstance(body, str):
                body = json.loads(body)
            
            client_id = body.get('client_id', '')
            mobile_number = body.get('mobile_number', '')
            language = body.get('language', 'en')
            
            if not client_id or not mobile_number:
                return {
                    'statusCode': 400,
                    'body': json.dumps({
                        'success': False,
                        'message': {
                            'en': 'Both Client ID and Mobile Number are required.',
                            'bn': 'ক্লায়েন্ট আইডি এবং মোবাইল নম্বর উভয়ই প্রয়োজন।'
                        }
                    }),
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                }
            
            # Check if client exists in DynamoDB
            try:
                print(f"Searching for client_id: {client_id}")
                print(f"Validating mobile_number: {mobile_number}")
                print(f"Table name: ddk-existing-clients")
                print(f"Region: ap-south-1")
                response = table.get_item(Key={'client_id': client_id})
                print(f"DynamoDB response: {response}")
                print(f"Response keys: {list(response.keys())}")
                print(f"Item in response: {'Item' in response}")
                if 'Item' in response:
                    print(f"Item content: {response['Item']}")
                
                if 'Item' in response:
                    client_info = response['Item']
                    
                    # Helper function to extract value from DynamoDB format or simple format
                    def extract_value(data, key, default=''):
                        if key not in data:
                            return default
                        
                        value = data[key]
                        
                        # Handle DynamoDB type-annotated format
                        if isinstance(value, dict) and 'S' in value:
                            return value['S']
                        elif isinstance(value, dict) and 'L' in value:
                            # Handle list of strings
                            return [item.get('S', '') for item in value['L']]
                        
                        # Handle simple JSON format
                        return value
                    
                    # Extract stored mobile number
                    stored_mobile = extract_value(client_info, 'mobile_number')
                    print(f"Stored mobile: {stored_mobile}")
                    print(f"Input mobile: {mobile_number}")
                    
                    # Validate mobile number
                    if stored_mobile != mobile_number:
                        return {
                            'statusCode': 401,
                            'body': json.dumps({
                                'success': False,
                                'message': {
                                    'en': 'Mobile number does not match. Please check and try again.',
                                    'bn': 'মোবাইল নম্বর মেলে না। অনুগ্রহ করে চেক করে আবার চেষ্টা করুন।'
                                }
                            }),
                            'headers': {
                                'Content-Type': 'application/json'
                            }
                        }
                    
                    # Parse client info using the helper function
                    return {
                        'statusCode': 200,
                        'body': json.dumps({
                            'success': True,
                            'client_info': {
                                'client_id': extract_value(client_info, 'client_id', client_id),
                                'name': extract_value(client_info, 'name'),
                                'company': extract_value(client_info, 'company'),
                                'project_name': extract_value(client_info, 'project_name'),
                                'status': extract_value(client_info, 'status'),
                                'services': extract_value(client_info, 'services', []),
                                'created_date': extract_value(client_info, 'created_date'),
                                'last_contact': extract_value(client_info, 'last_contact'),
                                'mobile_number': stored_mobile
                            }
                        }),
                        'headers': {
                            'Content-Type': 'application/json'
                        }
                    }
                else:
                    return {
                        'statusCode': 200,
                        'body': json.dumps({
                            'success': False,
                            'message': {
                                'en': 'Client ID not found. Please check your Client ID or contact our support team.',
                                'bn': 'ক্লায়েন্ট আইডি পাওয়া যায়নি। অনুগ্রহ করে আপনার ক্লায়েন্ট আইডি চেক করুন।'
                            }
                        }),
                        'headers': {
                            'Content-Type': 'application/json'
                        }
                    }
                    
            except Exception as e:
                print(f"Error querying DynamoDB: {str(e)}")
                return {
                    'statusCode': 500,
                    'body': json.dumps({
                        'success': False,
                        'message': {
                            'en': 'Database error. Please try again later.',
                            'bn': 'ডাটাবেস ত্রুটি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।'
                        }
                    }),
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                }
        
        elif path == '/api/get_service_info' and http_method == 'POST':
            # Parse request body
            body = event.get('body', '{}')
            if isinstance(body, str):
                body = json.loads(body)
            
            query = body.get('query', '').lower()
            language = body.get('language', 'en')
            
            # Process query and return service information
            service_info = bot.get_service_info(query, language)
            
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'success': True,
                    'service_info': service_info,
                    'service_type': 'business_app'
                }),
                'headers': {
                    'Content-Type': 'application/json'
                }
            }
        
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({
                    'error': 'Endpoint not found',
                    'message': 'The requested endpoint does not exist.'
                }),
                'headers': {
                    'Content-Type': 'application/json'
                }
            }
            
    except Exception as e:
        print(f"Lambda handler error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            }),
            'headers': {
                'Content-Type': 'application/json'
            }
        }
