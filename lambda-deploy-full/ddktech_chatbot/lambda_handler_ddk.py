"""
DDK-i Bot Lambda Handler
"""
import json
from ddk_bot import DDKBot

# Initialize the bot
bot = DDKBot()

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
        
        elif path == '/api/chat' and http_method == 'POST':
            # Parse request body
            body = event.get('body', '{}')
            if isinstance(body, str):
                body = json.loads(body)
            
            message = body.get('message', '')
            session_id = body.get('session_id', 'default')
            
            # Process message with bot
            response = bot.process_message(message, session_id)
            
            return {
                'statusCode': 200,
                'body': json.dumps(response),
                'headers': {
                    'Content-Type': 'application/json'
                }
            }
        
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({
                    'error': 'Not Found',
                    'message': f'Route {path} not found'
                }),
                'headers': {
                    'Content-Type': 'application/json'
                }
            }
    
    except Exception as e:
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
