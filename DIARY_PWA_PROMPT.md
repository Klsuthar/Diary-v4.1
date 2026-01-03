# Personal Diary PWA - Complete Development Prompt

## Project Overview
Build a modern, mobile-first Progressive Web App (PWA) for personal diary management with smooth UI/UX, offline capabilities, and comprehensive data management features.

---

## Core Requirements

### 1. Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: LocalStorage for data persistence
- **PWA**: Service Worker for offline functionality
- **Icons**: Font Awesome 6.x or similar
- **No frameworks**: Keep it lightweight and fast

### 2. Mobile-First Design
- **Responsive**: Works perfectly on 320px to 4K screens
- **Touch-optimized**: Large tap targets (min 44x44px)
- **Smooth animations**: 60fps transitions using CSS transforms
- **Bottom navigation**: Easy thumb access on mobile
- **Swipe gestures**: Navigate between tabs/dates
- **Pull-to-refresh**: Native-like experience
- **Safe areas**: Respect notch/camera cutouts

### 3. Modern UI/UX Design

#### Color Scheme
```css
/* Dark Theme (Default) */
--primary-bg: #0f172a
--secondary-bg: #1e293b
--accent: #f59e0b
--text-primary: #f8fafc
--text-secondary: #94a3b8

/* Light Theme */
--primary-bg: #fafbfc
--secondary-bg: #ffffff
--accent: #f59e0b
--text-primary: #0f172a
--text-secondary: #334155

/* AMOLED Black Theme */
--primary-bg: #000000
--secondary-bg: #0a0a0a
--accent: #f59e0b
```

#### UI Components
- **Glassmorphism effects**: backdrop-filter, transparency
- **Smooth shadows**: Layered, subtle depth
- **Rounded corners**: 12-16px border-radius
- **Micro-interactions**: Button press, hover states
- **Loading states**: Skeleton screens, spinners
- **Toast notifications**: Non-intrusive feedback
- **Modal dialogs**: Smooth slide-up animations

### 4. Form Structure

#### Daily Entry Fields

**📅 Basic Info**
- Date picker (with prev/next navigation)
- Day counter (days since reference date)
- Weekday display

**🌤️ Environment**
- Temperature range (scroll selector)
- Weather condition (dropdown with icons)
- Air quality index
- Humidity percentage
- UV index (slider)
- Environment experience (text)

**💪 Health & Fitness**
- Sleep hours (time picker)
- Sleep quality (1-10 slider with emoji)
- Steps count
- Distance (km)
- Calories burned
- Water intake (liters)
- Weight, Height, Body measurements
- Medications taken
- Physical symptoms

**🧠 Mental & Emotional**
- Mental state (dropdown)
- Mental state reason (textarea)
- **Mood Timeline** (4 time periods):
  - Morning 🌅
  - Afternoon ☀️
  - Evening 🌆
  - Night 🌙
  - Each with: Mood level (1-10 slider) + Mood category + Mood feeling
- Energy level (1-10 slider)
- Stress level (1-10 slider)
- Meditation status & duration

**🧴 Personal Care**
- Face product (name + brand)
- Hair product (name + brand)
- Hair oil
- Skincare routine

**🍽️ Diet & Nutrition**
- Breakfast
- Lunch
- Dinner
- Additional items/snacks

**📱 Activities & Productivity**
- Tasks completed (textarea)
- Travel destination
- Phone screen time
- Top 5 most used apps (name + time)
- App usage intent

**📝 Notes & Summary**
- Key events (textarea)
- Daily activity summary (textarea with word/char count)
- Overall day experience (textarea with word/char count)
- Other notes status

### 5. Navigation & Layout

#### Bottom Tab Navigation
```
[🏠 Basic] [💪 Health] [🧠 Mental] [🍽️ Diet] [📱 Apps] [📝 Notes] [📚 History]
```

- Smooth horizontal swipe between tabs
- Active tab indicator
- Icon + label for clarity
- Empty field indicators (red dot)

