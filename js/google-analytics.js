// Google Analytics 4 (GA4) Tracking Code
// Replace G-XXXXXXXXXX with your actual Google Analytics Measurement ID

(function() {
    // Google Analytics Configuration
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    
    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        // Enhanced measurement settings
        send_page_view: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true
    });
    
    // Track custom events
    function trackEvent(eventName, parameters = {}) {
        gtag('event', eventName, parameters);
    }
    
    // Track page views
    function trackPageView(pagePath, pageTitle) {
        gtag('config', GA_MEASUREMENT_ID, {
            page_path: pagePath,
            page_title: pageTitle
        });
    }
    
    // Track contact form submissions
    function trackContactForm() {
        trackEvent('contact_form_submit', {
            event_category: 'engagement',
            event_label: 'contact_form'
        });
    }
    
    // Track WhatsApp clicks
    function trackWhatsAppClick() {
        trackEvent('whatsapp_click', {
            event_category: 'engagement',
            event_label: 'whatsapp_contact'
        });
    }
    
    // Track service page views
    function trackServiceView(serviceName) {
        trackEvent('service_view', {
            event_category: 'engagement',
            event_label: serviceName
        });
    }
    
    // Make functions globally available
    window.trackEvent = trackEvent;
    window.trackPageView = trackPageView;
    window.trackContactForm = trackContactForm;
    window.trackWhatsAppClick = trackWhatsAppClick;
    window.trackServiceView = trackServiceView;
    
    // Auto-track WhatsApp links
    document.addEventListener('DOMContentLoaded', function() {
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
        whatsappLinks.forEach(link => {
            link.addEventListener('click', trackWhatsAppClick);
        });
        
        // Auto-track contact forms
        const contactForms = document.querySelectorAll('form');
        contactForms.forEach(form => {
            form.addEventListener('submit', trackContactForm);
        });
    });
    
    console.log('Google Analytics initialized with Measurement ID:', GA_MEASUREMENT_ID);
})();
