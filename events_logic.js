// Event Filtering Logic with Smooth Staggered Animations
document.addEventListener('DOMContentLoaded', () => {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const eventCards = document.querySelectorAll('.event-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Ignore if already active
            if (tab.classList.contains('active')) return;

            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            const category = tab.textContent.trim();

            // 1. Fade out ALL currently visible cards
            const visibleCards = Array.from(eventCards).filter(card => !card.classList.contains('hidden'));

            visibleCards.forEach(card => {
                card.classList.add('animating-out');
            });

            // 2. Wait for fade out to finish (300ms matches CSS transition)
            setTimeout(() => {
                eventCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    // cleanup old classes
                    card.classList.remove('animating-out');

                    // Determine if card should show
                    const shouldShow = (category === 'All') || (cardCategory === category);

                    if (shouldShow) {
                        card.classList.remove('hidden');
                        card.classList.add('animating-in'); // Prepared state (invisible)
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('animating-in');
                    }
                });

                // 3. Trigger reflow to ensure browsers catch the 'animating-in' state
                void document.body.offsetWidth;

                // 4. Staggered Fade In
                const cardsToShow = Array.from(eventCards).filter(card => !card.classList.contains('hidden'));

                cardsToShow.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.remove('animating-in');
                    }, index * 100); // 100ms delay between each card popup
                });

            }, 500); // Wait time for fade out (matches smoother CSS)
        });
    });
});
