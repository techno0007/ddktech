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
            language = body.get('language', 'en')
            
            if not client_id:
                return {
                    'statusCode': 400,
                    'body': json.dumps({
                        'success': False,
                        'message': {
                            'en': 'Client ID is required',
                            'bn': 'ক্লায়েন্ট আইডি প্রয়োজন'
                        }
                    }),
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                }
            
            # Check if client exists in DynamoDB
            try:
                print(f"Searching for client_id: {client_id}")
                response = table.get_item(Key={'client_id': client_id})
                print(f"DynamoDB response: {response}")
                
                if 'Item' in response:
                    client_info = response['Item']
                    # Simple JSON format - direct access
                    return {
                        'statusCode': 200,
                        'body': json.dumps({
                            'success': True,
                            'client_info': {
                                'client_id': client_info.get('client_id', client_id),
                                'name': client_info.get('name', ''),
                                'company': client_info.get('company', ''),
                                'project_name': client_info.get('project_name', ''),
                                'status': client_info.get('status', ''),
                                'services': client_info.get('services', []),
                                'created_date': client_info.get('created_date', ''),
                                'last_contact': client_info.get('last_contact', '')
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
