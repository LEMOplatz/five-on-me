/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import './index.css';

// Screen containers
const desireScreen = document.getElementById('desire-screen');
const planScreen = document.getElementById('plan-screen');
const logScreen = document.getElementById('log-screen');

// Buttons
const desireButtons = document.querySelectorAll<HTMLButtonElement>('.desire-button');
const startDayButton = document.getElementById('start-day-button');


// Time allocation state
const egoHours: { [key: string]: number } = {
    achiever: 4,
    creator: 4,
    wanderer: 4,
    warrior: 4,
    survivor: 8,
};

const MAX_HOURS = 24;

// Update the displayed hours for all egos
function updateDisplays() {
    for (const ego in egoHours) {
        const display = document.querySelector<HTMLSpanElement>(`.ego-card[data-ego="${ego}"] .time-display`);
        if (display) {
            display.textContent = `${egoHours[ego]} hrs`;
        }
    }
}

// Helper function for screen transitions
function switchScreen(fromScreen: HTMLElement | null, toScreen: HTMLElement | null) {
    if (!fromScreen || !toScreen) return;

    // 1. Fade out the current screen
    fromScreen.classList.add('fade-out');

    // 2. After fade out is complete, hide it and fade in the new one
    fromScreen.addEventListener('animationend', () => {
        fromScreen.classList.add('hidden');
        fromScreen.classList.remove('fade-out');

        toScreen.classList.remove('hidden');
        toScreen.classList.add('fade-in');

        // 3. Clean up the fade-in class after it's done
        toScreen.addEventListener('animationend', () => {
            toScreen.classList.remove('fade-in');
        }, { once: true });

    }, { once: true });
}


// Initialize displays on load
updateDisplays();

// Event listener for desire buttons
desireButtons.forEach(button => {
  button.addEventListener('click', () => {
    desireButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    switchScreen(desireScreen, planScreen);
  });
});


// Event listeners for time allocation buttons
document.querySelectorAll<HTMLDivElement>('.ego-card').forEach(card => {
    const ego = card.dataset.ego;
    if (!ego) return;

    const plusBtn = card.querySelector<HTMLButtonElement>('.plus-btn');
    const minusBtn = card.querySelector<HTMLButtonElement>('.minus-btn');
    
    plusBtn?.addEventListener('click', () => {
        const totalHours = Object.values(egoHours).reduce((sum, h) => sum + h, 0);
        if (totalHours < MAX_HOURS) {
            egoHours[ego]++;
            updateDisplays();
        }
    });

    minusBtn?.addEventListener('click', () => {
        if (egoHours[ego] > 0) {
            egoHours[ego]--;
            updateDisplays();
        }
    });
});

// Event listener for starting the day
startDayButton?.addEventListener('click', () => {
    switchScreen(planScreen, logScreen);
});