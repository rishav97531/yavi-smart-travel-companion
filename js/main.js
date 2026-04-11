// Core App Logic
const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Features Data
    const features = [
        { id: 'booking', icon: 'plane', title: 'Booking System', desc: 'Flights, Trains & Hotels in one place.', color: '#0EA5E9' },
        { id: 'explore', icon: 'map', title: 'Destination Explorer', desc: 'Find your next hidden gem with ease.', color: '#F97316' },
        { id: 'planner', icon: 'bot', title: 'AI Travel Planner', desc: 'Personalized day-wise itineraries.', color: '#14B8A6' },
        { id: 'budget', icon: 'wallet', title: 'Budget Tracker', desc: 'Track every penny with smart charts.', color: '#8B5CF6' },
        { id: 'food', icon: 'utensils', title: 'Food & Culture', desc: 'Local delicacies and cultural tips.', color: '#EC4899' },
        { id: 'weather', icon: 'cloud-sun', title: 'Weather Expert', desc: 'Real-time forecasts and rain alerts.', color: '#3B82F6' },
        { id: 'currency', icon: 'coins', title: 'Currency Converter', desc: 'Live rates and cost estimation.', color: '#10B981' },
        { id: 'achievements', icon: 'trophy', title: 'Achievements', desc: 'Earn badges and level up your travel.', color: '#FBBF24' },
        { id: 'journal', icon: 'camera', title: 'Travel Journal', desc: 'Capture and share your memories.', color: '#EF4444' },
        { id: 'nearby', icon: 'map-pin', title: 'Nearby Help', desc: 'GPS-based emergency and food search.', color: '#6366F1' },
        { id: 'safety', icon: 'shield-alert', title: 'Safety SOS', desc: 'Live location sharing and alerts.', color: '#DC2626' },
        { id: 'packing', icon: 'briefcase', title: 'Packing Assistant', desc: 'Smart lists based on your trip.', color: '#14B8A6' },
        { id: 'offline', icon: 'wifi-off', title: 'Offline Mode', desc: 'Access your trips without internet.', color: '#64748B' }
    ];

    // Render Features
    const grid = document.getElementById('features-grid');
    features.forEach(f => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            <i data-lucide="${f.icon}" style="color: ${f.color}"></i>
            <h3>${f.title}</h3>
            <p>${f.desc}</p>
        `;
        card.onclick = () => openModal(f.id);
        grid.appendChild(card);
    });
    lucide.createIcons(); // Refresh icons for injected HTML

    // Initialize Animations
    initAnimations();

    // Initialize Map
    initMap();
});

// Animations with GSAP
function initAnimations() {
    gsap.from('.hero-title', { y: 100, opacity: 0, duration: 1.2, ease: 'power4.out' });
    gsap.from('.hero-subtitle', { y: 50, opacity: 0, duration: 1.2, delay: 0.2, ease: 'power4.out' });
    gsap.from('.hero-btns', { y: 50, opacity: 0, duration: 1.2, delay: 0.4, ease: 'power4.out' });
    gsap.from('.stat-item', { opacity: 0, stagger: 0.2, duration: 1, delay: 0.6 });
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%'
        },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8
    });
}

// Leaflet Map Initialization
function initMap() {
    const map = L.map('main-map').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    // Mock markers
    const spots = [
        { name: 'Paris, France', pos: [48.8566, 2.3522] },
        { name: 'Tokyo, Japan', pos: [35.6762, 139.6503] },
        { name: 'New York, USA', pos: [40.7128, -74.0060] }
    ];

    spots.forEach(s => {
        const marker = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: var(--primary); width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 10px var(--primary);"></div>`
        });
        L.marker(s.pos, { icon: marker }).addTo(map).bindPopup(s.name);
    });
}

// Modal Handling
const modal = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');

function openModal(featureId) {
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
    renderFeatureContent(featureId);
}

function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
        modalContent.innerHTML = '';
    }, 300);
}

document.querySelector('.close-modal').addEventListener('click', closeModal);
window.onclick = (e) => { if(e.target == modal) closeModal(); };