#### Top Bar
- Date controls (prev/next arrows)
- Current date display (clickable)
- Save button
- Export button
- 3-dot menu (more options)

### 6. Data Management Features

#### Import/Export
- **Single entry export**: Download as `YYYY-MM-DD.json`
- **Multiple entry import**: Drag & drop or file picker
- **Backup creation**: Export all entries
- **Backup restore**: Import full backup
- **Share entry**: Native share API (mobile)

#### JSON Output Format
```json
{
  "version": "1.0",
  "date": "2024-01-15",
  "day_id": 7500,
  "weekday": "Monday",
  "environment": {
    "temperature_c": "20-30",
    "weather_condition": "Sunny",
    "air_quality_index": 80,
    "humidity_percent": 60,
    "uv_index": 9,
    "environment_experience": "Pleasant weather"
  },
  "health_and_fitness": {
    "sleep_hours": "8:00",
    "sleep_quality": 8,
    "steps_count": 10000,
    "water_intake_liters": 3.5,
    "energy_level": 7,
    "stress_level": 3
  },
  "mental_and_emotional_health": {
    "mental_state": "Positive",
    "mood_timeline": {
      "morning": {
        "mood_level": 8,
        "mood_category": "positive_high_energy",
        "mood_feeling": "energetic"
      },
      "afternoon": { "mood_level": 7, "mood_category": "...", "mood_feeling": "..." },
      "evening": { "mood_level": 6, "mood_category": "...", "mood_feeling": "..." },
      "night": { "mood_level": 5, "mood_category": "...", "mood_feeling": "..." }
    },
    "meditation_status": "Yes",
    "meditation_duration_min": 15
  },
  "personal_care": { "face_product_name": "...", "face_product_brand": "..." },
  "diet_and_nutrition": { "breakfast": "...", "lunch": "...", "dinner": "..." },
  "activities_and_productivity": {
    "tasks_today_english": "...",
    "phone_screen_on_hr": "5:30",
    "most_used_apps": [
      { "rank": 1, "name": "YouTube", "time": "2:30" },
      { "rank": 2, "name": "Instagram", "time": "1:45" }
    ]
  },
  "daily_activity_summary": "...",
  "overall_day_experience": "..."
}
```

### 7. History & Search

#### History View
- **List view**: Chronological entries (newest first)
- **Entry cards**: Date, preview, mood indicator
- **Actions per entry**:
  - Edit (tap to load)
  - Export (download JSON)
  - Delete (with confirmation)
  - View JSON (expandable)
- **Multi-select mode**: Long-press to activate
  - Select multiple entries
  - Bulk export
  - Bulk delete
- **Empty state indicator**: Visual cue for incomplete entries
- **Search/Filter**: By date range, mood, keywords

### 8. PWA Features

