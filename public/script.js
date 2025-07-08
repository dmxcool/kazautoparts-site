// Загрузка отзывов
async function loadReviews() {
  const res = await fetch('/api/reviews');
  const reviews = await res.json();

  const reviewList = document.querySelector('.review-list');
  reviewList.innerHTML = '';
  reviews.forEach(r => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `<h4>${r.name}</h4><p>${r.message}</p>`;
    reviewList.appendChild(card);
  });
}

loadReviews();

// Отправка отзыва
const form = document.querySelector('.review-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const message = form.message.value.trim();

  if (!name || !message) return;

  await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message })
  });

  form.reset();
  loadReviews();
});
