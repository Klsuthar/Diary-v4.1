# 📝 Summary Tab - UI Design Guide

## 🤖 AI Agent Instructions

### Design Philosophy
Create a **comprehensive, reflection-focused UI** with these principles:
- **Card-based Layout**: White cards with rounded corners (12px), shadows, 16px padding
- **Visual Hierarchy**: Personal care → Diet → Activities → Daily summary
- **Smart Suggestions**: Auto-complete based on previous entries
- **Import Feature**: Copy personal care data from last day
- **Character Counters**: On all textarea inputs
- **Time Tracking**: Screen time and app usage monitoring
- **Productivity Focus**: Track tasks, travel, and app usage intent

### Component Structure Pattern
```
Card Container
├── Section Header (Icon + Title + Import Button)
├── Input Fields (Text inputs with suggestions)
│   ├── Product Name (with autocomplete)
│   └── Product Brand (with autocomplete)
└── Suggestion Chips (Based on history)
```

### Key UI Sections

**1. Personal Care Section**
- Face product name + brand (with suggestions)
- Hair product name + brand (with suggestions)
- Hair oil (with suggestions)
- Skincare routine (textarea)
- Import from last day button

**2. Diet & Nutrition Section**
- Breakfast (text input with suggestions)
- Lunch (text input with suggestions)
- Dinner (text input with suggestions)
- Additional items/snacks (text input with suggestions)

**3. Activities & Productivity Section**
- Tasks completed today (textarea)
- Travel destination (text input)
- Phone screen time (HH:MM format)
- Top 5 most used apps (Name + Time for each)
- App usage intent (text: productive/entertainment/social)

**4. Daily Summary Section**
- Key events (textarea with counter)
- Daily activity summary (textarea with counter)
- Overall day experience (textarea with counter)
- Other note status (Yes/No toggle)

### Color Palette
```
Primary: #667eea (Purple)
Success: #00e400 (Green) - Productive activities
Info: #4a90e2 (Blue) - Information fields
Background: #fff (cards), #f5f5f5 (input containers)
Text: #333 (dark), #666 (muted)
Borders: #e0e0e0
Suggestion: #f0f0f0 (chips background)
```

### Layout Structure
```
┌─────────────────────────────────────────────┐
│  💆 Personal Care        [📋 Import Last]   │
│  Face Product:                              │
│  Name: [Cetaphil Cleanser...]              │
│  💡 Cetaphil | Neutrogena | CeraVe          │
│  Brand: [Cetaphil]                          │
│  💡 Cetaphil | Neutrogena | L'Oreal         │
│                                             │
│  Hair Product:                              │
│  Name: [Pantene Shampoo...]                │
│  💡 Pantene | Head & Shoulders | Dove       │
│  Brand: [Pantene]                           │
│  💡 Pantene | Unilever | P&G                │
│                                             │
│  Hair Oil: [Coconut oil]                    │
│  💡 Coconut | Almond | Argan                │
│                                             │
│  Skincare Routine:                          │
│  [Cleanser, toner, moisturizer...]         │
│  85/200 characters                          │
├─────────────────────────────────────────────┤
│  🍽️ Diet & Nutrition                       │
│  Breakfast: [Oatmeal with fruits...]       │
│  💡 Oatmeal | Eggs | Toast | Smoothie       │
│                                             │
│  Lunch: [Chicken salad with rice...]       │
│  💡 Rice | Chicken | Salad | Pasta          │
│                                             │
│  Dinner: [Grilled fish with vegetables...] │
│  💡 Fish | Vegetables | Soup | Curry        │
│                                             │
│  Snacks: [Apple, nuts, protein bar...]     │
│  💡 Fruits | Nuts | Yogurt | Chips          │
├─────────────────────────────────────────────┤
│  📱 Activities & Productivity               │
│  Tasks Completed:                           │
│  [- Finished project report                │
│   - Attended team meeting                   │
│   - Replied to emails...]                   │
│  145/500 characters                         │
│                                             │
│  Travel: [Office, Gym, Grocery store]      │
│  💡 Office | Gym | Home | Mall              │
│                                             │
│  Screen Time: [05:30] HH:MM                │
│                                             │
│  Top 5 Apps:                                │
│  1. [Chrome]      [02:15] HH:MM            │
│  2. [VS Code]     [01:30] HH:MM            │
│  3. [YouTube]     [00:45] HH:MM            │
│  4. [WhatsApp]    [00:30] HH:MM            │
│  5. [Instagram]   [00:30] HH:MM            │
│  💡 Chrome | YouTube | Instagram            │
│                                             │
│  Usage Intent:                              │
│  [Mostly productive - coding and work]     │
│  💡 Productive | Entertainment | Social     │
├─────────────────────────────────────────────┤
│  📖 Daily Summary                           │
│  Key Events:                                │
│  [Important meeting with client,           │
│   completed major milestone...]            │
│  120/300 characters                         │
│                                             │
│  Activity Summary:                          │
│  [Productive day at work, good workout,    │
│   quality time with family...]             │
│  180/500 characters                         │
│                                             │
│  Overall Experience:                        │
│  [Felt accomplished and satisfied.         │
│   Energy levels were good throughout...]   │
│  150/500 characters                         │
│                                             │
│  Other Notes: [Yes ▼]                       │
└─────────────────────────────────────────────┘
```