#### Manifest.json
```json
{
  "name": "My Personal Diary",
  "short_name": "Diary",
  "description": "Track your daily life, health, mood, and activities",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#f59e0b",
  "orientation": "portrait",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

#### Service Worker
- Cache static assets (HTML, CSS, JS, icons)
- Offline functionality
- Background sync (when online)
- Update notifications
- Cache-first strategy for assets
- Network-first for data

### 9. Advanced Features

#### Smart Suggestions
- Auto-suggest based on previous entries
- Frequently used apps
- Common meals
- Regular products

#### Data Insights (Optional)
- Mood trends graph
- Sleep quality chart
- Activity heatmap
- Health metrics overview

#### Settings
- Theme selection (Dark/Light/AMOLED)
- Font size adjustment
- Notification preferences
- Password/Pattern lock
- Auto-save interval
- Splash screen duration
- Export format preferences

#### Notifications
- Daily reminder (customizable time)
- Incomplete entry reminder
- Backup reminder (weekly)

### 10. Performance Optimization

- **Lazy loading**: Load tabs on demand
- **Virtual scrolling**: For long history lists
- **Debounced inputs**: Reduce unnecessary updates
- **Optimized images**: WebP format, compressed
- **Minified assets**: CSS/JS compression
- **Code splitting**: Separate chunks for features
- **LocalStorage optimization**: Compress large data

### 11. Accessibility

- **ARIA labels**: Screen reader support
- **Keyboard navigation**: Full keyboard access
- **Focus indicators**: Clear focus states
- **Color contrast**: WCAG AA compliant
- **Font scaling**: Respect system font size
- **Reduced motion**: Respect prefers-reduced-motion

### 12. Security & Privacy

- **Local-only storage**: No cloud, no tracking
- **Optional encryption**: Password/pattern lock
- **No analytics**: Complete privacy
- **Secure export**: User-controlled data
- **Clear data option**: Complete wipe

---

## File Structure
```
diary-pwa/
├── index.html
├── manifest.json
├── sw.js (service worker)
├── css/
│   └── style.css
├── js/
│   ├── app.js (main logic)
│   ├── storage.js (data management)
│   └── ui.js (UI interactions)
├── images/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── logo.png
└── README.md
```

---

## Development Guidelines

### Code Quality
- Clean, readable code with comments
- Consistent naming conventions
- Modular functions (single responsibility)
- Error handling for all operations
- Input validation and sanitization

### Browser Support
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Testing Checklist
- [ ] Works offline
- [ ] Installs as PWA
- [ ] All forms save correctly
- [ ] Import/Export works
- [ ] Responsive on all screen sizes
- [ ] Touch gestures work
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] LocalStorage doesn't exceed limits
- [ ] Theme switching works
- [ ] Date navigation works
- [ ] History view loads fast
- [ ] Multi-select works
- [ ] Notifications work

---

## Deployment

### Hosting Options
- GitHub Pages (free, easy)
- Netlify (free, auto-deploy)
- Vercel (free, fast)
- Firebase Hosting (free tier)

### HTTPS Required
- PWA requires HTTPS
- Use free SSL (Let's Encrypt)
- Or use hosting with built-in SSL

---

## Example Prompts for AI Agent

### Initial Setup
```
Create a mobile-first PWA diary app with:
- Modern glassmorphism UI
- Dark/Light/AMOLED themes
- Bottom tab navigation
- Smooth animations
- LocalStorage persistence
- Service worker for offline use
```

### Form Implementation
```
Add a comprehensive daily entry form with:
- Environment tracking (temperature, weather, AQI)
- Health metrics (sleep, steps, water intake)
- Mood timeline (4 time periods with category + feeling dropdowns)
- Personal care, diet, activities sections
- Auto-save functionality
- Word/character counters for textareas
```

### Data Management
```
Implement import/export features:
- Export single entry as JSON
- Import multiple JSON files
- Full backup creation
- Backup restore
- Native share API for mobile
- Proper JSON structure with nested objects
```

### History View
```
Create a history view with:
- Chronological list of entries
- Entry preview cards
- Edit/Export/Delete actions
- Long-press multi-select mode
- Bulk operations
- Empty field indicators
- Smooth animations
```

### PWA Features
```
Add PWA capabilities:
- manifest.json with proper icons
- Service worker with cache strategies
- Install prompt
- Offline functionality
- Update notifications
- Background sync
```

---

## Success Criteria

✅ **Functional**
- All forms save and load correctly
- Import/Export works flawlessly
- Offline mode works
- No data loss

✅ **Performance**
- Loads in < 2 seconds
- Smooth 60fps animations
- No lag on form inputs
- Fast history loading

✅ **Design**
- Beautiful, modern UI
- Consistent design language
- Intuitive navigation
- Delightful micro-interactions

✅ **Mobile Experience**
- Perfect on all screen sizes
- Touch-optimized
- Native-like feel
- Installs as PWA

---

## Additional Notes

- Keep bundle size < 500KB
- Use CSS Grid/Flexbox for layouts
- Implement proper error boundaries
- Add loading states everywhere
- Use semantic HTML
- Follow mobile-first approach
- Test on real devices
- Optimize for battery life

---

**Ready to build? Start with the HTML structure, then CSS styling, then JavaScript functionality. Test frequently on mobile devices!**