// Feature Content Router
function renderFeatureContent(id) {
    switch(id) {
        case 'booking': renderBooking(); break;
        case 'weather': renderWeather(); break;
        case 'budget': renderBudget(); break;
        case 'planner': renderPlanner(); break;
        case 'explore': renderExplore(); break;
        case 'food': renderFood(); break;
        case 'safety': renderSafety(); break;
        case 'currency': renderCurrency(); break;
        case 'journal': renderJournal(); break;
        case 'achievements': renderAchievements(); break;
        case 'nearby': renderNearby(); break;
        case 'packing': renderPacking(); break;
        case 'offline': renderOffline(); break;
        default:
            modalContent.innerHTML = `<h2>${id.toUpperCase()}</h2><p>Feature module under construction. Stay tuned!</p>`;
    }
    lucide.createIcons();
}

// --- Specific Feature Renders (Placeholders to be expanded) ---

function renderBooking() {
    modalContent.innerHTML = `
        <div class="booking-module">
            <h2>Book Your <span class="gradient-text">Next Journey</span></h2>
            <div class="tabs">
                <button class="active">Flights</button>
                <button>Trains</button>
                <button>Hotels</button>
            </div>
            <div class="booking-form">
                <div class="form-group">
                    <label>From</label>
                    <input type="text" placeholder="Origin City">
                </div>
                <div class="form-group">
                    <label>To</label>
                    <input type="text" placeholder="Destination City">
                </div>
                <button class="primary-btn">Search Flights</button>
            </div>
            <div class="results-grid">
                <p class="dim-text">Showing mock results for demonstration...</p>
                <div class="result-card glass">
                    <div class="airline">SkyHigh Airways</div>
                    <div class="time">10:00 AM - 2:00 PM</div>
                    <div class="price">$299</div>
                </div>
            </div>
        </div>
    `;
}

function renderWeather() {
    modalContent.innerHTML = `
        <div class="weather-module">
            <h2>Weather <span class="gradient-text">Forecast</span></h2>
            <div class="weather-search">
                <input type="text" id="city-input" placeholder="Enter city name (e.g. London, Tokyo)...">
                <button class="primary-btn" id="search-weather-btn">Search</button>
            </div>
            <div id="weather-result" class="weather-card">
                <p>Search for a city to see real-time data.</p>
            </div>
        </div>
    `;

    document.getElementById('search-weather-btn').onclick = () => {
        const city = document.getElementById('city-input').value;
        if (city) fetchWeather(city);
    };
}

async function fetchWeather(city) {
    const resultDiv = document.getElementById('weather-result');
    resultDiv.innerHTML = '<p>Fetching data from TrekAI server...</p>';
    
    try {
        // Fetch weather through our backend proxy
        const res = await fetch(`${API_BASE_URL}/weather?city=${city}`);
        const weatherData = await res.json();
        
        if (res.status !== 200) {
            resultDiv.innerHTML = `<p>${weatherData.message || 'Error fetching weather.'}</p>`;
            return;
        }
        
        resultDiv.innerHTML = `
            <h3>${weatherData.city}</h3>
            <div class="weather-main">${weatherData.temp}°C</div>
            <p class="dim-text">${weatherData.description}</p>
            <div class="weather-details">
                <div class="detail-item"><strong>Humidity</strong><p>${weatherData.humidity}%</p></div>
                <div class="detail-item"><strong>Wind</strong><p>${weatherData.windSpeed} km/h</p></div>
                <div class="detail-item"><strong>Cond.</strong><p>Clear</p></div>
            </div>
        `;
    } catch (err) {
        resultDiv.innerHTML = '<p>Error connecting to backend server. Make sure it is running on port 5001.</p>';
    }
}

// Global scope helpers
window.scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};

