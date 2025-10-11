
  function showForm(formClass) {
    document.querySelectorAll('.Auth > div').forEach(div => {
      div.classList.remove('active');
    });
    document.querySelector(`.${formClass}`).classList.add('active');
  }
  document.querySelector('.Auth-Login span').onclick = () => showForm('Forgot-password');
  document.querySelector('.Auth-Signup span').onclick = () => showForm('Auth-Login');

