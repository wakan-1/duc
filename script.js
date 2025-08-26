// كلمات المرور
const passwords = {
    admin: 'admin123',
    employee: 'emp456'
};

// وظيفة تسجيل الدخول
function login(userType) {
    if (userType === 'visitor') {
        // الزائر لا يحتاج كلمة مرور
        window.location.href = 'visitor.html';
        return;
    }
    
    const passwordInput = document.getElementById(`${userType}-password`);
    const enteredPassword = passwordInput.value.trim();
    const errorMessage = document.getElementById('error-message');
    
    if (!enteredPassword) {
        showError('يرجى إدخال كلمة المرور');
        return;
    }
    
    if (enteredPassword === passwords[userType]) {
        // كلمة المرور صحيحة
        hideError();
        window.location.href = `${userType}.html`;
    } else {
        // كلمة المرور خاطئة
        showError('كلمة المرور غير صحيحة');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// عرض رسالة خطأ
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // إخفاء الرسالة بعد 3 ثوان
    setTimeout(() => {
        hideError();
    }, 3000);
}

// إخفاء رسالة الخطأ
function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.style.display = 'none';
}

// تسجيل الخروج
function logout() {
    window.location.href = 'index.html';
}

// تحميل الملف (محاكاة)
function downloadFile(fileName) {
    alert(`جاري تحميل الملف: ${fileName}\n\nملاحظة: هذا مثال توضيحي. في التطبيق الحقيقي، سيتم تحميل الملف الفعلي.`);
}

// إرسال اقتراح
function submitSuggestion(userType) {
    const suggestionText = document.getElementById(`${userType}-suggestion`).value.trim();
    
    if (!suggestionText) {
        alert('يرجى كتابة اقتراحك قبل الإرسال');
        return;
    }
    
    // محاكاة إرسال الاقتراح
    alert('تم إرسال اقتراحك بنجاح! شكراً لك على مساهمتك في تطوير العمل.');
    
    // مسح النص بعد الإرسال
    document.getElementById(`${userType}-suggestion`).value = '';
}

// التقديم للوظيفة
function applyForJob(jobTitle) {
    alert(`تم اختيار وظيفة: ${jobTitle}\n\nسيتم توجيهك إلى نموذج التقديم...\n\nملاحظة: هذا مثال توضيحي. في التطبيق الحقيقي، سيتم فتح نموذج التقديم الفعلي.`);
}

// شريط الإعلانات المتحرك
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showNextSlide() {
        // إخفاء الشريحة الحالية
        slides[currentSlide].classList.remove('active');
        
        // الانتقال للشريحة التالية
        currentSlide = (currentSlide + 1) % slides.length;
        
        // عرض الشريحة الجديدة
        slides[currentSlide].classList.add('active');
    }
    
    // تغيير الشريحة كل 5 ثوان
    setInterval(showNextSlide, 5000);
}

// السماح بالدخول بالضغط على Enter
document.addEventListener('DOMContentLoaded', function() {
    // تشغيل شريط الإعلانات
    initBannerSlider();
    
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
    
    // إضافة مستمع للضغط على Enter في صناديق الاقتراحات
    const suggestionTextareas = document.querySelectorAll('textarea[id$="-suggestion"]');
    suggestionTextareas.forEach(textarea => {
        textarea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                const userType = this.id.replace('-suggestion', '');
                submitSuggestion(userType);
            }
        });
    });
});

// إضافة تأثيرات بصرية للبطاقات
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.login-card, .file-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// حفظ حالة المستخدم (اختياري)
function saveUserSession(userType) {
    sessionStorage.setItem('currentUser', userType);
    sessionStorage.setItem('loginTime', new Date().toISOString());
}

function getUserSession() {
    return {
        userType: sessionStorage.getItem('currentUser'),
        loginTime: sessionStorage.getItem('loginTime')
    };
}

function clearUserSession() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('loginTime');
}