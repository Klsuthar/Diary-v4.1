class UI {
    constructor(storage) {
        this.storage = storage;
        this.currentDate = new Date().toISOString().split('T')[0];

        // Reference Date: July 4, 2003
        this.referenceDate = new Date('2003-07-04');

        this.moodCategories = {
            'positive_high_energy': ['happy', 'calm', 'peaceful', 'relaxed', 'content', 'motivated', 'energetic', 'confident', 'hopeful', 'satisfied'],
            'neutral_balanced': ['neutral', 'normal', 'stable', 'okay', 'composed', 'indifferent'],
            'low_energy_tired': ['tired', 'sleepy', 'exhausted', 'lazy', 'drained', 'dull'],
            'negative_heavy': ['stressed', 'anxious', 'irritated', 'frustrated', 'overwhelmed', 'sad', 'low', 'lonely', 'bored'],
            'cognitive': ['focused', 'distracted', 'confused', 'overthinking', 'mentally_heavy', 'mentally_clear']
        };

        this.multiSelectMode = false;
        this.selectedEntries = new Set();
        this.longPressTimer = null;

        this.initElements();
        this.initEventListeners();

        // Initial Load
        this.loadEntry(this.currentDate);
        this.updateDateDisplay();
    }

    initElements() {
        // Nav & Tabs
        this.tabs = document.querySelectorAll('.tab-content');
        this.navItems = document.querySelectorAll('.nav-item');

        // Date
        this.dateDisplay = document.getElementById('display-date');
        this.weekdayDisplay = document.getElementById('display-weekday');
        this.dateBtn = document.getElementById('date-btn');
        this.hiddenDateInput = document.getElementById('entry-date');
        this.dayCounter = document.getElementById('day-counter');

        // Multi-select
        this.multiHeader = document.getElementById('multi-select-header');
        this.selectionCount = document.getElementById('selection-count');
        this.exportMultiBtn = document.getElementById('export-multi');
        this.deleteMultiBtn = document.getElementById('delete-multi');

        // Toast & Loading
        this.toast = document.getElementById('toast');
        this.loading = document.getElementById('loading');
    }

    initEventListeners() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => this.switchTab(item.dataset.target));
        });

        // Date Controls
        document.getElementById('prev-date').addEventListener('click', () => this.changeDate(-1));
        document.getElementById('next-date').addEventListener('click', () => this.changeDate(1));

        this.dateBtn.addEventListener('click', () => {
            this.hiddenDateInput.showPicker();
        });

        this.hiddenDateInput.addEventListener('change', (e) => {
            if (e.target.value) this.setDate(e.target.value);
        });

        // Inputs Auto-save (Debounced? Or just save button? Prompt says "Auto-save on date change" and "Manual Save Button")
        // We'll stick to Manual Save + Auto on Date Change as requested behavior.

        // Sliders Feedback
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            // Find sibling or parent's span to update value
            slider.addEventListener('input', (e) => {
                const valSpan = e.target.parentElement.querySelector('span') || document.getElementById(e.target.id.replace('level', 'val').replace('index', 'val').replace('quality', 'qual-val'));
                if (valSpan) valSpan.innerText = e.target.value;
            });
        });

        // Mood Category Change
        document.querySelectorAll('.mood-cat').forEach(select => {
            select.addEventListener('change', (e) => this.updateMoodFeelings(e.target));
        });

        // Textarea Counters
        document.querySelectorAll('textarea').forEach(area => {
            const countId = area.id + '-count';
            const counter = document.getElementById(countId);
            if (counter) {
                area.addEventListener('input', (e) => {
                    counter.innerText = `(${e.target.value.length})`;
                });
            }
        });

        // Header Actions
        document.getElementById('save-btn').addEventListener('click', () => this.saveEntry(true));
        document.getElementById('export-btn').addEventListener('click', () => this.exportCurrentEntry());

        // Menu Actions
        document.getElementById('menu-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('main-menu').classList.toggle('show');
        });
        document.addEventListener('click', () => document.getElementById('main-menu').classList.remove('show'));

        document.getElementById('menu-share').addEventListener('click', () => this.shareEntry());
        document.getElementById('menu-import').addEventListener('click', () => document.getElementById('import-file').click());
        document.getElementById('menu-clear').addEventListener('click', () => this.clearForm());
        document.getElementById('menu-backup').addEventListener('click', () => this.createBackup());
        document.getElementById('menu-restore').addEventListener('click', () => document.getElementById('import-backup-file').click());
        document.getElementById('menu-refresh').addEventListener('click', () => window.location.reload(true));

        // File Inputs
        document.getElementById('import-file').addEventListener('change', (e) => this.handleFileImport(e, false));
        document.getElementById('import-backup-file').addEventListener('change', (e) => this.handleFileImport(e, true));

        // Multi-select Actions
        document.getElementById('cancel-multi').addEventListener('click', () => this.exitMultiSelect());
        this.exportMultiBtn.addEventListener('click', () => this.exportSelected());
        this.deleteMultiBtn.addEventListener('click', () => this.deleteSelected());

        // Meditation
        document.getElementById('meditation-status').addEventListener('change', (e) => {
            const group = document.getElementById('meditation-duration-group');
            if (e.target.value === 'Yes') group.classList.remove('hidden');
            else group.classList.add('hidden');
        });

        // Import Last Day Buttons
        document.getElementById('import-last-env').addEventListener('click', () => this.importLastDayData('environment'));
        document.getElementById('import-last-care').addEventListener('click', () => this.importLastDayData('personal_care'));

        // --- NEW BASIC TAB LOGIC ---

        // Suggestion Chips
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const area = document.getElementById('env-experience');
                const current = area.value;
                area.value = current ? `${current}, ${chip.innerText}` : chip.innerText;
            });
        });

        // Color-Coded Sliders
        const linkSliderToLabel = (sliderId, labelId, valueId, getLabelClass) => {
            const slider = document.getElementById(sliderId);
            const label = document.getElementById(labelId);
            const valDisplay = document.getElementById(valueId);
            if (!slider || !label) return;

            const update = () => {
                const val = parseInt(slider.value);
                if (valDisplay) valDisplay.innerText = val;

                // Remove old classes
                label.className = '';
                // Get new class and text
                const res = getLabelClass(val);
                label.innerText = res.text;
                label.classList.add(res.cls);
                // Re-add id if needed or just rely on parent select
                label.id = labelId;
            };

            slider.addEventListener('input', update);
            // Initial call relies on loadEntry setting value first
        };

        linkSliderToLabel('aqi', 'aqi-label', 'aqi-value', (val) => {
            if (val <= 50) return { text: 'Good', cls: 'aqi-good' };
            if (val <= 100) return { text: 'Moderate', cls: 'aqi-moderate' };
            if (val <= 150) return { text: 'Unhealthy (Sens.)', cls: 'aqi-unhealthy-sensitive' };
            if (val <= 200) return { text: 'Unhealthy', cls: 'aqi-unhealthy' };
            if (val <= 300) return { text: 'Very Unhealthy', cls: 'aqi-very-unhealthy' };
            return { text: 'Hazardous', cls: 'aqi-hazardous' };
        });

        linkSliderToLabel('uv-index', 'uv-label', 'uv-value', (val) => {
            if (val <= 2) return { text: 'Low', cls: 'uv-low' };
            if (val <= 5) return { text: 'Moderate', cls: 'uv-moderate' };
            if (val <= 7) return { text: 'High', cls: 'uv-high' };
            if (val <= 10) return { text: 'Very High', cls: 'uv-very-high' };
            return { text: 'Extreme', cls: 'uv-extreme' };
        });
    }

    // -------------------------------------------------------------------------
    // LOGIC
    // -------------------------------------------------------------------------

    updateMoodFeelings(catSelect) {
        const cat = catSelect.value;
        const feelSelect = catSelect.parentElement.querySelector('.mood-feel');
        feelSelect.innerHTML = '<option value="">Feeling...</option>';

        if (cat && this.moodCategories[cat]) {
            this.moodCategories[cat].forEach(feel => {
                const opt = document.createElement('option');
                opt.value = feel;
                opt.innerText = feel;
                feelSelect.appendChild(opt);
            });
        }
    }

    switchTab(tabId) {
        this.tabs.forEach(t => t.classList.remove('active'));
        this.navItems.forEach(n => n.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.nav-item[data-target="${tabId}"]`).classList.add('active');

        if (tabId === 'tab-history') {
            this.renderHistory();
        }
    }

    changeDate(offset) {
        this.saveEntry(false); // Auto-save silent
        const d = new Date(this.currentDate);
        d.setDate(d.getDate() + offset);
        this.setDate(d.toISOString().split('T')[0]);
    }

    setDate(dateStr) {
        this.currentDate = dateStr;
        this.loadEntry(this.currentDate);
        this.updateDateDisplay();
    }

    updateDateDisplay() {
        const d = new Date(this.currentDate);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        this.dateDisplay.innerText = d.toLocaleDateString('en-US', options);
        this.weekdayDisplay.innerText = d.toLocaleDateString('en-US', { weekday: 'long' });

        // Day Counter
        const diff = Math.ceil((d - this.referenceDate) / (1000 * 60 * 60 * 24));
        this.dayCounter.innerText = diff > 0 ? diff : '--';

        this.hiddenDateInput.value = this.currentDate;
    }

    // -------------------------------------------------------------------------
    // DATA HANDLING
    // -------------------------------------------------------------------------

    collectData() {
        const getVal = (id) => document.getElementById(id)?.value || "";
        const getNum = (id) => document.getElementById(id)?.value ? Number(document.getElementById(id).value) : null;

        // Apps
        const getApps = () => {
            const apps = [];
            document.querySelectorAll('.app-row').forEach((row, i) => {
                const name = row.querySelector('.app-name').value;
                const time = row.querySelector('.app-time').value;
                if (name || time) apps.push({ rank: i + 1, name, time });
            });
            return apps;
        };

        // Mood Timeline
        const getMoodParams = (period) => {
            const block = document.querySelector(`.mood-block[data-period="${period}"]`);
            if (!block) return { mood_level: null, mood_category: "", mood_feeling: "" };
            return {
                mood_level: Number(block.querySelector('.mood-slider').value) || null,
                mood_category: block.querySelector('.mood-cat').value || "",
                mood_feeling: block.querySelector('.mood-feel').value || ""
            };
        };

        const d = new Date(this.currentDate);
        const dayId = Math.ceil((d - this.referenceDate) / (1000 * 60 * 60 * 24));

        return {
            version: "1.0",
            date: this.currentDate,
            day_id: dayId,
            weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),

            environment: {
                temperature_c: getVal('temp-min') && getVal('temp-max') ? `${getVal('temp-min')}-${getVal('temp-max')}` : getVal('temperature'), // Fallback or new format
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
                physical_symptoms: getVal('symptoms')
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
                energy_level: getNum('energy-level'),
                energy_reason: getVal('energy-reason'),
                stress_level: getNum('stress-level'),
                stress_reason: getVal('stress-reason'),
                meditation_status: getVal('meditation-status'),
                meditation_duration_min: getNum('meditation-duration')
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

    loadEntry(date) {
        this.resetForm();
        const data = this.storage.getEntry(date);
        if (!data) return;

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = (val === null || val === undefined) ? "" : val;
        };

        // Environment
        if (data.environment) {
            setVal('weather-condition', data.environment.weather_condition);

            // Handle Temp Split
            const rawTemp = data.environment.temperature_c || "";
            if (rawTemp.includes('-')) {
                const parts = rawTemp.split('-');
                setVal('temp-min', parts[0]);
                setVal('temp-max', parts[1]);
            } else {
                // Fallback if old data or different format
                setVal('temp-min', rawTemp);
            }

            setVal('aqi', data.environment.air_quality_index);
            setVal('humidity', data.environment.humidity_percent);
            setVal('uv-index', data.environment.uv_index);

            // Trigger visual updates for sliders
            document.getElementById('aqi')?.dispatchEvent(new Event('input'));
            document.getElementById('uv-index')?.dispatchEvent(new Event('input'));
            if (document.getElementById('humidity-value')) document.getElementById('humidity-value').innerText = data.environment.humidity_percent || 50;

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
            if (document.getElementById('sleep-qual-val')) document.getElementById('sleep-qual-val').innerText = data.health_and_fitness.sleep_quality || 5;
            setVal('sleep-desc', data.health_and_fitness.sleep_quality_description);
            setVal('steps-count', data.health_and_fitness.steps_count);
            setVal('distance-km', data.health_and_fitness.steps_distance_km);
            setVal('calories', data.health_and_fitness.kilocalorie);
            setVal('water-intake', data.health_and_fitness.water_intake_liters);
            setVal('medications', data.health_and_fitness.medications_taken);
            setVal('symptoms', data.health_and_fitness.physical_symptoms);
        }

        // Mental
        if (data.mental_and_emotional_health) {
            setVal('mental-state', data.mental_and_emotional_health.mental_state);
            setVal('mental-state-reason', data.mental_and_emotional_health.mental_state_reason);

            setVal('energy-level', data.mental_and_emotional_health.energy_level);
            if (document.getElementById('energy-val')) document.getElementById('energy-val').innerText = data.mental_and_emotional_health.energy_level || 5;
            setVal('energy-reason', data.mental_and_emotional_health.energy_reason);

            setVal('stress-level', data.mental_and_emotional_health.stress_level);
            if (document.getElementById('stress-val')) document.getElementById('stress-val').innerText = data.mental_and_emotional_health.stress_level || 5;
            setVal('stress-reason', data.mental_and_emotional_health.stress_reason);

            setVal('meditation-status', data.mental_and_emotional_health.meditation_status || "No");
            setVal('meditation-duration', data.mental_and_emotional_health.meditation_duration_min);
            // Trigger duration visibility
            const evt = new Event('change');
            document.getElementById('meditation-status').dispatchEvent(evt);

            // Timeline
            const tl = data.mental_and_emotional_health.mood_timeline;
            if (tl) {
                ['morning', 'afternoon', 'evening', 'night'].forEach(p => {
                    if (tl[p]) {
                        const block = document.querySelector(`.mood-block[data-period="${p}"]`);
                        if (block) {
                            block.querySelector('.mood-slider').value = tl[p].mood_level || 5;
                            block.querySelector('.mood-val').innerText = tl[p].mood_level || 5;

                            const catSel = block.querySelector('.mood-cat');
                            catSel.value = tl[p].mood_category || "";

                            // Trigger cat change to populate feelings
                            this.updateMoodFeelings(catSel);

                            // Then set feeling
                            block.querySelector('.mood-feel').value = tl[p].mood_feeling || "";
                        }
                    }
                });
            }
        }

        // Summary
        if (data.personal_care) {
            setVal('face-name', data.personal_care.face_product_name);
            setVal('face-brand', data.personal_care.face_product_brand);
            setVal('hair-name', data.personal_care.hair_product_name);
            setVal('hair-brand', data.personal_care.hair_product_brand);
            setVal('hair-oil', data.personal_care.hair_oil);
            setVal('skincare-routine', data.personal_care.skincare_routine);
        }

        if (data.diet_and_nutrition) {
            setVal('breakfast', data.diet_and_nutrition.breakfast);
            setVal('lunch', data.diet_and_nutrition.lunch);
            setVal('dinner', data.diet_and_nutrition.dinner);
            setVal('snacks', data.diet_and_nutrition.additional_items);
        }

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

        if (data.additional_notes) {
            setVal('key-events', data.additional_notes.key_events);
            setVal('other-notes-status', data.additional_notes.other_note_status);
        }
        setVal('daily-summary', data.daily_activity_summary);
        setVal('overall-exp', data.overall_day_experience);

        // Update all counters
        document.querySelectorAll('textarea').forEach(el => {
            const countId = el.id + '-count';
            const counter = document.getElementById(countId);
            if (counter) counter.innerText = `(${el.value.length})`;
        });
    }

    resetForm() {
        document.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.type !== 'date') el.value = "";
        });
        document.querySelectorAll('input[type="range"]').forEach(el => {
            el.value = (el.min == 1) ? 5 : 0; // Default middle for 1-10, 0 for UV
            // Reset spans
            const span = el.parentElement.querySelector('span') || document.getElementById(el.id.replace('level', 'val').replace('quality', 'qual-val').replace('index', 'val'));
            if (span) span.innerText = el.value;
        });
        document.querySelectorAll('.app-row input').forEach(el => el.value = "");
    }

    saveEntry(showToast = false) {
        const data = this.collectData();
        const res = this.storage.saveEntry(this.currentDate, data);
        if (res.success && showToast) {
            this.showToast('Saved Successfully');
        }
    }

    showToast(msg) {
        this.toast.innerText = msg;
        this.toast.classList.remove('hidden');
        setTimeout(() => this.toast.classList.add('hidden'), 2000);
    }

    // -------------------------------------------------------------------------
    // HISTORY & MULTI-SELECT
    // -------------------------------------------------------------------------

    renderHistory() {
        const list = document.getElementById('history-list');
        list.innerHTML = "";
        const entries = this.storage.getEntries();
        const sorted = Object.keys(entries).sort((a, b) => new Date(b) - new Date(a));

        if (sorted.length === 0) {
            list.innerHTML = `<div class="empty-state"><p>No entries yet.</p></div>`;
            return;
        }

        sorted.forEach(date => {
            const entry = entries[date];
            const div = document.createElement('div');
            div.className = 'history-item';
            div.dataset.date = date;

            // Preview
            const summary = entry.daily_activity_summary || "No summary";
            const mood = entry.mental_and_emotional_health?.mood_timeline?.morning?.mood_level || 5;
            let moodColor = '#f59e0b';
            if (mood > 7) moodColor = '#22c55e';
            else if (mood < 5) moodColor = '#ef4444';

            div.innerHTML = `
                <div class="history-checkbox ${this.multiSelectMode ? '' : 'hidden'}">
                    <i class="far fa-square"></i>
                </div>
                <div class="history-content">
                    <div class="history-top">
                        <div class="history-date">
                             <span class="mood-dot" style="background-color:${moodColor}"></span>
                             ${date} <small>(${entry.weekday})</small>
                        </div>
                        <div class="history-actions-row ${this.multiSelectMode ? 'hidden' : ''}">
                             <button class="icon-btn-sm" onclick="app.ui.loadHistory('${date}')" title="Edit"><i class="fas fa-edit"></i></button>
                             <button class="icon-btn-sm" onclick="app.ui.exportOne('${date}')" title="Export"><i class="fas fa-download"></i></button>
                             <button class="icon-btn-sm" onclick="app.ui.deleteOne('${date}')" title="Delete"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="history-preview">${summary.substring(0, 50)}${summary.length > 50 ? '...' : ''}</div>
                </div>
            `;

            // Events
            div.addEventListener('click', (e) => {
                // If clicking buttons, don't trigger selection
                if (e.target.closest('button')) return;

                if (this.multiSelectMode) {
                    this.toggleSelection(date, div);
                } else {
                    // Regular click to edit
                    this.loadHistory(date);
                }
            });

            // Long Press
            div.addEventListener('mousedown', () => {
                this.longPressTimer = setTimeout(() => this.enterMultiSelect(date, div), 800);
            });
            div.addEventListener('touchstart', () => {
                this.longPressTimer = setTimeout(() => this.enterMultiSelect(date, div), 800);
            });
            ['mouseup', 'mouseleave', 'touchend', 'touchmove'].forEach(evt => {
                div.addEventListener(evt, () => clearTimeout(this.longPressTimer));
            });

            list.appendChild(div);
        });

        // Re-apply selection state if render happens during multi-select
        if (this.multiSelectMode) {
            this.selectedEntries.forEach(d => {
                const el = list.querySelector(`.history-item[data-date="${d}"]`);
                if (el) this.markSelected(el, true);
            });
        }
    }

    enterMultiSelect(initialDate, element) {
        if (this.multiSelectMode) return;
        this.multiSelectMode = true;
        this.multiHeader.classList.remove('hidden');
        document.querySelectorAll('.history-checkbox').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.history-actions-row').forEach(el => el.classList.add('hidden'));

        // Vibrate
        if (navigator.vibrate) navigator.vibrate(50);

        this.toggleSelection(initialDate, element);
    }

    exitMultiSelect() {
        this.multiSelectMode = false;
        this.selectedEntries.clear();
        this.multiHeader.classList.add('hidden');
        document.querySelectorAll('.history-checkbox').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.history-actions-row').forEach(el => el.classList.remove('hidden'));

        // Clear checks
        document.querySelectorAll('.history-checkbox i').forEach(i => {
            i.className = 'far fa-square';
        });
        document.querySelectorAll('.history-item').forEach(el => el.classList.remove('selected'));
        this.updateSelectionUI();
    }

    toggleSelection(date, element) {
        if (this.selectedEntries.has(date)) {
            this.selectedEntries.delete(date);
            this.markSelected(element, false);
        } else {
            this.selectedEntries.add(date);
            this.markSelected(element, true);
        }
        this.updateSelectionUI();
    }

    markSelected(element, isSelected) {
        const icon = element.querySelector('.history-checkbox i');
        if (isSelected) {
            icon.className = 'fas fa-check-square';
            element.classList.add('selected');
        } else {
            icon.className = 'far fa-square';
            element.classList.remove('selected');
        }
    }

    updateSelectionUI() {
        const count = this.selectedEntries.size;
        this.selectionCount.innerText = `${count} selected`;
        this.exportMultiBtn.disabled = count === 0;
        this.deleteMultiBtn.disabled = count === 0;
    }

    // -------------------------------------------------------------------------
    // EXPORT / IMPORT / HELPERS
    // -------------------------------------------------------------------------

    loadHistory(date) {
        this.currentDate = date;
        this.loadEntry(date);
        this.updateDateDisplay();
        this.switchTab('tab-basic');
    }

    exportOne(date) {
        const json = this.storage.exportEntry(date);
        this.storage.downloadJSON(`${date}.json`, json);
    }

    exportCurrentEntry() {
        this.saveEntry(); // Ensure fresh
        this.exportOne(this.currentDate);
    }

    exportSelected() {
        const dates = Array.from(this.selectedEntries);
        const data = dates.map(d => this.storage.getEntry(d));
        this.storage.downloadJSON(`diary_export_${dates.length}.json`, JSON.stringify(data, null, 2));
        this.exitMultiSelect();
    }

    deleteOne(date) {
        if (confirm('Delete this entry?')) {
            this.storage.deleteEntry(date);
            this.renderHistory();
            if (date === this.currentDate) this.resetForm();
        }
    }

    deleteSelected() {
        if (confirm(`Delete ${this.selectedEntries.size} entries?`)) {
            this.selectedEntries.forEach(d => this.storage.deleteEntry(d));
            this.exitMultiSelect();
            this.renderHistory();
        }
    }

    createBackup() {
        const all = this.storage.getEntries();
        // Array or object? Prompt says "Export all entries as single JSON file"
        // Let's do array for easy portability
        const arr = Object.values(all);
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.storage.downloadJSON(`diary-backup-${stamp}.json`, JSON.stringify(arr, null, 2));
    }

    handleFileImport(e, isBackup) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const content = evt.target.result;
            const res = this.storage.importEntries(content);
            if (res.success) {
                this.showToast(`Imported ${res.count} entries`);
                // If current date was updated?
                this.loadEntry(this.currentDate);
                this.renderHistory();
            } else {
                alert('Import Failed: ' + res.error);
            }
            e.target.value = ''; // reset
        };
        reader.readAsText(file);
    }

    clearForm() {
        if (confirm('Clear current form and delete saved data?')) {
            this.storage.deleteEntry(this.currentDate);
            this.resetForm();
            this.renderHistory();
        }
    }

    importLastDayData(section) {
        const d = new Date(this.currentDate);
        d.setDate(d.getDate() - 1);
        const prevDate = d.toISOString().split('T')[0];
        const prevData = this.storage.getEntry(prevDate);

        if (!prevData) {
            this.showToast('No data for previous day');
            return;
        }

        if (section === 'environment') {
            if (prevData.environment) {
                const cur = this.storage.getEntry(this.currentDate) || {};
                cur.environment = prevData.environment;
                // But wait, we need to populate UI
                document.getElementById('weather-condition').value = prevData.environment.weather_condition || "";
                document.getElementById('temperature').value = prevData.environment.temperature_c || "";
                document.getElementById('aqi').value = prevData.environment.air_quality_index || "";
                document.getElementById('humidity').value = prevData.environment.humidity_percent || "";
            }
        } else if (section === 'personal_care') {
            if (prevData.personal_care) {
                document.getElementById('face-name').value = prevData.personal_care.face_product_name || "";
                document.getElementById('face-brand').value = prevData.personal_care.face_product_brand || "";
                document.getElementById('hair-name').value = prevData.personal_care.hair_product_name || "";
                document.getElementById('hair-brand').value = prevData.personal_care.hair_product_brand || "";
                document.getElementById('hair-oil').value = prevData.personal_care.hair_oil || "";
                document.getElementById('skincare-routine').value = prevData.personal_care.skincare_routine || "";
            }
        }
    }
}
