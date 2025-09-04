
// intelligence_software_company_website/frontend/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            if (mobileMenu) {
                const isHidden = mobileMenu.classList.contains('hidden');
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    mobileMenu.classList.add('block');
                } else {
                    mobileMenu.classList.remove('block');
                    mobileMenu.classList.add('hidden');
                }
            } else {
                alert('移动端菜单功能正在开发中');
            }
        });
    }

    // 表单处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            // 存储到localStorage
            let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
            contacts.push(formData);
            localStorage.setItem('contacts', JSON.stringify(contacts));

            // 清空表单
            contactForm.reset();

            // 显示成功消息
            alert('您的消息已成功提交，我们会尽快与您联系！');
        });
    }

    // 页面切换动画
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href && this.href.includes('.html')) {
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            }
        });
    });

    // 标签页切换
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'text-white');
                btn.classList.add('text-gray-300', 'bg-gray-800');
            });
            
            // 给当前按钮添加active类
            this.classList.add('active', 'text-white');
            this.classList.remove('text-gray-300', 'bg-gray-800');
            
            // 这里可以添加实际的内容切换逻辑
            alert('内容筛选功能正在开发中');
        });
    });

    // 页面加载动画
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');
});

// 粒子效果配置
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#6366f1" },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#4f46e5", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2 }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }
}

// 初始化粒子效果
if (document.getElementById('particles-js')) {
    if (typeof particlesJS === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.onload = initParticles;
        document.head.appendChild(script);
    } else {
        initParticles();
    }
}
