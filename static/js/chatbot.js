// DDK-i Chatbot JavaScript
class DDKChatbot {
    constructor() {
        this.currentLanguage = 'en';
        this.chatStage = 'initial';
        this.userName = '';
        this.isOpen = false;
        
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
                contactPrompt: "Would you like to speak with our human team? <i class='ri-whatsapp-line'></i> WhatsApp us at +91-8820746227 or email ddktech.manager@gmail.com"
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
                contactPrompt: "আপনি কি আমাদের মানুষের টিমের সাথে কথা বলতে চান? <i class='ri-whatsapp-line'></i> আমাদের হোয়াটসঅ্যাপ করুন +91-8820746227 বা ইমেইল করুন ddktech.manager@gmail.com"
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
        document.getElementById('chatForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Input field enter key
        ['clientId', 'userName', 'userQuery'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleFormSubmit();
                    }
                });
            }
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatWindow');
        const chatButton = document.getElementById('chatButton');
        
        if (this.isOpen) {
            chatWindow.classList.remove('open');
            chatButton.style.display = 'flex';
            this.isOpen = false;
        } else {
            chatWindow.classList.add('open');
            chatButton.style.display = 'none';
            this.isOpen = true;
            
            // Focus on current input if available
            this.focusCurrentInput();
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
        
        document.getElementById('welcomeMessage').textContent = texts.welcome;
        document.getElementById('questionText').textContent = texts.question;
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

    async handleClientId() {
        const clientId = document.getElementById('clientId').value.trim();
        if (!clientId) return;

        this.addUserMessage(clientId);
        this.showLoading();

        try {
            const response = await fetch('/api/check_client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ client_id: clientId })
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

            // Hide client ID input
            document.getElementById('clientIdInput').classList.add('hidden');
            this.chatStage = 'completed';

        } catch (error) {
            console.error('Error checking client:', error);
            this.hideLoading();
            this.addBotMessage(this.texts[this.currentLanguage].errorMessage);
        }
    }

    handleName() {
        const name = document.getElementById('userName').value.trim();
        if (!name) return;

        this.userName = name;
        this.addUserMessage(name);
        this.addBotMessage(this.texts[this.currentLanguage].greeting(name));

        // Hide name input and show query input
        document.getElementById('nameInput').classList.add('hidden');
        this.showQueryInput();
        this.chatStage = 'query';
    }

    async handleQuery() {
        const query = document.getElementById('userQuery').value.trim();
        if (!query) return;

        this.addUserMessage(query);
        this.showLoading();

        try {
            const response = await fetch('/api/get_service_info', {
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
        messageDiv.className = 'message user-message fade-in';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="ri-user-line"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(text)}</div>
                <div class="message-time">Now</div>
            </div>
        `;

        this.appendMessage(messageDiv);
    }

    addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message fade-in';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="ri-robot-line"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(text)}</div>
                <div class="message-time">Now</div>
            </div>
        `;

        this.appendMessage(messageDiv);
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
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message fade-in';
        
        const clientInfoHtml = `
            <div class="client-info">
                <h4>${this.currentLanguage === 'en' ? 'Client Information' : 'ক্লায়েন্ট তথ্য'}</h4>
                <div class="client-info-item">
                    <span class="client-info-label">${this.currentLanguage === 'en' ? 'Name' : 'নাম'}:</span>
                    <span class="client-info-value">${clientInfo.name}</span>
                </div>
                <div class="client-info-item">
                    <span class="client-info-label">${this.currentLanguage === 'en' ? 'Project' : 'প্রকল্প'}:</span>
                    <span class="client-info-value">${clientInfo.project_name}</span>
                </div>
                <div class="client-info-item">
                    <span class="client-info-label">${this.currentLanguage === 'en' ? 'Renewal Date' : 'নবায়ন তারিখ'}:</span>
                    <span class="client-info-value">${clientInfo.renewal_date}</span>
                </div>
                <div class="client-info-item">
                    <span class="client-info-label">${this.currentLanguage === 'en' ? 'Pending Amount' : 'বকেয়া টাকা'}:</span>
                    <span class="client-info-value">${clientInfo.pending_amount}</span>
                </div>
                <div class="client-info-item">
                    <span class="client-info-label">${this.currentLanguage === 'en' ? 'Status' : 'অবস্থা'}:</span>
                    <span class="client-info-value">${clientInfo.status}</span>
                </div>
                <div class="client-info-item">
                    <span class="client-info-label">${this.currentLanguage === 'en' ? 'Last Update' : 'শেষ আপডেট'}:</span>
                    <span class="client-info-value">${clientInfo.last_update}</span>
                </div>
            </div>
        `;

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="ri-robot-line"></i>
            </div>
            <div class="message-content">
                ${clientInfoHtml}
                <div class="message-time">Now</div>
            </div>
        `;

        this.appendMessage(messageDiv);
    }

    displayServiceInfo(serviceInfo, serviceType) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message fade-in';
        
        const serviceInfoHtml = `
            <div class="service-info">
                <h5>${this.getServiceTitle(serviceType)}</h5>
                <p>${serviceInfo}</p>
            </div>
        `;

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
