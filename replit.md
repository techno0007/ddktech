# DDK TECH Chatbot Application

## Overview

This is a Flask-based web application that provides a bilingual (English/Bengali) customer support chatbot for DDK TECH, a custom business app development company. The chatbot helps existing clients check their project status and assists new clients by providing information about services like gym management apps, pharmacy management systems, and photography studio applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Template Engine**: Jinja2 templates with Flask for server-side rendering
- **Styling**: Custom CSS with Tailwind CSS framework for responsive design
- **JavaScript**: Vanilla JavaScript class-based chatbot implementation
- **Multilingual Support**: Bengali and English language switching with proper font support (Noto Sans Bengali)
- **UI Components**: Floating chat button, collapsible chat window, and responsive message interface

### Backend Architecture
- **Framework**: Flask web framework with Python
- **Session Management**: Flask sessions for maintaining user state
- **API Design**: RESTful endpoints for client verification and service information
- **Data Storage**: Currently uses in-memory mock data (MOCK_CLIENT_DATA) designed to be replaced with AWS database
- **Error Handling**: Comprehensive logging and error responses for both languages
- **Middleware**: ProxyFix for handling reverse proxy headers

### Authentication & Authorization
- **Session Security**: Secret key-based session management
- **Client Verification**: Client ID-based lookup system for existing customers
- **No user authentication**: Public-facing chatbot with client ID verification only

### Design Patterns
- **MVC Pattern**: Separation of routes, templates, and business logic
- **API-First Design**: Clear separation between frontend interactions and backend data processing
- **State Management**: Chatbot conversation state tracking through JavaScript classes
- **Responsive Design**: Mobile-first approach with adaptive UI components

## External Dependencies

### Frontend Dependencies
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Remix Icons**: Icon library for UI elements
- **Google Fonts**: Typography (Inter, Playfair Display, Noto Sans Bengali)

### Backend Dependencies
- **Flask**: Web framework for Python
- **Werkzeug**: WSGI utilities including ProxyFix middleware

### Planned Integrations
- **AWS Database**: Mock data structure prepared for AWS database migration
- **WhatsApp Business API**: Contact integration for human handoff
- **Email Services**: Customer communication through ddktech.manager@gmail.com

### Development Dependencies
- **Python Logging**: Built-in logging module for debugging and monitoring
- **Environment Variables**: Configuration management for session secrets and deployment settings

The application is designed for easy deployment and scaling, with clear separation between development mock data and production database integration points.

## AWS Lambda Deployment Configuration

### Recent Changes (August 16, 2025)
- **AWS Lambda Support**: Added complete serverless deployment configuration
- **Zappa Integration**: Configured automated deployment with Zappa framework
- **Static File Separation**: CSS/JS files configured for S3 hosting
- **Environment Management**: Added development and production environment configurations

### Lambda Architecture
- **lambda_app.py**: Main Lambda entry point with Flask WSGI application
- **zappa_settings.json**: Deployment configuration for dev/prod environments
- **deploy.sh**: Automated deployment script with S3 static file management
- **AWS_LAMBDA_DEPLOYMENT.md**: Comprehensive deployment guide and troubleshooting

### Deployment Environments
- **Development**: `ddktech-chatbot-dev` with debug logging and lower memory allocation
- **Production**: `ddktech-chatbot` with optimized settings and monitoring
- **Static Assets**: Separate S3 bucket for CSS/JS files with CDN-ready configuration

### Key Benefits
- **Serverless Scaling**: Automatic scaling based on traffic demand
- **Cost Optimization**: Pay-per-request pricing model
- **Global Distribution**: API Gateway endpoints with regional optimization
- **Zero Maintenance**: No server management required

### Environment Variables Configuration
- **SESSION_SECRET**: Secure session encryption for user state
- **AWS_REGION**: Deployment region configuration
- **STATIC_FILES_URL**: S3 bucket URL for frontend assets
- **CORS_ORIGINS**: Cross-origin request configuration for security