function renderBudget() {
    const tripId = '65f123abc456def789012345'; // Placeholder Trip ID for demo
    
    modalContent.innerHTML = `
        <div class="budget-module">
            <h2>Budget <span class="gradient-text">Tracker</span></h2>
            <div class="budget-summary">
                <div class="stat"><h3>Total Spent</h3><p id="total-spent">$0</p></div>
                <div class="stat"><h3>Remaining</h3><p id="total-rem">$5,000</p></div>
            </div>
            <canvas id="budgetChart" width="400" height="200"></canvas>
            <div class="add-expense">
                <input type="text" id="exp-desc" placeholder="Description">
                <input type="number" id="exp-amt" placeholder="Amount">
                <select id="exp-cat">
                    <option value="Food">Food</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Travel">Travel</option>
                    <option value="Fun">Fun</option>
                </select>
                <button class="primary-btn" id="add-exp-btn">Add Expense</button>
            </div>
            <div id="expense-list" style="margin-top: 2rem;">
                <p class="dim-text">Loading past expenses...</p>
            </div>
        </div>
    `;
    
    const refreshBudget = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/budget/${tripId}`);
            const expenses = await res.json();
            
            const total = expenses.reduce((sum, e) => sum + e.amount, 0);
            document.getElementById('total-spent').innerText = `$${total.toLocaleString()}`;
            document.getElementById('total-rem').innerText = `$${(5000 - total).toLocaleString()}`;
            
            // Build Chart
            const cats = ['Food', 'Hotel', 'Travel', 'Fun'];
            const dataMap = cats.map(c => expenses.filter(e => e.category === c).reduce((sum, e) => sum + e.amount, 0));
            
            const ctx = document.getElementById('budgetChart').getContext('2d');
            if (window.myChart) window.myChart.destroy();
            window.myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: cats,
                    datasets: [{
                        data: dataMap,
                        backgroundColor: ['#0EA5E9', '#F97316', '#14B8A6', '#8B5CF6'],
                        borderWidth: 0
                    }]
                },
                options: { plugins: { legend: { labels: { color: 'white' } } } }
            });

            // List
            document.getElementById('expense-list').innerHTML = expenses.map(e => `
                <div class="result-card glass" style="margin-bottom: 0.5rem; padding: 0.8rem;">
                    <div>${e.description} <span>(${e.category})</span></div>
                    <div class="price" style="font-size: 1.1rem;">$${e.amount}</div>
                </div>
            `).join('') || '<p class="dim-text">No expenses added yet.</p>';

        } catch (err) {
            console.error('Error fetching budget:', err);
        }
    };

    document.getElementById('add-exp-btn').onclick = async () => {
        const desc = document.getElementById('exp-desc').value;
        const amount = document.getElementById('exp-amt').value;
        const category = document.getElementById('exp-cat').value;

        if (!desc || !amount) return;

        try {
            await fetch(`${API_BASE_URL}/budget/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tripId, description: desc, amount: Number(amount), category })
            });
            document.getElementById('exp-desc').value = '';
            document.getElementById('exp-amt').value = '';
            refreshBudget();
        } catch (err) {
            alert('Error saving expense to backend.');
        }
    };

    setTimeout(refreshBudget, 100);
}

function renderExplore() {
    modalContent.innerHTML = `
        <div class="explore-module">
            <h2>Destination <span class="gradient-text">Explorer</span></h2>
            <div class="explore-grid">
                <div class="dest-card glass">
                    <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400" alt="Paris" style="width:100%; border-radius:12px; margin-bottom:1rem;">
                    <h4>Paris, France</h4>
                    <p>The city of light and romance.</p>
                    <div class="rating">⭐ 4.9 (12k reviews)</div>
                </div>
                <div class="dest-card glass">
                    <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400" alt="Tokyo" style="width:100%; border-radius:12px; margin-bottom:1rem;">
                    <h4>Tokyo, Japan</h4>
                    <p>Where tradition meets the future.</p>
                    <div class="rating">⭐ 4.8 (8k reviews)</div>
                </div>
            </div>
        </div>
    `;
}

function renderFood() {
    modalContent.innerHTML = `
        <div class="food-module">
            <h2>Food & <span class="gradient-text">Culture</span></h2>
            <div class="culture-section">
                <h3>Regional Specialties</h3>
                <div class="food-grid">
                    <div class="food-item">🍱 Sushi (Japan)</div>
                    <div class="food-item">🍝 Pasta (Italy)</div>
                    <div class="food-item">🍛 Curry (India)</div>
                </div>
            </div>
            <div class="language-tips" style="margin-top:2rem;">
                <h3>Local Phrases</h3>
                <p><strong>Hello:</strong> Kon'nichiwa (Japan), Bonjour (France)</p>
                <p><strong>Thank you:</strong> Arigatō (Japan), Merci (France)</p>
            </div>
        </div>
    `;
}