---

## UI Components Breakdown

### 1. 💆 Personal Care Card

**Visual Design:**
- White card with personal care icon
- Import button in top-right corner
- Four subsections: Face, Hair, Hair Oil, Skincare Routine
- Each with suggestion chips below

**Section Header:**
- Icon: 💆 (person getting massage)
- Title: "Personal Care"
- Import button: Purple, icon 📋, text "Import from Last Day"
- Button position: Top-right, aligned with title

**Face Product Inputs:**
- **Name Input:**
  - Label: "Face Product Name"
  - Text input with autocomplete
  - Placeholder: "e.g., Cetaphil Gentle Cleanser"
  - Suggestion chips below: Cetaphil, Neutrogena, CeraVe, Nivea, Garnier
  
- **Brand Input:**
  - Label: "Brand"
  - Text input with autocomplete
  - Placeholder: "e.g., Cetaphil"
  - Suggestion chips below: Cetaphil, Neutrogena, L'Oreal, Unilever, P&G

**Hair Product Inputs:**
- **Name Input:**
  - Label: "Hair Product Name"
  - Text input with autocomplete
  - Placeholder: "e.g., Pantene Pro-V Shampoo"
  - Suggestion chips: Pantene, Head & Shoulders, Dove, Sunsilk, TRESemmé
  
- **Brand Input:**
  - Label: "Brand"
  - Text input with autocomplete
  - Placeholder: "e.g., Pantene"
  - Suggestion chips: Pantene, Unilever, P&G, L'Oreal, Johnson & Johnson

**Hair Oil Input:**
- Label: "Hair Oil"
- Text input with autocomplete
- Placeholder: "e.g., Coconut oil"
- Suggestion chips: Coconut oil, Almond oil, Argan oil, Olive oil, Castor oil, None

**Skincare Routine Textarea:**
- Label: "Skincare Routine"
- 3 rows minimum
- Placeholder: "Describe your skincare routine (cleanser, toner, moisturizer, etc.)"
- Character counter: "X/200 characters"
- Auto-resize as typing

**Import Button Behavior:**
- Click: Loads previous day's personal care data
- Fills all fields (face, hair, oil, routine)
- Shows success toast: "Personal care data imported from [date]"
- If no previous data: Shows message "No data from previous day"

---

### 2. 🍽️ Diet & Nutrition Card

**Visual Design:**
- White card with food icon
- Four meal inputs: Breakfast, Lunch, Dinner, Snacks
- Each with suggestion chips below
- Vertical layout

**Breakfast Input:**
- Label: "Breakfast"
- Text input with autocomplete
- Placeholder: "What did you have for breakfast?"
- Suggestion chips: Oatmeal, Eggs, Toast, Cereal, Smoothie, Pancakes, Fruits, Yogurt
- Icon: 🌅 (sunrise)

**Lunch Input:**
- Label: "Lunch"
- Text input with autocomplete
- Placeholder: "What did you have for lunch?"
- Suggestion chips: Rice, Chicken, Salad, Pasta, Sandwich, Soup, Pizza, Burger
- Icon: ☀️ (sun)

**Dinner Input:**
- Label: "Dinner"
- Text input with autocomplete
- Placeholder: "What did you have for dinner?"
- Suggestion chips: Fish, Vegetables, Curry, Steak, Noodles, Soup, Salad, Rice
- Icon: 🌙 (moon)

**Snacks/Additional Items Input:**
- Label: "Snacks & Additional Items"
- Text input with autocomplete
- Placeholder: "Any snacks or additional food items?"
- Suggestion chips: Fruits, Nuts, Chips, Cookies, Chocolate, Yogurt, Protein bar, Coffee, Tea
- Icon: 🍿 (popcorn)

**Behavior:**
- Autocomplete shows top 10 most frequent entries
- Chips click appends to input (comma-separated)
- Multiple items can be entered: "Oatmeal, banana, coffee"
- Auto-save on blur

---

