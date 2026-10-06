// Появление: герой сразу, остальное при входе в экран
const rises = document.querySelectorAll('.rise');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
rises.forEach((el) => io.observe(el));

// Шапка получает фон после героя-экрана
const header = document.getElementById('top');
const onScroll = () => header.classList.toggle('is-solid', scrollY > innerHeight * 0.6);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Клик по строке топлива подставляет его в форму
document.querySelectorAll('[data-fuel]').forEach((a) => {
  a.addEventListener('click', () => { document.getElementById('fuelSelect').value = a.dataset.fuel; });
});

// Макет: отправка отключена
document.getElementById('orderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const phone = e.target.phone.value.replace(/\D/g, '');
  const status = document.getElementById('formStatus');
  status.textContent = phone.length < 10
    ? 'Укажите телефон, чтобы мы могли перезвонить.'
    : 'Макет: заявка не отправляется. В рабочей версии она уйдёт диспетчеру.';
});
