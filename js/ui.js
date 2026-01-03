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
        // Mood Category Change (Dynamic Feelings for Timeline)
        document.querySelectorAll('.mood-cat').forEach(select => {
            select.addEventListener('change', (e) => {
                const periodCard = e.target.closest('.period-card');
                const feelSelect = periodCard.querySelector('.mood-feel');
                this.updateMoodFeelings(e.target.value, feelSelect);
            });
        });

        // Toggle Meditation Duration
        const medStatus = document.getElementById('meditation-status');
        if (medStatus) {
            medStatus.addEventListener('change', (e) => {
                const group = document.getElementById('meditation-duration-group');
                if (e.target.value === 'Yes') {
                    group.classList.remove('hidden');
                    // small delay to allow display:block to apply before animation
                    requestAnimationFrame(() => group.classList.add('slide-in-active'));
                } else {
                    group.classList.add('hidden');
                    document.getElementById('meditation-duration').value = "";
                }
            });
        }

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
        document.getElementById('multi-cancel-btn').addEventListener('click', () => this.exitMultiSelect());
        document.getElementById('multi-export-btn').addEventListener('click', () => this.exportSelected());
        document.getElementById('multi-delete-btn').addEventListener('click', () => this.deleteSelected());

        // Search & Filter Listeners
        const searchInput = document.getElementById('history-search');
        const searchClear = document.getElementById('search-clear');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value;
                searchClear.classList.toggle('hidden', !val);
                this.renderHistory(val, this.currentFilter || 'all');
            });
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.classList.add('hidden');
                this.renderHistory('', this.currentFilter || 'all');
            });
        }

        // Filter Chips
        document.querySelectorAll('.filter-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                // UI toggle
                document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                this.currentFilter = btn.dataset.filter;
                this.renderHistory(searchInput.value, this.currentFilter);
            });
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

        // --- NEW BODY TAB LOGIC ---

        // Sleep Quality Slider
        linkSliderToLabel('sleep-quality', 'sleep-qual-label', 'sleep-qual-val', (val) => {
            if (val <= 3) return { text: 'Poor 😴', cls: 'qual-poor' };
            if (val <= 6) return { text: 'Average 😐', cls: 'qual-avg' };
            if (val <= 8) return { text: 'Good 😊', cls: 'qual-good' };
            return { text: 'Excellent 🌟', cls: 'qual-excellent' };
        });

        // Hydration Logic
        const updateGlasses = () => {
            const val = parseFloat(document.getElementById('water-intake').value) || 0;
            const glassCount = Math.min(8, Math.floor(val / 0.25));
            const glasses = document.querySelectorAll('.glass-indicators i');
            glasses.forEach((glass, idx) => {
                if (idx < glassCount) {
                    glass.classList.remove('far', 'fa-circle');
                    glass.classList.add('fas', 'fa-glass-water', 'filled');
                } else {
                    glass.classList.remove('fas', 'fa-glass-water', 'filled');
                    glass.classList.add('far', 'fa-circle');
                }
            });
        };

        document.getElementById('water-intake').addEventListener('input', updateGlasses);

        document.querySelectorAll('.quick-add-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const add = parseFloat(btn.dataset.add);
                const input = document.getElementById('water-intake');
                let current = parseFloat(input.value) || 0;
                input.value = (current + add).toFixed(2);
                updateGlasses();

                // Add simple animation effect
                btn.style.transform = "scale(0.9)";
                setTimeout(() => btn.style.transform = "scale(1)", 100);
            });
        });

        // Medical/Symptoms Chips
        const setupChips = (containerId, inputId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const input = document.getElementById(inputId);
                    const val = input.value;
                    input.value = val ? `${val}, ${chip.innerText}` : chip.innerText;
                });
            });
        };
        setupChips('meds-suggestions', 'medications');
        setupChips('symptoms-suggestions', 'symptoms');

        // ---------------- BASIC TAB LISTENERS ----------------
        // AQI Slider
        const aqiSlider = document.getElementById('aqi');
        const aqiLabel = document.getElementById('aqi-label');
        if (aqiSlider && aqiLabel) {
            aqiSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                document.getElementById('aqi-value').innerText = val;
                this.updateAQILabel(val, aqiLabel);
            });
            // Init state
            this.updateAQILabel(parseInt(aqiSlider.value), aqiLabel);
        }

        // UV Slider
        const uvSlider = document.getElementById('uv-index');
        const uvLabel = document.getElementById('uv-label');
        if (uvSlider && uvLabel) {
            uvSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                document.getElementById('uv-value').innerText = val;
                this.updateUVLabel(val, uvLabel);
            });
            // Init state
            this.updateUVLabel(parseInt(uvSlider.value), uvLabel);
        }

        // Environment Suggestions
        const envSuggestions = document.getElementById('env-suggestions');
        if (envSuggestions) {
            envSuggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    this.appendReason('env-experience', chip.innerText);
                });
            });
        }

        // Import Basic Data
        const importBasicBtn = document.getElementById('import-last-env');
        if (importBasicBtn) {
            importBasicBtn.addEventListener('click', () => this.importLastDayData('environment'));
        }

        // ---------------- SUMMARY TAB LISTENERS ----------------
        // Suggestion Chips (Generic)
        document.querySelectorAll('.suggestion-chips-container').forEach(container => {
            const inputId = container.dataset.input;
            if (!inputId) return;
            container.querySelectorAll('.chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    // Check if input is textarea or text
                    const input = document.getElementById(inputId);
                    if (!input) return;

                    if (input.tagName === 'TEXTAREA' || inputId === 'breakfast' || inputId === 'lunch' || inputId === 'dinner' || inputId === 'snacks' || inputId === 'app-usage-intent') {
                        // Append with comma
                        const current = input.value;
                        if (current) {
                            if (!current.includes(chip.innerText)) {
                                input.value = current + ", " + chip.innerText;
                            }
                        } else {
                            input.value = chip.innerText;
                        }
                    } else {
                        // Replace for simple inputs
                        input.value = chip.innerText;
                    }
                    input.dispatchEvent(new Event('input'));
                });
            });
        });

        // Import Personal Care
        const importCareBtn = document.getElementById('import-last-care');
        if (importCareBtn) {
            importCareBtn.addEventListener('click', () => this.importLastDayData('personal_care'));
        }

        // Character Counters
        document.querySelectorAll('.char-counter').forEach(counter => {
            const inputId = counter.id.replace('-count', '');
            const input = document.getElementById(inputId);
            if (input) {
                const limit = parseInt(counter.innerText.split('/')[1]);
                input.addEventListener('input', () => {
                    const len = input.value.length;
                    counter.innerText = `(${len}/${limit})`;
                    if (len >= limit) counter.classList.add('limit-reached');
                    else counter.classList.remove('limit-reached');
                });
            }
        });
    }

    // -------------------------------------------------------------------------
    // LOGIC
    // -------------------------------------------------------------------------

    updateMoodFeelings(category, feelSelect) {
        feelSelect.innerHTML = '<option value="">Select Feeling...</option>';
        if (!category || !this.moodCategories[category]) {
            feelSelect.disabled = true;
            return;
        }
        feelSelect.disabled = false;
        this.moodCategories[category].forEach(feeling => {
            const opt = document.createElement('option');
            opt.value = feeling;
            opt.innerText = feeling;
            feelSelect.appendChild(opt);
        });
    }

    getMoodEmoji(level) {
        if (level >= 9) return '🌟';
        if (level >= 7) return '😊';
        if (level >= 5) return '😐';
        if (level >= 3) return '😔';
        return '😢';
    }

    appendReason(id, text) {
        // Handle both ID styles (e.g., 'energy' -> 'energy-reason' OR direct ID)
        let field = document.getElementById(id);
        if (!field) field = document.getElementById(`${id}-reason`);
        if (!field) return;

        const current = field.value;
        if (current) {
            if (!current.includes(text)) {
                field.value = current + ", " + text;
            }
        } else {
            field.value = text;
        }
        field.dispatchEvent(new Event('input'));
    }

    // Basic Tab Helpers
    updateAQILabel(value, label) {
        label.className = '';
        if (value <= 50) {
            label.innerText = 'Good';
            label.classList.add('aqi-good');
        } else if (value <= 100) {
            label.innerText = 'Moderate';
            label.classList.add('aqi-moderate');
        } else if (value <= 150) {
            label.innerText = 'Unhealthy for Sensitive';
            label.classList.add('aqi-unhealthy-sensitive');
        } else if (value <= 200) {
            label.innerText = 'Unhealthy';
            label.classList.add('aqi-unhealthy');
        } else if (value <= 300) {
            label.innerText = 'Very Unhealthy';
            label.classList.add('aqi-very-unhealthy');
        } else {
            label.innerText = 'Hazardous';
            label.classList.add('aqi-hazardous');
        }
    }

    updateUVLabel(value, label) {
        label.className = '';
        if (value <= 2) {
            label.innerText = 'Low';
            label.classList.add('uv-low');
        } else if (value <= 5) {
            label.innerText = 'Moderate';
            label.classList.add('uv-moderate');
        } else if (value <= 7) {
            label.innerText = 'High';
            label.classList.add('uv-high');
        } else if (value <= 10) {
            label.innerText = 'Very High';
            label.classList.add('uv-very-high');
        } else {
            label.innerText = 'Extreme';
            label.classList.add('uv-extreme');
        }
    }

    switchTab(tabId) {
        this.tabs.forEach(t => t.classList.remove('active'));
        this.navItems.forEach(n => n.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.nav-item[data-target="${tabId}"]`).classList.add('active');

        if (tabId === 'tab-history') {
            this.renderHistory(document.getElementById('history-search')?.value || '', this.currentFilter || 'all');
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

        return {
            date: this.currentDate,
            history: {
                mood: this.selectedMood,
                rating: this.currentRating,
                tags: Array.from(this.selectedTags),
                note: getVal('history-note') // Keeping backward compatibility if needed
            },
            mental: {
                morning: getMoodParams('morning'),
                afternoon: getMoodParams('afternoon'),
                evening: getMoodParams('evening'),
                night: getMoodParams('night'),
                energy_level: getNum('energy-level'),
                energy_reason: getVal('energy-reason'),
                stress_level: getNum('stress-level'),
                stress_reason: getVal('stress-reason'),
                meditation: {
                    status: getVal('meditation-status'),
                    duration: getNum('meditation-duration')
                }
            },
            basic: {
                temp_min: getVal('temp-min'),
                temp_max: getVal('temp-max'),
                weather: getVal('weather-condition'),
                aqi: getNum('aqi'),
                humidity: getNum('humidity'),
                uv_index: getNum('uv-index'),
                environment_experience: getVal('env-experience')
            },
            summary: {
                personal_care: {
                    face_name: getVal('face-name'),
                    face_brand: getVal('face-brand'),
                    hair_name: getVal('hair-name'),
                    hair_brand: getVal('hair-brand'),
                    hair_oil: getVal('hair-oil'),
                    routine: getVal('skincare-routine')
                },
                diet: {
                    breakfast: getVal('breakfast'),
                    lunch: getVal('lunch'),
                    dinner: getVal('dinner'),
                    snacks: getVal('snacks')
                },
                activities: {
                    tasks: getVal('tasks-completed'),
                    travel: getVal('travel-dest'),
                    screen_time: getVal('screen-time'),
                    top_apps: getApps(),
                    intent: getVal('app-usage-intent')
                },
                daily: {
                    key_events: getVal('key-events'),
                    activity_summary: getVal('daily-summary'),
                    overall_exp: getVal('overall-exp'),
                    other_notes: getVal('other-notes') // Assuming hidden textarea logic handled elsewhere or simple field
                }
            },
            timestamp: new Date().toISOString()
        };

        // Mood Timeline
        const getMoodParams = (period) => {
            const block = document.querySelector(`.period-card[data-period="${period}"]`); // Updated class from mood-block to period-card
            if (!block) return { mood_level: 5, mood_category: "", mood_feeling: "" };

            // Handle potentially different IDs if reusing code
            // Actually our index.html uses IDs mood-slider-morning etc. 
            // Better to select by ID strictly if they exist, or querySelector relative to block
            // Relative is safer if IDs change
            return {
                mood_level: Number(block.querySelector('.mood-slider').value) || 5, // Default 5
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
                temperature_c: getVal('temp-min') && getVal('temp-max') ? `${getVal('temp-min')}-${getVal('temp-max')}` : getVal('temperature'),
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
                mental_state_reason: getVal('mental-state-reason'), // Updated ID
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

            summary: {
                personal_care: {
                    face_name: getVal('face-name'),
                    face_brand: getVal('face-brand'),
                    hair_name: getVal('hair-name'),
                    hair_brand: getVal('hair-brand'),
                    hair_oil: getVal('hair-oil'),
                    routine: getVal('skincare-routine')
                },
                diet: {
                    breakfast: getVal('breakfast'),
                    lunch: getVal('lunch'),
                    dinner: getVal('dinner'),
                    snacks: getVal('snacks')
                },
                activities: {
                    tasks: getVal('tasks-completed'),
                    travel: getVal('travel-dest'),
                    screen_time: getVal('screen-time'),
                    top_apps: getApps(),
                    intent: getVal('app-usage-intent')
                },
                daily: {
                    key_events: getVal('key-events'),
                    activity_summary: getVal('daily-summary'),
                    overall_exp: getVal('overall-exp'),
                    other_notes: getVal('other-notes')
                }
            },

            // Legacy structure cleanup (keep null or remove if safe, setting to null to avoid confusion)
            personal_care: null,
            diet_and_nutrition: null,
            activities_and_productivity: null,
            additional_notes: null,
            daily_activity_summary: null,
            overall_day_experience: null
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

        // Health (Body Tab Data Load)
        if (data.health_and_fitness) {
            setVal('sleep-hours', data.health_and_fitness.sleep_hours);
            setVal('sleep-quality', data.health_and_fitness.sleep_quality);
            // Trigger slider update
            document.getElementById('sleep-quality')?.dispatchEvent(new Event('input'));

            setVal('sleep-desc', data.health_and_fitness.sleep_quality_description);
            setVal('steps-count', data.health_and_fitness.steps_count);
            setVal('distance-km', data.health_and_fitness.steps_distance_km);
            setVal('calories', data.health_and_fitness.kilocalorie);
            setVal('water-intake', data.health_and_fitness.water_intake_liters);
            // Trigger hydration visual update
            document.getElementById('water-intake')?.dispatchEvent(new Event('input'));

            setVal('medications', data.health_and_and_fitness.medications_taken);
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
                        const block = document.querySelector(`.period-card[data-period="${p}"]`);
                        if (block) {
                            block.querySelector('.mood-slider').value = tl[p].mood_level || 5;
                            block.querySelector('.mood-val').innerText = tl[p].mood_level || 5;

                            const catSel = block.querySelector('.mood-category'); // Updated class name if needed, check HTML
                            if (catSel) {
                                catSel.value = tl[p].mood_category || "";
                                // Trigger cat change
                                this.updateMoodFeelings(catSel.value, block.querySelector('.mood-feel'));
                            }

                            block.querySelector('.mood-feel').value = tl[p].mood_feeling || "";
                        }
                    }
                });
            }
        }

        // Summary
        if (data.summary) {
            // Personal Care
            if (data.summary.personal_care) {
                setVal('face-name', data.summary.personal_care.face_name);
                setVal('face-brand', data.summary.personal_care.face_brand);
                setVal('hair-name', data.summary.personal_care.hair_name);
                setVal('hair-brand', data.summary.personal_care.hair_brand);
                setVal('hair-oil', data.summary.personal_care.hair_oil);
                setVal('skincare-routine', data.summary.personal_care.routine);
            }
            // Diet
            if (data.summary.diet) {
                setVal('breakfast', data.summary.diet.breakfast);
                setVal('lunch', data.summary.diet.lunch);
                setVal('dinner', data.summary.diet.dinner);
                setVal('snacks', data.summary.diet.snacks);
            }
            // Activities
            if (data.summary.activities) {
                setVal('tasks-completed', data.summary.activities.tasks);
                setVal('travel-dest', data.summary.activities.travel);
                setVal('screen-time', data.summary.activities.screen_time);
                setVal('app-usage-intent', data.summary.activities.intent);

                if (data.summary.activities.top_apps) {
                    const rows = document.querySelectorAll('.app-row');
                    data.summary.activities.top_apps.forEach((app, i) => {
                        if (rows[i]) {
                            rows[i].querySelector('.app-name').value = app.name || "";
                            rows[i].querySelector('.app-time').value = app.time || "";
                        }
                    });
                }
            }
            // Daily
            if (data.summary.daily) {
                setVal('key-events', data.summary.daily.key_events);
                setVal('daily-summary', data.summary.daily.activity_summary);
                setVal('overall-exp', data.summary.daily.overall_exp);
                setVal('other-note-status', data.summary.daily.other_notes || "No"); // Assuming mapped
            }
        } else {
            // Backward Compatibility for old entries
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

            if (data.daily_activity_summary) setVal('daily-summary', data.daily_activity_summary);
            if (data.overall_day_experience) setVal('overall-exp', data.overall_day_experience);
        }

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

    // Helper for Syntax Highlighting
    syntaxHighlight(json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    renderHistory(searchTerm = "", filterMood = "all") {
        const list = document.getElementById('history-list');
        list.innerHTML = "";
        const entries = this.storage.getEntries();
        let sortedDates = Object.keys(entries).sort((a, b) => new Date(b) - new Date(a));

        // Filter Logic
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            sortedDates = sortedDates.filter(date => {
                const entry = entries[date];
                const text = JSON.stringify(entry).toLowerCase();
                return text.includes(lower);
            });
        }

        if (filterMood !== "all") {
            sortedDates = sortedDates.filter(date => {
                const entry = entries[date];
                const moodScore = entry.mental_and_emotional_health?.mood_timeline?.morning?.mood_level || 5;
                if (filterMood === 'happy' && moodScore >= 7) return true;
                if (filterMood === 'week') {
                    const d = new Date(date);
                    const now = new Date();
                    const diffTime = Math.abs(now - d);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 7;
                }
                if (filterMood === 'complete') {
                    // Simple check for now
                    return entry.daily_activity_summary && entry.daily_activity_summary.length > 0;
                }
                return false;
            });
        }

        if (sortedDates.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open" style="font-size:3rem; color:var(--text-secondary); margin-bottom:1rem;"></i>
                    <h3>No entries found</h3>
                    <p>Try adjusting filters or add a new entry.</p>
                </div>`;
            return;
        }

        sortedDates.forEach(date => {
            const entry = entries[date];
            const div = document.createElement('div');
            div.className = `history-card ${this.selectedEntries.has(date) ? 'selected' : ''} ${this.multiSelectMode ? 'multi-mode' : ''}`;
            div.dataset.date = date;

            // Mood & Summary
            const moodScore = entry.mental_and_emotional_health?.mood_timeline?.morning?.mood_level || 5;
            let moodEmoji = '😐';
            if (moodScore >= 9) moodEmoji = '🌟';
            else if (moodScore >= 7) moodEmoji = '😊';
            else if (moodScore <= 2) moodEmoji = '😢';
            else if (moodScore <= 4) moodEmoji = '😔';

            const summary = entry.daily_activity_summary || "No summary provided...";

            // Check status (simplified)
            const isComplete = entry.daily_activity_summary && entry.daily_activity_summary.length > 10;
            const statusHtml = isComplete
                ? `<span class="entry-status status-complete"><i class="fas fa-check-circle"></i> Complete</span>`
                : `<span class="entry-status status-incomplete"><i class="fas fa-exclamation-circle"></i> Incomplete</span>`;

            div.innerHTML = `
                <div class="select-checkbox"></div>
                
                <div class="entry-header">
                    <div class="date-badge"><i class="fas fa-calendar-alt"></i> ${date}</div>
                    <div class="mood-indicator" title="Mood Level: ${moodScore}">${moodEmoji}</div>
                </div>
                
                <div class="entry-preview">${summary.substring(0, 60)}${summary.length > 60 ? '...' : ''}</div>
                ${statusHtml}
                
                <div class="action-row">
                    <button class="icon-action-btn" onclick="app.ui.loadHistory('${date}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="icon-action-btn" onclick="app.ui.exportOne('${date}')" title="Export JSON"><i class="fas fa-download"></i></button>
                    <button class="icon-action-btn expand-btn" title="View Data"><i class="fas fa-code"></i></button>
                    <button class="icon-action-btn delete-btn" onclick="app.ui.deleteOne('${date}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>

                <div class="expanded-view">
                    <pre>${this.syntaxHighlight(entry)}</pre>
                    <button class="import-btn mt-2" onclick="navigator.clipboard.writeText(this.previousElementSibling.innerText); alert('Copied!');" style="padding:8px; font-size:0.8rem;">
                        <i class="fas fa-copy"></i> Copy JSON
                    </button>
                </div>
            `;

            // Expand Toggle
            div.querySelector('.expand-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const view = div.querySelector('.expanded-view');
                view.classList.toggle('show');
            });

            // Card Click (Selection or Edit)
            div.addEventListener('click', (e) => {
                if (e.target.closest('button') || e.target.closest('.expanded-view')) return;

                if (this.multiSelectMode) {
                    this.toggleSelection(date, div);
                } else {
                    // Open edit (default action)
                    this.loadHistory(date);
                }
            });

            // Long Press
            div.addEventListener('mousedown', () => {
                this.longPressTimer = setTimeout(() => this.enterMultiSelect(date, div), 600);
            });
            div.addEventListener('touchstart', () => {
                this.longPressTimer = setTimeout(() => this.enterMultiSelect(date, div), 600);
            }, { passive: true });
            ['mouseup', 'mouseleave', 'touchend', 'touchmove'].forEach(evt => {
                div.addEventListener(evt, () => clearTimeout(this.longPressTimer));
            });

            list.appendChild(div);
        });
    }

    enterMultiSelect(initialDate, element) {
        if (this.multiSelectMode) return;
        this.multiSelectMode = true;

        // Show Bottom Bar
        const bar = document.getElementById('multi-action-bar');
        bar.classList.remove('hidden');

        // Shift UI
        document.querySelectorAll('.history-card').forEach(el => el.classList.add('multi-mode'));

        if (navigator.vibrate) navigator.vibrate(50);

        this.toggleSelection(initialDate, element);
    }

    exitMultiSelect() {
        this.multiSelectMode = false;
        this.selectedEntries.clear();

        // Hide Bottom Bar
        document.getElementById('multi-action-bar').classList.add('hidden');

        // Reset UI
        document.querySelectorAll('.history-card').forEach(el => {
            el.classList.remove('multi-mode', 'selected');
        });
        document.getElementById('multi-count').innerText = '0';
    }

    toggleSelection(date, element) {
        if (this.selectedEntries.has(date)) {
            this.selectedEntries.delete(date);
            element.classList.remove('selected');
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
                // Populate Fields
                document.getElementById('weather-condition').value = prevData.environment.weather_condition || "";

                // Handle Temp Range (stored as "18-32" or single value)
                const temp = prevData.environment.temperature_c || "";
                if (temp.includes('-')) {
                    const parts = temp.split('-');
                    document.getElementById('temp-min').value = parts[0];
                    document.getElementById('temp-max').value = parts[1];
                } else {
                    document.getElementById('temp-min').value = temp;
                }

                document.getElementById('aqi').value = prevData.environment.air_quality_index || 50;
                document.getElementById('humidity').value = prevData.environment.humidity_percent || 50;
                document.getElementById('uv-index').value = prevData.environment.uv_index || 0;
                document.getElementById('env-experience').value = prevData.environment.environment_experience || "";

                // Trigger updates for sliders
                document.getElementById('aqi').dispatchEvent(new Event('input'));
                document.getElementById('uv-index').dispatchEvent(new Event('input'));
                document.getElementById('humidity').dispatchEvent(new Event('input'));

                this.showToast('Basic data imported from previous day');
            }
        } else if (section === 'personal_care') {
            // Support both new (summary.personal_care) and legacy (personal_care)
            const pc = prevData.summary?.personal_care || prevData.personal_care;

            if (pc) {
                document.getElementById('face-name').value = pc.face_name || pc.face_product_name || "";
                document.getElementById('face-brand').value = pc.face_brand || pc.face_product_brand || "";
                document.getElementById('hair-name').value = pc.hair_name || pc.hair_product_name || "";
                document.getElementById('hair-brand').value = pc.hair_brand || pc.hair_product_brand || "";
                document.getElementById('hair-oil').value = pc.hair_oil || "";
                document.getElementById('skincare-routine').value = pc.routine || pc.skincare_routine || "";
                this.showToast('Personal Care data imported');
            }
        }
    }
}
