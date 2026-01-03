# Personal Diary PWA - Simplified Structure

## Navigation Structure

### Bottom Tab Navigation (5 Tabs Only)
```
[🏠 Basic] [💪 Body] [🧠 Mental] [📝 Summary] [📚 History]
```

---

## Tab Details

### 1. 🏠 Basic Tab
**Environment & Date Information**

**Fields:**
- Date picker with prev/next navigation
- Day counter (days since reference date: July 4, 2003)
- Weekday display
- Temperature range (scroll selector: min-max in °C)
- Weather condition (dropdown: Sunny, Rainy, Cloudy, etc.)
- Air Quality Index (scroll selector: 0-300)
- Humidity percentage (scroll selector: 1-100%)
- UV Index (slider: 1-12)
- Environment experience (text input with suggestions)

**Features:**
- Import from last day button (copy previous day's environment data)
- Auto-suggestions based on history
- Scroll selectors for precise number input

---

### 2. 💪 Body Tab
**Physical Health & Fitness**

**Fields:**
- Weight (kg)
- Height (cm)
- Chest measurement (cm)
- Belly measurement (cm)
- Sleep hours (time input: HH:MM)
- Sleep quality (slider: 1-10 with emoji feedback)
- Sleep quality description (text)
- Steps count
- Steps distance (km)
- Kilocalories burned
- Water intake (liters)
- Medications taken (text)
- Physical symptoms (text)

**Features:**
- Default values for weight/height/measurements
- Visual feedback on sliders
- Quick input for common values

---

### 3. 🧠 Mental Tab
**Mental & Emotional Health**

**Sections:**

**A. Mental State**
- Mental state (dropdown: Positive, Neutral, Negative, etc.)
- Mental state reason (textarea with word/char counter)

**B. Mood Timeline** (Most Important Feature)
Four time periods with identical structure:
- 🌅 **Morning**
- ☀️ **Afternoon**
- 🌆 **Evening**
- 🌙 **Night**

Each period has:
1. Mood level slider (1-10)
2. Mood category dropdown:
   - Positive High Energy (happy, calm, peaceful, relaxed, content, motivated, energetic, confident, hopeful, satisfied)
   - Neutral Balanced (neutral, normal, stable, okay, composed, indifferent)
   - Low Energy Tired (tired, sleepy, exhausted, lazy, drained, dull)
   - Negative Heavy (stressed, anxious, irritated, frustrated, overwhelmed, sad, low, lonely, bored)
   - Cognitive Mental States (focused, distracted, confused, overthinking, mentally_heavy, mentally_clear)
3. Mood feeling dropdown (populated based on category selection)

**C. Energy & Stress**
- Energy level (slider: 1-10)
- Energy reason (textarea with word/char counter)
- Stress level (slider: 1-10)
- Stress reason (textarea with word/char counter)

**D. Meditation**
- Meditation status (dropdown: Yes, No, Na)
- Meditation duration (minutes)

**Features:**
- Cascading dropdowns (category → feeling)
- Auto-save mood data with category
- Visual mood indicators (emojis/colors)
- Word/character counters on textareas

---

### 4. 📝 Summary Tab
**Daily Summary & Notes**

**Sections:**

**A. Personal Care**
- Face product name (with suggestions)
- Face product brand (with suggestions)
- Hair product name (with suggestions)
- Hair product brand (with suggestions)
- Hair oil (with suggestions)
- Skincare routine (text)
- Import from last day button

**B. Diet & Nutrition**
- Breakfast (text with suggestions)
- Lunch (text with suggestions)
- Dinner (text with suggestions)
- Additional items/snacks (text with suggestions)

**C. Activities & Productivity**
- Tasks completed today (textarea)
- Travel destination (text)
- Phone screen time (time input: HH:MM)
- Top 5 most used apps:
  - App 1-5: Name + Time spent
- App usage intent (text: productive/entertainment/social)
- Auto-suggestions for app names based on frequency

**D. Daily Summary**
- Key events (textarea with word/char counter)
- Daily activity summary (textarea with word/char counter)
- Overall day experience (textarea with word/char counter)
- Other note status (Yes/No)

**Features:**
- Smart suggestions from previous entries
- Word/character counters
- Import personal care from last day
- App name auto-complete

---

### 5. 📚 History Tab
**View & Manage Past Entries**

**Features:**
- Chronological list (newest first)
- Entry cards showing:
  - Date (with weekday)
  - Preview text (first 50 chars of summary)
  - Empty field indicator (red dot if incomplete)
  - Mood indicator (emoji/color from mood timeline)
- Actions per entry:
  - **Tap**: Edit entry (load into form)
  - **Export button**: Download as JSON
  - **Delete button**: Remove entry (with confirmation)
  - **Expand button**: View full JSON data
  - **Copy JSON button**: Copy to clipboard
- **Long-press**: Activate multi-select mode
- **Multi-select mode**:
  - Checkboxes appear on all entries
  - Select multiple entries
  - Bulk export (download all selected as single JSON array)
  - Bulk delete (with confirmation)
  - Cancel button to exit multi-select
- **No history message**: Friendly empty state
- **Search/Filter** (optional): By date, mood, keywords

**UI Elements:**
- Smooth animations on expand/collapse
- Swipe gestures for quick actions
- Visual feedback on selection
- Loading states for large lists

---

## Header (Top Bar) - Detailed Breakdown

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [◀] [📅 Monday, Jan 15] [▶]    [💾] [📥] [⋮]              │
└─────────────────────────────────────────────────────────────┘
```

### Left Section: Date Controls
**1. Previous Day Button [◀]**
- Icon: `fa-chevron-left`
- Function: Load previous day's entry
- Behavior: Decrements date by 1 day
- Auto-saves current entry before switching

**2. Current Date Display [📅 Monday, Jan 15]**
- Shows: Weekday + formatted date
- Icon: `fa-calendar-alt`
- Function: Clickable to open date picker
- Behavior: Opens native date picker on click
- Format: "Weekday, Month Day" (e.g., "Monday, Jan 15")

**3. Next Day Button [▶]**
- Icon: `fa-chevron-right`
- Function: Load next day's entry
- Behavior: Increments date by 1 day
- Auto-saves current entry before switching

### Right Section: Action Buttons

**4. Save Button [💾]**
- Icon: `fa-save`
- Function: Save current form data to LocalStorage
- Behavior:
  - Saves all form fields including mood categories
  - Shows success toast notification
  - Updates history list if on history tab
  - Loading state (spinner) during save
- Tooltip: "Save Form Data Locally"

**5. Download/Export Button [📥]**
- Icon: `fa-file-arrow-down`
- Function: Export current entry as JSON
- Behavior:
  - Generates JSON from current form data
  - Downloads as `YYYY-MM-DD.json`
  - Shows success toast
  - Loading state during generation
- Tooltip: "Download Diary (Export JSON)"

**6. Three-Dot Menu Button [⋮]**
- Icon: `fa-ellipsis-v`
- Function: Opens dropdown menu with more options
- Tooltip: "More options"

**Dropdown Menu Items:**

**a. Share Current Entry** 📤
- Icon: `fa-share-alt`
- Function: Share entry via native share API (mobile) or download (desktop)
- Behavior:
  - Mobile: Opens native share sheet with JSON file
  - Desktop: Downloads JSON file
  - Disabled in multi-select mode

**b. Import JSON** 📂
- Icon: `fa-file-import`
- Function: Import one or multiple JSON files
- Behavior:
  - Opens file picker (accepts .json, multiple files)
  - Parses and validates JSON
  - Saves to LocalStorage
  - Loads last imported entry into form
  - Shows success toast with count
  - Updates history list

**c. Clear Form** 🗑️
- Icon: `fa-trash-alt`
- Function: Clear current form and delete saved data for current date
- Behavior:
  - Shows confirmation dialog
  - Clears all form fields
  - Removes entry from LocalStorage
  - Resets to default values
  - Updates history list

**d. Create Backup** 💾
- Icon: `fa-download`
- Function: Export all entries as single JSON file
- Behavior:
  - Generates JSON array of all entries
  - Downloads as `diary-backup-YYYY-MM-DD-HHMMSS.json`
  - Shows success toast with entry count

**e. Import Backup** 📥
- Icon: `fa-upload`
- Function: Restore from backup file
- Behavior:
  - Opens file picker (accepts .json)
  - Shows confirmation with entry count
  - Imports all entries to LocalStorage
  - Reloads current date
  - Updates history list

**f. Hard Refresh** 🔄
- Icon: `fa-sync-alt`
- Function: Clear cache and reload app
- Behavior:
  - Shows confirmation dialog
  - Unregisters service worker
  - Clears cache
  - Force reloads page
  - Useful for updates

**g. Settings** ⚙️
- Icon: `fa-cog`
- Function: Open settings page
- Behavior:
  - Auto-saves current form
  - Navigates to settings.html
  - Settings include:
    - Theme (Dark/Light/AMOLED Black)
    - Font size
    - Splash screen duration
    - Notifications
    - Password/Pattern lock

### Multi-Select Mode (Activated in History Tab)

**Additional Header Elements (appear when multi-select is active):**

**7. Selection Counter**
- Display: "X selected"
- Shows count of selected entries
- Visible only in multi-select mode

**8. Export Selected Button** 📤
- Icon: `fa-file-export`
- Function: Export selected entries
- Behavior:
  - Generates JSON array of selected entries
  - Downloads as `diary_export_multiple_YYYYMMDD.json`
  - Exits multi-select mode
- Disabled when no entries selected

**9. Delete Selected Button** 🗑️
- Icon: `fa-trash`
- Function: Delete selected entries
- Behavior:
  - Shows confirmation with count
  - Deletes all selected entries
  - Updates history list
  - Exits multi-select mode
- Disabled when no entries selected

**10. Cancel Multi-Select Button** ❌
- Icon: `fa-times`
- Function: Exit multi-select mode
- Behavior:
  - Deselects all entries
  - Hides multi-select UI
  - Returns to normal mode

---

## JSON Output Structure

```json
{
  "version": "1.0",
  "date": "2024-01-15",
  "day_id": 7500,
  "weekday": "Monday",
  
  "environment": {
    "temperature_c": "20-30",
    "air_quality_index": 80,
    "humidity_percent": 60,
    "uv_index": 9,
    "weather_condition": "Sunny",
    "environment_experience": "Pleasant weather"
  },
  
  "body_measurements": {
    "weight_kg": 72,
    "height_cm": 178,
    "chest": 90,
    "belly": 89
  },
  
  "health_and_fitness": {
    "sleep_hours": "8:00",
    "sleep_quality": 8,
    "sleep_quality_description": "Deep sleep",
    "steps_count": 10000,
    "steps_distance_km": 7.5,
    "kilocalorie": 2200,
    "water_intake_liters": 3.5,
    "medications_taken": "None",
    "physical_symptoms": "No"
  },
  
  "mental_and_emotional_health": {
    "mental_state": "Positive",
    "mental_state_reason": "Had a productive day",
    "mood_timeline": {
      "morning": {
        "mood_level": 8,
        "mood_category": "positive_high_energy",
        "mood_feeling": "energetic"
      },
      "afternoon": {
        "mood_level": 7,
        "mood_category": "positive_high_energy",
        "mood_feeling": "motivated"
      },
      "evening": {
        "mood_level": 6,
        "mood_category": "neutral_balanced",
        "mood_feeling": "calm"
      },
      "night": {
        "mood_level": 5,
        "mood_category": "low_energy_tired",
        "mood_feeling": "tired"
      }
    },
    "energy_level": 7,
    "energy_reason": "Good sleep and exercise",
    "stress_level": 3,
    "stress_reason": "Minor work deadline",
    "meditation_status": "Yes",
    "meditation_duration_min": 15
  },
  
  "personal_care": {
    "face_product_name": "Cleanser",
    "face_product_brand": "Cetaphil",
    "hair_product_name": "Shampoo",
    "hair_product_brand": "Dove",
    "hair_oil": "Coconut oil",
    "skincare_routine": "Morning and night"
  },
  
  "diet_and_nutrition": {
    "breakfast": "Oatmeal with fruits",
    "lunch": "Chicken salad",
    "dinner": "Rice and vegetables",
    "additional_items": "Protein shake, almonds"
  },
  
  "activities_and_productivity": {
    "tasks_today_english": "Completed project report, gym workout, grocery shopping",
    "travel_destination": "Office and gym",
    "phone_screen_on_hr": "5:30",
    "most_used_apps": [
      { "rank": 1, "name": "YouTube", "time": "2:30" },
      { "rank": 2, "name": "Instagram", "time": "1:45" },
      { "rank": 3, "name": "WhatsApp", "time": "1:00" },
      { "rank": 4, "name": "Chrome", "time": "0:45" },
      { "rank": 5, "name": "Spotify", "time": "0:30" }
    ],
    "app_usage_intent": "Mix of productive and entertainment"
  },
  
  "additional_notes": {
    "key_events": "Team meeting, gym session, dinner with family",
    "other_note_status": "No"
  },
  
  "daily_activity_summary": "Productive day with good balance of work, exercise, and family time. Completed all planned tasks.",
  
  "overall_day_experience": "Overall a great day. Felt energetic in the morning, stayed productive throughout, and ended with quality family time. Looking forward to tomorrow."
}
```

---

## Key Features Summary

### Data Management
✅ Auto-save on date change
✅ Manual save button
✅ Single entry export
✅ Multiple entry import
✅ Full backup creation
✅ Backup restore
✅ Share via native API
✅ Clear form with confirmation

### Mood Timeline (Critical Feature)
✅ 4 time periods (Morning, Afternoon, Evening, Night)
✅ Mood level slider (1-10)
✅ Mood category dropdown (5 categories)
✅ Mood feeling dropdown (cascading, based on category)
✅ **Must save category with feeling**
✅ **Must load category when switching dates**
✅ **Must work with import/export**

### History Management
✅ Chronological list view
✅ Entry preview cards
✅ Edit/Export/Delete per entry
✅ View/Copy JSON
✅ Long-press multi-select
✅ Bulk export/delete
✅ Empty field indicators

### UI/UX
✅ Mobile-first responsive design
✅ Smooth 60fps animations
✅ Touch-optimized controls
✅ Bottom tab navigation
✅ Swipe between tabs
✅ Toast notifications
✅ Loading states
✅ Confirmation dialogs

### PWA Features
✅ Offline functionality
✅ Install as app
✅ Service worker caching
✅ Manifest.json
✅ App icons
✅ Splash screen

---

## Development Priority

### Phase 1: Core Structure
1. HTML structure with 5 tabs
2. Header with all buttons
3. Basic CSS styling
4. Tab navigation

### Phase 2: Forms
1. Basic tab (environment)
2. Body tab (health)
3. Mental tab (with mood timeline)
4. Summary tab (care, diet, activities, notes)

### Phase 3: Data Management
1. LocalStorage save/load
2. Date navigation
3. Form validation
4. Auto-save

### Phase 4: Import/Export
1. Single entry export
2. Multiple entry import
3. Backup creation
4. Backup restore
5. Share functionality

### Phase 5: History
1. List view
2. Entry cards
3. Edit/Export/Delete
4. Multi-select mode
5. Bulk operations

### Phase 6: Polish
1. Animations
2. Loading states
3. Error handling
4. PWA features
5. Settings page

---

## Testing Checklist

- [ ] All 5 tabs work
- [ ] Date navigation works
- [ ] Save button saves all data
- [ ] Mood category + feeling save together
- [ ] Mood loads correctly on date change
- [ ] Export creates valid JSON
- [ ] Import loads data correctly
- [ ] History shows all entries
- [ ] Multi-select works
- [ ] Bulk operations work
- [ ] Responsive on mobile
- [ ] Works offline
- [ ] Installs as PWA

---

**Ready to build! Start with HTML structure, then CSS, then JavaScript functionality.**
