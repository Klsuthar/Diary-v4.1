class UI {
    constructor(storage) {
        this.storage = storage;
        this.currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        this.referenceDate = new Date('2000-01-01'); // Epoch for day_id

        this.initElements();
        this.initEventListeners();

        // Initial Render
        this.loadEntry(this.currentDate);
        this.updateDateDisplay();
    }

    initElements() {
        // Navigation
        this.tabs = document.querySelectorAll('.tab-content');
        this.navItems = document.querySelectorAll('.nav-item');

        // Date Controls
        this.dateDisplay = document.getElementById('display-date');
        this.weekdayDisplay = document.getElementById('display-weekday');
        this.prevDateBtn = document.getElementById('prev-date');
        this.nextDateBtn = document.getElementById('next-date');
        this.saveBtn = document.getElementById('save-btn');
        this.entryDateInput = document.getElementById('entry-date');
        this.dayCounter = document.getElementById('day-counter');

        // Inputs (Mapping IDs to Data Structure paths implicitly via collection logic)
        // We will select them dynamically in collectData() usually, or cache them here if performance needed.
        // For PWA, direct selection is fine.
    }

    initEventListeners() {
        // Tab Switching
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = item.getAttribute('data-target');
                this.switchTab(targetId);
            });
        });

        // Date Interaction
        this.prevDateBtn.addEventListener('click', () => this.changeDate(-1));
        this.nextDateBtn.addEventListener('click', () => this.changeDate(1));

        this.entryDateInput.addEventListener('change', (e) => {
            if (e.target.value) {
                this.currentDate = e.target.value;
                this.loadEntry(this.currentDate);
                this.updateDateDisplay();
            }
        });

        // Save
        this.saveBtn.addEventListener('click', () => {
            this.saveCurrentEntry();
            alert('Entry Saved!');
        });

        // Search History
        const searchInput = document.getElementById('search-history');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.renderHistory(e.target.value));
        }

        // Accordion
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });

        // Meditation conditional
        document.getElementById('meditation-status').addEventListener('change', (e) => {
            const group = document.getElementById('meditation-duration-group');
            if (e.target.value === 'Yes') group.classList.remove('hidden');
            else group.classList.add('hidden');
        });

        // Summary Counters
        ['daily-summary', 'overall-exp'].forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                const count = e.target.value.length;
                const counterId = id === 'daily-summary' ? 'summary-count' : 'exp-count';
                document.getElementById(counterId).innerText = `(${count} chars)`;
            });
        });

        // UV Slider
        document.getElementById('uv-index').addEventListener('input', (e) => {
            document.getElementById('uv-val').innerText = e.target.value;
        });
    }

    switchTab(tabId) {
        // Update Classes
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.navItems.forEach(item => item.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        const activeNav = document.querySelector(`.nav-item[data-target="${tabId}"]`);
        if (activeNav) activeNav.classList.add('active');

        // If History tab, render list
        if (tabId === 'tab-history') {
            this.renderHistory();
        }
    }

    changeDate(days) {
        const date = new Date(this.currentDate);
        date.setDate(date.getDate() + days);
        this.currentDate = date.toISOString().split('T')[0];
        this.loadEntry(this.currentDate);
        this.updateDateDisplay();
    }

    updateDateDisplay() {
        const dateObj = new Date(this.currentDate);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        this.dateDisplay.innerText = dateObj.toLocaleDateString('en-US', options);
        this.weekdayDisplay.innerText = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        this.entryDateInput.value = this.currentDate;

        // Day ID Calculation
        const diffTime = Math.abs(dateObj - this.referenceDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.dayCounter.innerText = diffDays;
    }

    // -------------------------------------------------------------------------
    // DATA COLLECTION (TO JSON)
    // -------------------------------------------------------------------------
    collectData() {
        const getVal = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : "";
        };
        const getNum = (id) => {
            const val = getVal(id);
            return val === "" ? null : Number(val);
        };

        // Helper for mood timeline
        const getMoodParams = (period) => {
            const levelEl = document.querySelector(`.mood-level[data-period="${period}"]`);
            const feelEl = document.querySelector(`.mood-feeling[data-period="${period}"]`);
            return {
                mood_level: levelEl && levelEl.value ? Number(levelEl.value) : null,
                mood_feeling: feelEl ? feelEl.value : ""
            };
        };

        // Helper for apps
        const getApps = () => {
            const apps = [];
            const rows = document.querySelectorAll('.app-row');
            rows.forEach((row, index) => {
                const name = row.querySelector('.app-name').value;
                const time = row.querySelector('.app-time').value;
                apps.push({
                    rank: index + 1,
                    name: name,
                    time: time
                });
            });
            return apps;
        };

        const dateObj = new Date(this.currentDate);
        const diffTime = Math.abs(dateObj - this.referenceDate);
        const dayId = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            version: "4.0",
            date: this.currentDate,
            day_id: dayId,
            weekday: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),

            environment: {
                temperature_c: getVal('temperature'),
                air_quality_index: getNum('aqi'),
                humidity_percent: getNum('humidity'),
                uv_index: getNum('uv-index'),
                weather_condition: getVal('weather-condition'),
                environment_experience: getVal('env-experience')
            },

            body_measurements: {
                weight_kg: getNum('weight'),
                height_cm: getNum('height'),
                chest: getNum('chest'),
                belly: getNum('belly')
            },

            health_and_fitness: {
                sleep_hours: getVal('sleep-hours'),
                sleep_quality: getNum('sleep-quality'),
                sleep_quality_description: getVal('sleep-desc'),
                steps_count: getNum('steps-count'),
                steps_distance_km: getNum('distance-km'),
                kilocalorie: getNum('calories'),
                water_intake_liters: getNum('water-intake'),
                medications_taken: getVal('medications'),
                physical_symptoms: getVal('symptoms'),
                energy_level: getNum('energy-level'),
                stress_level: getNum('stress-level'),
                energy_stress_reason: getVal('energy-stress-reason')
            },

            mental_and_emotional_health: {
                mental_state: getVal('mental-state'),
                mental_state_reason: getVal('mental-state-reason'),
                mood_timeline: {
                    morning: getMoodParams('morning'),
                    afternoon: getMoodParams('afternoon'),
                    evening: getMoodParams('evening'),
                    night: getMoodParams('night')
                },
                meditation_status: getVal('meditation-status'),
                meditation_duration_min: getVal('meditation-status') === 'Yes' ? getNum('meditation-duration') : null
            },

            personal_care: {
                face_product_name: getVal('face-name'),
                face_product_brand: getVal('face-brand'),
                hair_product_name: getVal('hair-name'),
                hair_product_brand: getVal('hair-brand'),
                hair_oil: getVal('hair-oil'),
                skincare_routine: getVal('skincare-routine')
            },

            diet_and_nutrition: {
                breakfast: getVal('breakfast'),
                lunch: getVal('lunch'),
                dinner: getVal('dinner'),
                additional_items: getVal('snacks')
            },

            activities_and_productivity: {
                tasks_today_english: getVal('tasks-completed'),
                travel_destination: getVal('travel-dest'),
                phone_screen_on_hr: getVal('screen-time'),
                most_used_apps: getApps(),
                app_usage_intent: getVal('app-usage-intent')
            },

            additional_notes: {
                key_events: getVal('key-events'),
                other_note_status: getVal('other-notes-status')
            },

            daily_activity_summary: getVal('daily-summary'),
            overall_day_experience: getVal('overall-exp')
        };
    }

    // -------------------------------------------------------------------------
    // DATA RENDERING (FROM JSON)
    // -------------------------------------------------------------------------
    loadEntry(date) {
        // Clear forms first? Or just overwrite. Overwrite is cleaner.
        // But need to handle "empty" new day.

        let data = this.storage.getEntry(date);

        if (!data) {
            this.resetForms();
            return;
        }

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = (val === null || val === undefined) ? "" : val;
        };

        // Environment
        if (data.environment) {
            setVal('weather-condition', data.environment.weather_condition);
            setVal('temperature', data.environment.temperature_c);
            setVal('aqi', data.environment.air_quality_index);
            setVal('humidity', data.environment.humidity_percent);
            setVal('uv-index', data.environment.uv_index);
            if (document.getElementById('uv-val')) document.getElementById('uv-val').innerText = data.environment.uv_index || 0;
            setVal('env-experience', data.environment.environment_experience);
        }

        // Body
        if (data.body_measurements) {
            setVal('weight', data.body_measurements.weight_kg);
            setVal('height', data.body_measurements.height_cm);
            setVal('chest', data.body_measurements.chest);
            setVal('belly', data.body_measurements.belly);
        }

        // Health
        if (data.health_and_fitness) {
            setVal('sleep-hours', data.health_and_fitness.sleep_hours);
            setVal('sleep-quality', data.health_and_fitness.sleep_quality);
            setVal('sleep-desc', data.health_and_fitness.sleep_quality_description);
            setVal('steps-count', data.health_and_fitness.steps_count);
            setVal('distance-km', data.health_and_fitness.steps_distance_km);
            setVal('calories', data.health_and_fitness.kilocalorie);
            setVal('water-intake', data.health_and_fitness.water_intake_liters);
            setVal('medications', data.health_and_fitness.medications_taken);
            setVal('symptoms', data.health_and_fitness.physical_symptoms);
            setVal('energy-level', data.health_and_fitness.energy_level);
            setVal('stress-level', data.health_and_fitness.stress_level);
            setVal('energy-stress-reason', data.health_and_fitness.energy_stress_reason);
        }

        // Mental make sure to handle safely
        if (data.mental_and_emotional_health) {
            setVal('mental-state', data.mental_and_emotional_health.mental_state);
            setVal('mental-state-reason', data.mental_and_emotional_health.mental_state_reason);
            setVal('meditation-status', data.mental_and_emotional_health.meditation_status || "No");
            setVal('meditation-duration', data.mental_and_emotional_health.meditation_duration_min);

            // Trigger change event to show/hide duration
            const event = new Event('change');
            document.getElementById('meditation-status').dispatchEvent(event);

            const timeline = data.mental_and_emotional_health.mood_timeline;
            if (timeline) {
                ['morning', 'afternoon', 'evening', 'night'].forEach(period => {
                    const t = timeline[period];
                    if (t) {
                        const levelEl = document.querySelector(`.mood-level[data-period="${period}"]`);
                        const feelEl = document.querySelector(`.mood-feeling[data-period="${period}"]`);
                        if (levelEl) levelEl.value = (t.mood_level === null) ? "" : t.mood_level;
                        if (feelEl) feelEl.value = t.mood_feeling || "";
                    }
                });
            }
        }

        // Personal Care
        if (data.personal_care) {
            setVal('face-name', data.personal_care.face_product_name);
            setVal('face-brand', data.personal_care.face_product_brand);
            setVal('hair-name', data.personal_care.hair_product_name);
            setVal('hair-brand', data.personal_care.hair_product_brand);
            setVal('hair-oil', data.personal_care.hair_oil);
            setVal('skincare-routine', data.personal_care.skincare_routine);
        }

        // Diet
        if (data.diet_and_nutrition) {
            setVal('breakfast', data.diet_and_nutrition.breakfast);
            setVal('lunch', data.diet_and_nutrition.lunch);
            setVal('dinner', data.diet_and_nutrition.dinner);
            setVal('snacks', data.diet_and_nutrition.additional_items);
        }

        // Apps
        if (data.activities_and_productivity) {
            setVal('tasks-completed', data.activities_and_productivity.tasks_today_english);
            setVal('travel-dest', data.activities_and_productivity.travel_destination);
            setVal('screen-time', data.activities_and_productivity.phone_screen_on_hr);
            setVal('app-usage-intent', data.activities_and_productivity.app_usage_intent);

            const apps = data.activities_and_productivity.most_used_apps;
            if (Array.isArray(apps)) {
                const rows = document.querySelectorAll('.app-row');
                rows.forEach((row, idx) => {
                    if (apps[idx]) {
                        row.querySelector('.app-name').value = apps[idx].name || "";
                        row.querySelector('.app-time').value = apps[idx].time || "";
                    }
                });
            }
        }

        // Notes
        if (data.additional_notes) {
            setVal('key-events', data.additional_notes.key_events);
            setVal('other-notes-status', data.additional_notes.other_note_status);
        }
        setVal('daily-summary', data.daily_activity_summary);
        setVal('overall-exp', data.overall_day_experience);
    }

    resetForms() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'date') return; // Don't reset date
            input.value = "";
        });
        document.getElementById('uv-index').value = 0;
        document.getElementById('uv-val').innerText = 0;
    }

    saveCurrentEntry() {
        const data = this.collectData();
        this.storage.saveEntry(this.currentDate, data);
    }

    renderHistory(searchTerm = "") {
        const historyList = document.getElementById('history-list');
        const entries = this.storage.getEntries();
        historyList.innerHTML = "";

        // Sort Date Desc
        const sortedDates = Object.keys(entries).sort((a, b) => new Date(b) - new Date(a));

        let found = false;

        sortedDates.forEach(date => {
            const entry = entries[date];
            // Simple search filter
            if (searchTerm && !JSON.stringify(entry).toLowerCase().includes(searchTerm.toLowerCase())) {
                return;
            }

            found = true;

            const div = document.createElement('div');
            div.className = 'history-item';

            // Try to get a summary or info
            // Mood?
            let moodLevel = 5;
            if (entry.mental_and_emotional_health?.mood_timeline?.morning?.mood_level) {
                moodLevel = entry.mental_and_emotional_health.mood_timeline.morning.mood_level;
            }
            // Color based on mood
            let moodColor = '#888';
            if (moodLevel > 7) moodColor = '#22c55e'; // Green
            else if (moodLevel > 4) moodColor = '#f59e0b'; // Yellow
            else moodColor = '#ef4444'; // Red

            div.innerHTML = `
                <div class="history-info">
                   <span class="history-mood" style="background-color: ${moodColor}"></span>
                   <span class="history-date">${date}</span>
                   <span class="history-weeday"> - ${entry.weekday}</span>
                </div>
                <div class="history-actions">
                   <button class="icon-btn" onclick="app.ui.loadHistory('${date}')"><i class="fas fa-edit"></i></button>
                   <button class="icon-btn" onclick="app.ui.exportHistory('${date}')"><i class="fas fa-download"></i></button>
                </div>
            `;
            historyList.appendChild(div);
        });

        if (!found) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No matches found.</p>
                </div>
             `;
        }
    }

    loadHistory(date) {
        this.currentDate = date;
        this.loadEntry(date);
        this.updateDateDisplay();
        this.switchTab('tab-home');
    }

    exportHistory(date) {
        const json = this.storage.exportEntry(date);
        this.storage.downloadJSON(`${date}.json`, json);
    }
}
