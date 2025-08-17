// DDK-i Chatbot JavaScript
class DDKChatbot {
    constructor() {
        this.currentLanguage = 'en';
        this.chatStage = 'initial';
        this.userName = '';
        this.isOpen = false;
        
        // Update this to your deployed Lambda Function URL
        this.lambdaBaseUrl = 'https://uvo5url676gg4uhzp77uc4ax5i0tashl.lambda-url.ap-south-1.on.aws';
        
        this.texts = {
            en: {
                welcome: "Hello! I'm DDK-i, your digital assistant from DDK TECH. I'm here to help you with information about our custom business app development services. How can I assist you today?",
                question: "Are you an existing DDK TECH client?",
                clientIdLabel: "Please enter your Client ID:",
                clientIdPlaceholder: "e.g., DDK001",
                nameLabel: "Please enter your name:",
                namePlaceholder: "Your name",
                queryLabel: "What would you like to know about our services?",
                queryPlaceholder: "Ask about our apps...",
                statusText: "Online",
                thinking: "Let me check that for you...",
                greeting: (name) => `Nice to meet you, ${name}! I'm here to help you learn about our services.`,
                clientFound: "Great! I found your information:",
                clientNotFound: "Client ID not found. Please check your Client ID or contact our support team at +91-8820746227.",
                errorMessage: "I apologize, but I'm having trouble processing your request. Please try again or contact our support team.",
                serviceIntro: "Here's information about our services:",
                contactPrompt: "Would you like to speak with our support team? <i class='ri-whatsapp-line'></i> WhatsApp us at +91-8820746227 or email ddktech.manager@gmail.com"
            },
            bn: {
                welcome: "নমস্কার! আমি ডিডিকে-আই, ডিডিকে টেকের আপনার ডিজিটাল সহায়ক। আমি আমাদের কাস্টম বিজনেস অ্যাপ ডেভেলপমেন্ট সেবা সম্পর্কে তথ্য দিতে এখানে আছি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
                question: "আপনি কি ডিডিকে টেকের একজন বিদ্যমান ক্লায়েন্ট?",
                clientIdLabel: "অনুগ্রহ করে আপনার ক্লায়েন্ট আইডি লিখুন:",
                clientIdPlaceholder: "যেমন, DDK001",
                nameLabel: "অনুগ্রহ করে আপনার নাম লিখুন:",
                namePlaceholder: "আপনার নাম",
                queryLabel: "আমাদের সেবা সম্পর্কে আপনি কী জানতে চান?",
                queryPlaceholder: "আমাদের অ্যাপস সম্পর্কে জিজ্ঞাসা করুন...",
                statusText: "অনলাইন",
                thinking: "আমি আপনার জন্য চেক করছি...",
                greeting: (name) => `আপনার সাথে পরিচিত হয়ে ভালো লাগলো, ${name}! আমি আমাদের সেবা সম্পর্কে জানাতে এখানে আছি।`,
                clientFound: "দুর্দান্ত! আমি আপনার তথ্য পেয়েছি:",
                clientNotFound: "ক্লায়েন্ট আইডি পাওয়া যায়নি। অনুগ্রহ করে আপনার ক্লায়েন্ট আইডি চেক করুন বা আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন +91-8820746227।",
                errorMessage: "আমি দুঃখিত, আপনার অনুরোধ প্রক্রিয়া করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন বা আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
                serviceIntro: "এখানে আমাদের সেবা সম্পর্কে তথ্য:",
                contactPrompt: "আপনি কি আমাদের সাপোর্ট টিমের সাথে কথা বলতে চান? <i class='ri-whatsapp-line'></i> আমাদের হোয়াটসঅ্যাপ করুন +91-8820746227 বা ইমেইল করুন ddktech.manager@gmail.com"
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateLanguage();
        this.addFadeInAnimation();
    }

    bindEvents() {
        // Chat button click
        document.getElementById('chatButton').addEventListener('click', () => {
            this.toggleChat();
        });

        // Minimize button
        document.getElementById('minimizeBtn').addEventListener('click', () => {
            this.toggleChat();
        });

        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleChoice(e.target.dataset.choice);
            });
        });

        // Form submissions
        ['chatForm', 'nameForm', 'queryForm'].forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    if (formId === 'chatForm') {
                        // Handle client ID form with both fields
                        const clientId = document.getElementById('clientId').value.trim();
                        const mobileNumber = document.getElementById('mobileNumber').value.trim();
                        
                        if (clientId && mobileNumber) {
                            // Add user message to chat showing both inputs
                            this.addUserMessage(`Client ID: ${clientId}, Mobile: ${mobileNumber}`);
                            
                            // Process both fields
                            this.processClientId(clientId);
                        } else {
                            this.addBotMessage('Please enter both Client ID and Mobile Number.');
                        }
                    } else {
                        // Handle other forms (name, query)
                        const inputField = form.querySelector('input[type="text"]');
                        if (inputField && inputField.value.trim()) {
                            const userInput = inputField.value.trim();
                            
                            // Add user message to chat
                            this.addUserMessage(userInput);
                            
                            // Process based on current stage
                            if (formId === 'nameForm') {
                                this.processName(userInput);
                            } else if (formId === 'queryForm') {
                                this.processQuery(userInput);
                            }
                            
                            // Clear the input field after processing
                            inputField.value = '';
                        }
                    }
                });
            }
        });

        // Input field enter key
        ['clientId', 'mobileNumber', 'userName', 'userQuery'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        
                        if (id === 'clientId' || id === 'mobileNumber') {
                            // For client ID or mobile number, check both fields
                            const clientId = document.getElementById('clientId').value.trim();
                            const mobileNumber = document.getElementById('mobileNumber').value.trim();
                            
                            if (clientId && mobileNumber) {
                                // Add user message to chat showing both inputs
                                this.addUserMessage(`Client ID: ${clientId}, Mobile: ${mobileNumber}`);
                                
                                // Process both fields
                                this.processClientId(clientId);
                            } else {
                                this.addBotMessage('Please enter both Client ID and Mobile Number.');
                            }
                        } else if (input.value.trim()) {
                            const userInput = input.value.trim();
                            
                            // Add user message to chat
                            this.addUserMessage(userInput);
                            
                            // Process based on input ID
                            if (id === 'userName') {
                                this.processName(userInput);
                            } else if (id === 'userQuery') {
                                this.processQuery(userInput);
                            }
                            
                            // Clear the input field after processing
                            input.value = '';
                        }
                    }
                });
            }
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatWindow');
        const chatButton = document.getElementById('chatButton');
        
        if (this.isOpen) {
            chatWindow.classList.remove('active');
            chatButton.style.display = 'flex';
            this.isOpen = false;
        } else {
            chatWindow.classList.add('active');
            chatButton.style.display = 'none';
            this.isOpen = true;
            
            // Focus on current input if available
            this.focusCurrentInput();
            
            // Ensure scrollbar is visible if needed
            setTimeout(() => {
                this.ensureScrollbarVisibility();
            }, 300);
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'bn' : 'en';
        this.updateLanguage();
        
        // Update current lang indicator
        document.getElementById('currentLang').textContent = this.currentLanguage.toUpperCase();
    }

    updateLanguage() {
        const body = document.body;
        body.className = body.className.replace(/lang-(en|bn)/g, '');
        body.classList.add(`lang-${this.currentLanguage}`);

        // Update text content
        const texts = this.texts[this.currentLanguage];
        
        // Update welcome message in chat body
        document.getElementById('welcomeMessage').textContent = texts.welcome;
        document.getElementById('questionText').textContent = texts.question;
        
        // Update form labels
        document.getElementById('clientIdLabel').textContent = texts.clientIdLabel;
        document.getElementById('nameLabel').textContent = texts.nameLabel;
        document.getElementById('queryLabel').textContent = texts.queryLabel;
        document.getElementById('botStatusText').textContent = texts.statusText;

        // Update placeholders
        const clientIdInput = document.getElementById('clientId');
        const userNameInput = document.getElementById('userName');
        const userQueryInput = document.getElementById('userQuery');
        
        if (clientIdInput) clientIdInput.placeholder = texts.clientIdPlaceholder;
        if (userNameInput) userNameInput.placeholder = texts.namePlaceholder;
        if (userQueryInput) userQueryInput.placeholder = texts.queryPlaceholder;
    }

    handleChoice(choice) {
        this.addUserMessage(choice === 'existing' ? 
            (this.currentLanguage === 'en' ? 'Yes' : 'হ্যাঁ') : 
            (this.currentLanguage === 'en' ? 'No' : 'না')
        );

        // Hide initial question
        document.getElementById('initialQuestion').classList.add('hidden');

        if (choice === 'existing') {
            this.showClientIdInput();
            this.chatStage = 'client-id';
        } else {
            this.showNameInput();
            this.chatStage = 'name';
        }
    }

    showClientIdInput() {
        document.getElementById('clientIdInput').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('clientId').focus();
        }, 100);
    }

    showNameInput() {
        document.getElementById('nameInput').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('userName').focus();
        }, 100);
    }

    showQueryInput() {
        document.getElementById('queryInput').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('userQuery').focus();
        }, 100);
    }

    async handleFormSubmit() {
        if (this.chatStage === 'client-id') {
            await this.handleClientId();
        } else if (this.chatStage === 'name') {
            this.handleName();
        } else if (this.chatStage === 'query') {
            await this.handleQuery();
        }
    }

    processClientId(clientId) {
        this.currentClientId = clientId;
        this.chatStage = 'client-id';
        this.handleClientId();
    }

    processName(name) {
        this.currentName = name;
        this.chatStage = 'name';
        this.handleName();
    }

    processQuery(query) {
        this.currentQuery = query;
        this.chatStage = 'query';
        this.handleQuery();
    }

    async handleClientId() {
        // Get client ID and mobile number from the form
        const clientId = this.currentClientId || document.getElementById('clientId').value.trim();
        const mobileNumber = document.getElementById('mobileNumber').value.trim();
        
        if (!clientId || !mobileNumber) {
            this.addBotMessage('Please enter both Client ID and Mobile Number.');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(`${this.lambdaBaseUrl}/api/check_client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    client_id: clientId,
                    mobile_number: mobileNumber
                })
            });

            const data = await response.json();
            this.hideLoading();

            if (data.success) {
                this.addBotMessage(this.texts[this.currentLanguage].clientFound);
                this.displayClientInfo(data.client_info);
                this.addBotMessageHTML(this.texts[this.currentLanguage].contactPrompt);
            } else {
                this.addBotMessage(data.message[this.currentLanguage] || this.texts[this.currentLanguage].clientNotFound);
                this.addBotMessageHTML(this.texts[this.currentLanguage].contactPrompt);
            }

            // Hide client ID input and clear the fields
            document.getElementById('clientIdInput').classList.add('hidden');
            document.getElementById('clientId').value = '';
            document.getElementById('mobileNumber').value = '';
            this.chatStage = 'completed';

        } catch (error) {
            console.error('Error checking client:', error);
            this.hideLoading();
            this.addBotMessage(this.texts[this.currentLanguage].errorMessage);
        }
    }

    handleName() {
        // Get name from the parameter passed by the caller
        const name = this.currentName || document.getElementById('userName').value.trim();
        if (!name) return;

        this.userName = name;
        this.addBotMessage(this.texts[this.currentLanguage].greeting(name));

        // Hide name input, clear the field, and show query input
        document.getElementById('nameInput').classList.add('hidden');
        document.getElementById('userName').value = '';
        this.showQueryInput();
        this.chatStage = 'query';
    }

    async handleQuery() {
        // Get query from the parameter passed by the caller
        const query = this.currentQuery || document.getElementById('userQuery').value.trim();
        if (!query) return;

        this.showLoading();

        try {
            const response = await fetch(`${this.lambdaBaseUrl}/api/get_service_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    query: query,
                    language: this.currentLanguage 
                })
            });

            const data = await response.json();
            this.hideLoading();

            if (data.success) {
                this.addBotMessage(this.texts[this.currentLanguage].serviceIntro);
                this.displayServiceInfo(data.service_info, data.service_type);
                this.addBotMessageHTML(this.texts[this.currentLanguage].contactPrompt);
            } else {
                this.addBotMessage(data.message[this.currentLanguage] || this.texts[this.currentLanguage].errorMessage);
            }

            // Clear query input for next question
            document.getElementById('userQuery').value = '';

        } catch (error) {
            console.error('Error getting service info:', error);
            this.hideLoading();
            this.addBotMessage(this.texts[this.currentLanguage].errorMessage);
        }
    }

    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        messageDiv.textContent = this.escapeHtml(text);
        this.appendMessage(messageDiv);
        
        // Auto-scroll to bottom
        setTimeout(() => {
            this.scrollToBottom();
            this.ensureScrollbarVisibility();
        }, 100);
    }

    addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.textContent = this.escapeHtml(text);
        this.appendMessage(messageDiv);
        
        // Auto-scroll to bottom
        setTimeout(() => {
            this.scrollToBottom();
            this.ensureScrollbarVisibility();
        }, 100);
    }

    addBotMessageHTML(htmlContent) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message fade-in';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="ri-robot-line"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${htmlContent}</div>
                <div class="message-time">Now</div>
            </div>
        `;

        this.appendMessage(messageDiv);
    }

    displayClientInfo(clientInfo) {
        console.log('Displaying client info:', clientInfo); // Debug log
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message client-info-message fade-in';
        messageDiv.style.width = '100%';
        messageDiv.style.maxWidth = '100%';
        
        // Helper function to format values and handle undefined
        const formatValue = (value, defaultValue = 'Not Available') => {
            if (value === undefined || value === null || value === '') {
                return defaultValue;
            }
            return value;
        };

        // Helper function to get status class
        const getStatusClass = (status) => {
            if (!status) return '';
            const statusLower = status.toLowerCase();
            if (statusLower.includes('active') || statusLower.includes('running')) return 'status-active';
            if (statusLower.includes('pending') || statusLower.includes('waiting')) return 'status-pending';
            if (statusLower.includes('completed') || statusLower.includes('done')) return 'status-completed';
            return '';
        };

        const clientInfoHtml = `
            <div class="client-info" style="width: 100%; max-width: 100%;">
                <h4>${this.currentLanguage === 'en' ? 'Client Information' : 'ক্লায়েন্ট তথ্য'}</h4>
                <div class="client-info-grid">
                    <div class="client-info-item">
                        <span class="client-info-label">${this.currentLanguage === 'en' ? 'Name' : 'নাম'}</span>
                        <span class="client-info-value ${!clientInfo.name ? 'empty' : ''}">${formatValue(clientInfo.name, 'Not Available')}</span>
                    </div>
                    <div class="client-info-item">
                        <span class="client-info-label">${this.currentLanguage === 'en' ? 'Mobile' : 'মোবাইল'}</span>
                        <span class="client-info-value mobile-number ${!clientInfo.mobile_number ? 'empty' : ''}">${formatValue(clientInfo.mobile_number, 'Not Available')}</span>
                    </div>
                    <div class="client-info-item">
                        <span class="client-info-label">${this.currentLanguage === 'en' ? 'Company' : 'কোম্পানি'}</span>
                        <span class="client-info-value ${!clientInfo.company ? 'empty' : ''}">${formatValue(clientInfo.company, 'Not Available')}</span>
                    </div>
                    <div class="client-info-item">
                        <span class="client-info-label">${this.currentLanguage === 'en' ? 'Project' : 'প্রকল্প'}</span>
                        <span class="client-info-value ${!clientInfo.project_name ? 'empty' : ''}">${formatValue(clientInfo.project_name, 'Not Available')}</span>
                    </div>
                    <div class="client-info-item">
                        <span class="client-info-label">${this.currentLanguage === 'en' ? 'Status' : 'অবস্থা'}</span>
                        <span class="client-info-value ${getStatusClass(clientInfo.status)}">${formatValue(clientInfo.status, 'Not Available')}</span>
                    </div>
                    <div class="client-info-item">
                        <span class="client-info-label">${this.currentLanguage === 'en' ? 'Created Date' : 'তৈরির তারিখ'}</span>
                        <span class="client-info-value ${!clientInfo.created_date ? 'empty' : ''}">${formatValue(clientInfo.created_date, 'Not Available')}</span>
                    </div>
                    <div class="client-info-item">
                        <span class="client-info-label">${this.currentLanguage === 'en' ? 'Last Contact' : 'শেষ যোগাযোগ'}</span>
                        <span class="client-info-value ${!clientInfo.last_contact ? 'empty' : ''}">${formatValue(clientInfo.last_contact, 'Not Available')}</span>
                    </div>
                </div>
                ${clientInfo.services && clientInfo.services.length > 0 ? `
                    <div class="client-info-item" style="grid-column: 1 / -1; margin-top: 12px;">
                        <span class="client-info-label">${this.currentLanguage === 'en' ? 'Services' : 'সেবাসমূহ'}</span>
                        <span class="client-info-value">${Array.isArray(clientInfo.services) ? clientInfo.services.join(', ') : clientInfo.services}</span>
                    </div>
                ` : ''}
            </div>
        `;

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="ri-robot-line"></i>
            </div>
            <div class="message-content" style="width: 100%; max-width: 100%;">
                ${clientInfoHtml}
                <div class="message-time">Now</div>
            </div>
        `;

        console.log('Client info HTML:', clientInfoHtml); // Debug log
        this.appendMessage(messageDiv);
        
        // Ensure scrollbar is visible and scroll to bottom
        setTimeout(() => {
            this.scrollToBottom();
            this.ensureScrollbarVisibility();
        }, 100);
    }

    displayServiceInfo(serviceInfo, serviceType) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message service-info-message fade-in';
        
        // Check if serviceInfo is an object and has the expected structure
        let serviceInfoHtml = '';
        
        if (serviceInfo && typeof serviceInfo === 'object') {
            const title = serviceInfo.title || 'Service Information';
            const description = serviceInfo.description || '';
            const details = serviceInfo.details || [];
            
            serviceInfoHtml = `
                <div class="service-info">
                    <h5>${title}</h5>
                    ${description ? `<p>${description}</p>` : ''}
                    ${details.length > 0 ? `
                        <ul class="service-details">
                            ${details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        } else {
            // Fallback if serviceInfo is not in expected format
            serviceInfoHtml = `
                <div class="service-info">
                    <h5>${this.getServiceTitle(serviceType)}</h5>
                    <p>${serviceInfo || 'Service information not available'}</p>
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="ri-robot-line"></i>
            </div>
            <div class="message-content">
                ${serviceInfoHtml}
                <div class="message-time">Now</div>
            </div>
        `;

        this.appendMessage(messageDiv);
    }

    getServiceTitle(serviceType) {
        const titles = {
            en: {
                gym: 'Gym Management App',
                pharmacy: 'Pharmacy Management System',
                photography: 'Photography Studio App',
                custom: 'Custom Business Apps'
            },
            bn: {
                gym: 'জিম ম্যানেজমেন্ট অ্যাপ',
                pharmacy: 'ফার্মেসি ম্যানেজমেন্ট সিস্টেম',
                photography: 'ফটোগ্রাফি স্টুডিও অ্যাপ',
                custom: 'কাস্টম বিজনেস অ্যাপস'
            }
        };

        return titles[this.currentLanguage][serviceType] || titles[this.currentLanguage].custom;
    }

    appendMessage(messageDiv) {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.appendChild(messageDiv);
        
        // Add fade-in animation
        setTimeout(() => {
            messageDiv.classList.add('visible');
        }, 100);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showLoading() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    focusCurrentInput() {
        if (this.chatStage === 'client-id') {
            document.getElementById('clientId').focus();
        } else if (this.chatStage === 'name') {
            document.getElementById('userName').focus();
        } else if (this.chatStage === 'query') {
            document.getElementById('userQuery').focus();
        }
    }

    addFadeInAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Improved scroll management
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            // Smooth scroll to bottom
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
            
            // Ensure scrollbar is visible if content overflows
            if (messagesContainer.scrollHeight > messagesContainer.clientHeight) {
                messagesContainer.style.overflowY = 'scroll';
            }
        }
    }

    // Force scrollbar to be visible when needed
    ensureScrollbarVisibility() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            // Check if content overflows
            if (messagesContainer.scrollHeight > messagesContainer.clientHeight) {
                messagesContainer.style.overflowY = 'scroll';
                // Force a reflow to ensure scrollbar appears
                messagesContainer.offsetHeight;
            }
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DDKChatbot();
});

// Prevent form submission on Enter in chat inputs
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('.chat-form input')) {
        e.preventDefault();
    }
});