### 3. 📱 Activities & Productivity Card

**Visual Design:**
- White card with activity icon
- Five subsections: Tasks, Travel, Screen Time, Top Apps, Usage Intent
- Complex layout with multiple input types

**Tasks Completed Textarea:**
- Label: "Tasks Completed Today"
- 4 rows minimum
- Placeholder: "List tasks you completed today (use bullet points or numbers)"
- Character counter: "X/500 characters"
- Auto-resize as typing
- Suggestion chips: Work tasks, Personal tasks, Errands, Exercise, Study

**Travel Destination Input:**
- Label: "Travel Destination"
- Text input with autocomplete
- Placeholder: "Where did you go today?"
- Suggestion chips: Office, Gym, Home, Mall, Restaurant, Park, Friend's place, None
- Multiple destinations: "Office, Gym, Grocery store"

**Screen Time Input:**
- Label: "Phone Screen Time"
- Time input (HH:MM format)
- Placeholder: "00:00"
- Icon: 📱 (phone)
- Helper text: "Total time spent on phone today"

**Top 5 Apps Section:**
- Label: "Top 5 Most Used Apps"
- 5 rows, each with:
  - Number label: "1.", "2.", "3.", "4.", "5."
  - App name input (text with autocomplete)
  - Time spent input (HH:MM format)
  - Layout: [Number] [App Name Input] [Time Input]
  
**App Name Autocomplete:**
- Shows most frequently used apps
- Common apps: Chrome, YouTube, Instagram, WhatsApp, Facebook, Twitter, TikTok, Netflix, Spotify, VS Code, Gmail, Maps
- Icon appears next to app name (if available)

**Time Input:**
- Format: HH:MM
- Placeholder: "00:00"
- Validation: Total should not exceed screen time
- Auto-calculate remaining time

**Usage Intent Textarea:**
- Label: "App Usage Intent"
- 2 rows minimum
- Placeholder: "Was your phone usage productive, entertainment, or social?"
- Character counter: "X/200 characters"
- Suggestion chips: Productive, Entertainment, Social, Mixed, Work-related, Time-wasting

---

### 4. 📖 Daily Summary Card

**Visual Design:**
- White card with book icon
- Four sections: Key Events, Activity Summary, Overall Experience, Other Notes
- Most important card - captures day's essence

**Key Events Textarea:**
- Label: "Key Events"
- 3 rows minimum
- Placeholder: "What were the most important events or moments today?"
- Character counter: "X/300 characters"
- Auto-resize as typing
- Helper text: "Highlight significant moments"

**Activity Summary Textarea:**
- Label: "Daily Activity Summary"
- 4 rows minimum
- Placeholder: "Summarize your day's activities and accomplishments"
- Character counter: "X/500 characters"
- Auto-resize as typing
- Helper text: "What did you do today?"

**Overall Experience Textarea:**
- Label: "Overall Day Experience"
- 4 rows minimum
- Placeholder: "How was your day overall? How did you feel?"
- Character counter: "X/500 characters"
- Auto-resize as typing
- Helper text: "Reflect on your day"

**Other Notes Status:**
- Label: "Additional Notes"
- Dropdown: Yes / No
- Default: No
- If "Yes": Shows additional textarea below
- Additional textarea:
  - Placeholder: "Any other notes or thoughts?"
  - Character counter: "X/300 characters"
  - Smooth slide-in animation

---

## Smart Suggestions System

### Autocomplete Logic:

**Data Source:**
- Previous entries from LocalStorage
- Frequency-based ranking
- Recent entries weighted higher

**Suggestion Display:**
- Dropdown appears on focus
- Shows top 10 matches
- Filters as user types
- Click to select
- Keyboard navigation (arrow keys, enter)

**Suggestion Chips:**
- Below each input
- Shows top 5-8 most common entries
- Click to append (not replace)
- Gray background, hover: purple
- Smooth fade-in animation

**Example Flow:**
```
User focuses on "Breakfast" input
↓
Dropdown shows:
1. Oatmeal with fruits
2. Scrambled eggs and toast
3. Smoothie bowl
4. Cereal with milk
5. Pancakes
↓
User types "Oat"
↓
Filters to:
1. Oatmeal with fruits
2. Oatmeal and banana
↓
User selects "Oatmeal with fruits"
↓
Input filled, dropdown closes
```

---

## Import from Last Day Feature

### Behavior:

**Button Click:**
1. Fetch previous day's entry from LocalStorage
2. Extract personal care data
3. Fill all personal care fields
4. Show success notification

**Data Imported:**
- Face product name
- Face product brand
- Hair product name
- Hair product brand
- Hair oil
- Skincare routine

