const VALID_USER = { username: 'admin', password: '123456' };

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const err  = document.getElementById('errorMsg');

  if (user === VALID_USER.username && pass === VALID_USER.password) {
    localStorage.setItem('sms_logged_in', 'true');
    localStorage.setItem('sms_user', user);
    window.location.href = 'dashboard.html';
  } else {
    err.textContent = '❌ اسم المستخدم أو كلمة المرور غير صحيحة';
    setTimeout(() => err.textContent = '', 3000);
  }
});
