// كلمات المرور
const passwords = {
    admin: 'admin123',
    employee: 'emp456'
};

// نظام الجلسات
const sessionManager = {
    // إنشاء جلسة جديدة
    createSession: function(userType) {
        const sessionId = this.generateSessionId();
        const sessionData = {
            userType: userType,
            sessionId: sessionId,
            timestamp: Date.now(),
            expires: Date.now() + (30 * 60 * 1000) // 30 دقيقة
        };
        
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        return sessionId;
    },
    
    // التحقق من صحة الجلسة
    validateSession: function(requiredType) {
        const sessionData = this.getSession();
        if (!sessionData) return false;
        
        // التحقق من انتهاء الصلاحية
        if (Date.now() > sessionData.expires) {
            this.clearSession();
            return false;
        }
        
        // التحقق من نوع المستخدم
        if (requiredType && sessionData.userType !== requiredType) {
            return false;
        }
        
        // تحديث وقت الجلسة
        sessionData.timestamp = Date.now();
        sessionData.expires = Date.now() + (30 * 60 * 1000);
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        
        return true;
    },
    
    // الحصول على بيانات الجلسة
    getSession: function() {
        try {
            const sessionData = localStorage.getItem('userSession');
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (e) {
            return null;
        }
    },
    
    // مسح الجلسة
    clearSession: function() {
        localStorage.removeItem('userSession');
    },
    
    // توليد معرف جلسة فريد
    generateSessionId: function() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
};

// دالة تسجيل الدخول
function login(userType) {
    const errorDiv = document.getElementById('error-message');
    
    if (userType === 'visitor') {
        // الزائر لا يحتاج كلمة مرور
        sessionManager.createSession('visitor');
        window.location.href = 'visitor.html';
        return;
    }
    
    const passwordInput = document.getElementById(userType + '-password');
    const enteredPassword = passwordInput.value;
    
    if (!enteredPassword) {
        showError('يرجى إدخال كلمة المرور');
        return;
    }
    
    if (enteredPassword === passwords[userType]) {
        sessionManager.createSession(userType);
        window.location.href = userType + '.html';
    } else {
        showError('كلمة المرور غير صحيحة');
        passwordInput.value = '';
    }
}

// عرض رسالة خطأ
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// دالة تسجيل الخروج
function logout() {
    sessionManager.clearSession();
    window.location.href = 'index.html';
}

// التحقق من الحماية عند تحميل الصفحة
function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // الصفحات التي تحتاج حماية
    const protectedPages = {
        'admin.html': 'admin',
        'employee.html': 'employee',
        'visitor.html': 'visitor'
    };
    
    if (protectedPages[currentPage]) {
        const requiredType = protectedPages[currentPage];
        if (!sessionManager.validateSession(requiredType)) {
            alert('انتهت صلاحية الجلسة أو لا تملك صلاحية للوصول');
            window.location.href = 'index.html';
            return false;
        }
    }
    
    return true;
}

// دالة تحميل الملفات
function downloadFile(filename) {
    const link = document.createElement('a');
    link.href = 'files/' + filename;
    link.download = filename;
    link.click();
    
    showNotification('تم بدء تحميل الملف: ' + filename);
}

// دالة إرسال الاقتراحات
function submitSuggestion(userType) {
    const textareaId = userType + '-suggestion';
    const textarea = document.getElementById(textareaId);
    const suggestion = textarea.value.trim();
    
    if (!suggestion) {
        showNotification('يرجى كتابة اقتراحك أولاً', 'error');
        return;
    }
    
    // هنا يمكن إضافة كود لإرسال الاقتراح للخادم
    console.log('اقتراح من ' + userType + ': ' + suggestion);
    
    textarea.value = '';
    showNotification('تم إرسال اقتراحك بنجاح! شكراً لك');
}

// دالة التقديم للوظائف
function applyForJob(jobTitle) {
    showNotification('سيتم توجيهك لنموذج التقديم لوظيفة: ' + jobTitle);
    // هنا يمكن إضافة كود لفتح نموذج التقديم
}

// دالة عرض الإشعارات
function showNotification(message, type = 'success') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : '#28a745'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// دالة شريط الإعلانات المتحرك
function initBannerSlider() {
    const slider = document.getElementById('banner-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.banner-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // تغيير الشريحة كل 5 ثوان
    setInterval(nextSlide, 5000);
}

// منع النسخ واللصق في حقول كلمة المرور
function preventCopyPaste() {
    const passwordInputs = document.querySelectorAll('.password-input');
    
    passwordInputs.forEach(input => {
        // منع النسخ واللصق
        input.addEventListener('copy', e => e.preventDefault());
        input.addEventListener('paste', e => e.preventDefault());
        input.addEventListener('cut', e => e.preventDefault());
        
        // منع القائمة السياقية
        input.addEventListener('contextmenu', e => e.preventDefault());
        
        // منع السحب والإفلات
        input.addEventListener('dragstart', e => e.preventDefault());
        input.addEventListener('drop', e => e.preventDefault());
    });
}

// تشغيل الدوال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من الحماية
    checkPageAccess();
    
    // تشغيل شريط الإعلانات
    initBannerSlider();
    
    // منع النسخ واللصق
    preventCopyPaste();
    
    // إضافة مستمع للضغط على Enter في حقول كلمة المرور
    const passwordInputs = document.querySelectorAll('.password-input');
    passwordInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const userType = this.id.replace('-password', '');
                login(userType);
            }
        });
    });
});

// التحقق من الجلسة كل دقيقة
setInterval(() => {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['admin.html', 'employee.html', 'visitor.html'];
    
    if (protectedPages.includes(currentPage)) {
        if (!sessionManager.validateSession()) {
            alert('انتهت صلاحية الجلسة');
            window.location.href = 'index.html';
        }
    }
}, 60000); // كل دقيقة