function renderSafety() {
    modalContent.innerHTML = `
        <div class="safety-module">
            <h2>Safety <span class="gradient-text">Center</span></h2>
            <div class="sos-box" style="background: rgba(220, 38, 38, 0.1); border: 1px solid #dc2626; padding: 2rem; border-radius: 20px; text-align: center; margin-bottom: 2rem;">
                <i data-lucide="shield-alert" style="color: #dc2626; width: 4rem; height: 4rem;"></i>
                <h3 style="color: #dc2626; margin-top: 1rem;">SOS Emergency</h3>
                <p>Press and hold for 3 seconds to share live location with emergency contacts.</p>
                <button class="primary-btn" style="background: #dc2626; margin-top: 1rem;">TRIGGER SOS</button>
            </div>
            <div class="emergency-contacts">
                <h3>Local Emergency Numbers</h3>
                <ul>
                    <li>🚑 Ambulance: 102</li>
                    <li>🚒 Fire: 101</li>
                    <li>👮 Police: 100</li>
                </ul>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderCurrency() {
    modalContent.innerHTML = `
        <div class="currency-module">
            <h2>Currency <span class="gradient-text">Converter</span></h2>
            <div class="converter-box glass" style="padding: 2rem; border-radius: 20px;">
                <div class="form-group">
                    <label>Amount (USD)</label>
                    <input type="number" id="usd-input" value="1" style="width:100%;">
                </div>
                <div class="results" style="margin-top: 2rem;">
                    <p><strong>EUR:</strong> <span id="eur-val">0.92</span></p>
                    <p><strong>GBP:</strong> <span id="gbp-val">0.79</span></p>
                    <p><strong>INR:</strong> <span id="inr-val">83.25</span></p>
                    <p><strong>JPY:</strong> <span id="jpy-val">151.70</span></p>
                </div>
            </div>
            <p class="dim-text" style="margin-top: 1rem;">Live rates updated via mock logic.</p>
        </div>
    `;
    
    document.getElementById('usd-input').oninput = (e) => {
        const val = e.target.value;
        document.getElementById('eur-val').innerText = (val * 0.92).toFixed(2);
        document.getElementById('gbp-val').innerText = (val * 0.79).toFixed(2);
        document.getElementById('inr-val').innerText = (val * 83.25).toFixed(2);
        document.getElementById('jpy-val').innerText = (val * 151.70).toFixed(2);
    };
}

function renderPlanner() {
    modalContent.innerHTML = `
        <div class="planner-module">
            <h2>AI <span class="gradient-text">Itinerary Planner</span></h2>
            <div class="planner-form">
                <div class="form-group"><label>Destination</label><input type="text" id="plan-dest" placeholder="e.g. Bali, Indonesia"></div>
                <div class="form-group"><label>Days</label><input type="number" id="plan-days" value="3"></div>
                <div class="form-group"><label>Budget</label><select id="plan-budget"><option>Economy</option><option>Moderate</option><option>Luxury</option></select></div>
                <button class="primary-btn" id="generate-plan-btn">Generate Plan</button>
            </div>
            <div id="itinerary-result" class="itinerary-preview">
                <p class="dim-text">Fill the form and hit generate to see the magic.</p>
            </div>
        </div>
    `;

    document.getElementById('generate-plan-btn').onclick = async () => {
        const dest = document.getElementById('plan-dest').value;
        const days = document.getElementById('plan-days').value;
        const budget = document.getElementById('plan-budget').value;
        const resultDiv = document.getElementById('itinerary-result');

        if (!dest) return alert('Please enter a destination');

        resultDiv.innerHTML = '<div class="loading-spinner">✨ AI is crafting your dream trip...</div>';

        try {
            const res = await fetch(`${API_BASE_URL}/itinerary/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destination: dest, days, budget })
            });
            const data = await res.json();
            
            // Expected data format: { itinerary: [{ day: 1, title: '...', activities: [...] }] }
            const itinerary = data.itinerary || data; 
            
            resultDiv.innerHTML = itinerary.map(d => `
                <div class="day-card" style="margin-bottom: 1.5rem;">
                    <h4>Day ${d.day}: ${d.title}</h4>
                    <p>${Array.isArray(d.activities) ? d.activities.join(' • ') : d.activities}</p>
                </div>
            `).join('');
        } catch (err) {
            resultDiv.innerHTML = '<p>Error generating itinerary. Check if OpenAI API key is set in backend .env</p>';
        }
    };
}