**Visual Feedback:**
- Button shows loading spinner during import
- Success: Green checkmark animation
- Failure: Red X with error message
- Toast notification: "Personal care data imported!"

**Edge Cases:**
- No previous day data: Show message "No data from previous day"
- Partial data: Import available fields, leave others empty
- Multiple days back: Option to select date (future enhancement)

---

## Spacing & Layout Rules

**Card Spacing:**
- Padding inside cards: 16px
- Gap between cards: 16px
- Bottom padding: 80px (for tab navigation)

**Input Spacing:**
- Label to input: 8px
- Between inputs: 12px
- Input height: 44px minimum (touch-friendly)
- Textarea min height: 80px

**Section Spacing:**
- Between subsections: 16px
- Between input groups: 12px
- Suggestion chips margin-top: 8px

**Typography:**
- Section headers: 18px, bold (600)
- Subsection labels: 16px, medium (500)
- Labels: 14px, medium (500)
- Input text: 16px, regular
- Helper text: 12px, muted color
- Character counter: 11px, muted

---

## Interactive Behaviors

### Autocomplete:
- Focus: Show dropdown with suggestions
- Type: Filter suggestions in real-time
- Arrow keys: Navigate suggestions
- Enter: Select highlighted suggestion
- Escape: Close dropdown
- Click outside: Close dropdown

### Suggestion Chips:
- Click: Append to input (comma-separated)
- Hover: Purple background, white text
- Animation: Smooth color transition (0.3s)

### Character Counters:
- Update in real-time as typing
- Color change at 90% capacity (yellow)
- Color change at 100% capacity (red)
- Prevent input beyond limit (optional)

### Time Inputs:
- Format: HH:MM
- Validation: 00:00 to 23:59
- Auto-format: Add leading zeros
- Tab: Move to next field

### Import Button:
- Click: Show loading state
- Success: Brief green highlight
- Error: Shake animation + error message

---

## Responsive Design

**Desktop (>768px):**
- Max width: 600px, centered
- Personal care: 2-column grid for name/brand pairs
- Top 5 apps: Horizontal layout

**Mobile (<768px):**
- Single column layout
- Full width inputs
- Stack all elements vertically
- Larger touch targets (48px)
- Reduced padding (12px)

**Tablet (768px-1024px):**
- Same as desktop but full width
- Slightly larger fonts

---

## Accessibility

**Keyboard Navigation:**
- Tab through all inputs
- Arrow keys in dropdowns
- Enter to select
- Escape to close

**Screen Reader Support:**
- Proper ARIA labels on all inputs
- Announce autocomplete suggestions
- Announce character count
- Announce import success/failure

**Color Contrast:**
- Text: 4.5:1 ratio minimum
- Labels: Clear and readable
- Focus indicators: Visible purple outline

**Touch Accessibility:**
- Minimum 44px touch targets
- Clear visual feedback
- No hover-only interactions

---

## Advanced Features

### 1. 📊 Productivity Analytics (Optional)
- Screen time trends
- Most used apps chart
- Productive vs entertainment ratio
- Weekly summary

### 2. 🎯 Goal Tracking
- Daily task completion rate
- Screen time goals
- Healthy eating streaks

### 3. 🔔 Reminders
- Evening reminder to fill summary
- Prompt for key events
- Screen time warnings

### 4. 📤 Export Options
- Export daily summary as PDF
- Share summary via email
- Copy formatted text

---

## Key Features Summary

✅ **Personal Care** - Face, hair products with brands, import from last day
✅ **Diet Tracking** - Breakfast, lunch, dinner, snacks with suggestions
✅ **Task Management** - Completed tasks textarea
✅ **Travel Log** - Destinations visited
✅ **Screen Time** - Total phone usage tracking
✅ **Top 5 Apps** - App name + time spent for each
✅ **Usage Intent** - Productive/entertainment/social classification
✅ **Daily Summary** - Key events, activities, overall experience
✅ **Other Notes** - Optional additional notes section
✅ **Smart Suggestions** - Autocomplete based on history
✅ **Suggestion Chips** - Quick input for common entries
✅ **Character Counters** - On all textareas
✅ **Import Feature** - Copy personal care from previous day
✅ **Auto-Save** - On all input changes
✅ **Responsive Design** - Mobile-first approach

---

## Design Principles Summary

**Comprehensive**: Capture all aspects of the day
**Efficient**: Smart suggestions save time
**Reflective**: Encourage daily reflection
**Flexible**: Optional fields, no pressure
**Consistent**: Same design language as other tabs
**Insightful**: Track patterns over time
**User-Friendly**: Intuitive inputs and interactions