function renderJournal() {
    modalContent.innerHTML = `
        <div class="journal-module">
            <h2>Travel <span class="gradient-text">Journal</span></h2>
            <div class="journal-entry glass" style="padding: 2rem; border-radius: 20px; margin-bottom: 2rem;">
                <input type="text" placeholder="Entry Title" style="width:100%; font-size: 1.5rem; margin-bottom: 1rem; background:transparent; border:none; color:white; border-bottom:1px solid var(--glass-border);">
                <textarea placeholder="Write your memories here..." style="width:100%; height: 150px; background:transparent; border:none; color:var(--text-dim); font-size: 1.1rem; outline:none; resize:none;"></textarea>
                <div class="journal-actions" style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
                    <button class="secondary-btn"><i data-lucide="camera" style="width:1.2rem; vertical-align:middle;"></i> Add Photo</button>
                    <button class="primary-btn">Save Entry</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderAchievements() {
    modalContent.innerHTML = `
        <div class="achievements-module">
            <h2>Travel <span class="gradient-text">Achievements</span></h2>
            <div class="badge-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top:2rem;">
                <div class="badge-item glass" style="padding: 1.5rem; border-radius: 20px; text-align: center;">
                    <i data-lucide="award" style="color: #FBBF24; width:3rem; height:3rem; margin-bottom:1rem;"></i>
                    <h4>Early Bird</h4>
                    <p class="dim-text">Booked 30 days ahead.</p>
                </div>
                <div class="badge-item glass" style="padding: 1.5rem; border-radius: 20px; text-align: center; opacity: 0.5;">
                    <i data-lucide="globe" style="color: #0EA5E9; width:3rem; height:3rem; margin-bottom:1rem;"></i>
                    <h4>World Citizen</h4>
                    <p class="dim-text">Visit 5 countries.</p>
                </div>
                <div class="badge-item glass" style="padding: 1.5rem; border-radius: 20px; text-align: center;">
                    <i data-lucide="camera" style="color: #EC4899; width:3rem; height:3rem; margin-bottom:1rem;"></i>
                    <h4>Shutterbug</h4>
                    <p class="dim-text">Upload 50 photos.</p>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderNearby() {
    modalContent.innerHTML = `
        <div class="nearby-module">
            <h2>Nearby <span class="gradient-text">Recommendations</span></h2>
            <p class="dim-text">Based on your current GPS location.</p>
            <div class="nearby-list" style="margin-top: 2rem;">
                <div class="nearby-item glass" style="padding: 1rem; border-radius: 12px; margin-bottom: 1rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h4>Blue Lagoon Restaurant</h4>
                        <p class="dim-text">0.5 km away • Seafood</p>
                    </div>
                    <button class="secondary-btn">Direct</button>
                </div>
                <div class="nearby-item glass" style="padding: 1rem; border-radius: 12px; margin-bottom: 1rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h4>City Central Hospital</h4>
                        <p class="dim-text">1.2 km away • 24/7</p>
                    </div>
                    <button class="secondary-btn" style="color:#ef4444;">SOS</button>
                </div>
            </div>
        </div>
    `;
}

function renderPacking() {
    modalContent.innerHTML = `
        <div class="packing-module">
            <h2>Packing <span class="gradient-text">Assistant</span></h2>
            <div class="packing-list glass" style="padding: 2rem; border-radius: 20px; margin-top:2rem;">
                <div class="checklist-item" style="margin-bottom:1rem; display:flex; gap:1rem; align-items:center;">
                    <input type="checkbox" checked> <span>Passport & Visa</span>
                </div>
                <div class="checklist-item" style="margin-bottom:1rem; display:flex; gap:1rem; align-items:center;">
                    <input type="checkbox"> <span>Universal Adapter</span>
                </div>
                <div class="checklist-item" style="margin-bottom:1rem; display:flex; gap:1rem; align-items:center;">
                    <input type="checkbox"> <span>Sunscreen & Shades</span>
                </div>
                <button class="primary-btn" style="width:100%; margin-top:1rem;">Add Custom Item</button>
            </div>
        </div>
    `;
}

function renderOffline() {
    modalContent.innerHTML = `
        <div class="offline-module">
            <h2>Offline <span class="gradient-text">Mode</span></h2>
            <div class="offline-status" style="text-align:center; padding: 3rem;">
                <i data-lucide="wifi-off" style="width:4rem; height:4rem; color:var(--text-dim);"></i>
                <h3 style="margin-top:1.5rem;">You are Ready for Offline</h3>
                <p class="dim-text" style="max-width: 300px; margin: 1rem auto;">Your saved trips and documents will be available even without an internet connection.</p>
                <button class="primary-btn">Download All Data</button>
            </div>
        </div>
    `;
    lucide.createIcons();
}
