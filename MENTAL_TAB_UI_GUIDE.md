# 🧠 Mental Tab - UI Design Guide

## 🤖 AI Agent Instructions

### Design Philosophy
Create an **emotion-focused, timeline-based UI** with these principles:
- **Card-based Layout**: White cards with rounded corners (12px), shadows, 16px padding
- **Visual Hierarchy**: Mental state → Mood timeline (most important) → Energy/Stress → Meditation
- **Color Coding**: Emotions mapped to colors (happy=green, sad=blue, stressed=red, calm=purple)
- **Timeline Structure**: 4 time periods (Morning, Afternoon, Evening, Night) with identical inputs
- **Cascading Dropdowns**: Category selection determines available mood feelings
- **Emoji Feedback**: Visual mood indicators throughout
- **Character Counters**: On all textarea inputs for reason/description fields

### Component Structure Pattern
```
Card Container
├── Section Header (Icon + Title)
├── Mood Period (Repeating 4 times)
│   ├── Time Period Badge (🌅 Morning)
│   ├── Mood Level Slider (1-10 with emoji)
│   ├── Mood Category Dropdown
│   └── Mood Feeling Dropdown (filtered by category)
└── Reason Textarea (with character counter)
```

### Key UI Sections

**1. Mental State Section**
- Dropdown for overall mental state (Positive, Neutral, Negative, etc.)
- Large textarea for reason/explanation
- Character counter (0/500)
- Color-coded based on selection

**2. Mood Timeline Section (MOST IMPORTANT)**
- 4 identical time period cards:
  - 🌅 Morning (6 AM - 12 PM)
  - ☀️ Afternoon (12 PM - 6 PM)
  - 🌆 Evening (6 PM - 10 PM)
  - 🌙 Night (10 PM - 6 AM)
- Each period has:
  - Mood level slider (1-10)
  - Mood category dropdown (6 categories)
  - Mood feeling dropdown (filtered by category)
  - Visual emoji indicator

**3. Energy & Stress Section**
- Energy level slider (1-10) with emoji feedback
- Energy reason textarea with counter
- Stress level slider (1-10) with emoji feedback
- Stress reason textarea with counter

**4. Meditation Section**
- Status dropdown (Yes, No, N/A)
- Duration input (minutes)
- Conditional: Duration only shows if status = "Yes"

### Mood Categories & Feelings

**Category 1: Positive High Energy**
- Feelings: happy, calm, peaceful, relaxed, content, motivated, energetic, confident, hopeful, satisfied
- Color: Green (#00e400)
- Emoji: 😊 🌟 ✨

**Category 2: Neutral Balanced**
- Feelings: neutral, normal, stable, okay, composed, indifferent
- Color: Gray (#999999)
- Emoji: 😐 😶

**Category 3: Low Energy Tired**
- Feelings: tired, sleepy, exhausted, lazy, drained, dull
- Color: Blue (#4a90e2)
- Emoji: 😴 🥱

**Category 4: Negative Heavy**
- Feelings: stressed, anxious, irritated, frustrated, overwhelmed, sad, low, lonely, bored
- Color: Red (#ff0000)
- Emoji: 😢 😤 😰

**Category 5: Cognitive Mental States**
- Feelings: focused, distracted, confused, overthinking, mentally_heavy, mentally_clear
- Color: Purple (#667eea)
- Emoji: 🤔 💭

**Category 6: Mixed/Other**
- Feelings: mixed, uncertain, conflicted, numb
- Color: Orange (#ff7e00)
- Emoji: 😕 🤷

### Color Palette
```
Primary: #667eea (Purple)
Happy/Positive: #00e400 (Green)
Neutral: #999999 (Gray)
Tired: #4a90e2 (Blue)
Negative: #ff0000 (Red)
Cognitive: #667eea (Purple)
Mixed: #ff7e00 (Orange)
Background: #fff (cards), #f5f5f5 (inputs)
Text: #333 (dark), #666 (muted)
```

### Layout Structure
```
┌─────────────────────────────────────────────┐
│  🧠 Mental State                            │
│  Overall State: [Positive ▼]               │
│  Reason:                                    │
│  [Productive day, accomplished goals...]   │
│  245/500 characters                         │
├─────────────────────────────────────────────┤
│  ⏰ Mood Timeline                           │
│  ┌─────────────────────────────────────┐   │
│  │ 🌅 Morning (6 AM - 12 PM)          │   │
│  │ Mood Level: ━━━━━━━●━━━━━━━━━━━━  │   │
│  │ [8] 😊                              │   │
│  │ Category: [Positive High Energy ▼] │   │
│  │ Feeling: [Happy ▼]                  │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ ☀️ Afternoon (12 PM - 6 PM)        │   │
│  │ Mood Level: ━━━━━●━━━━━━━━━━━━━━  │   │
│  │ [6] 😐                              │   │
│  │ Category: [Neutral Balanced ▼]     │   │
│  │ Feeling: [Normal ▼]                 │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ 🌆 Evening (6 PM - 10 PM)          │   │
│  │ Mood Level: ━━━━━━━━●━━━━━━━━━━━  │   │
│  │ [9] 🌟                              │   │
│  │ Category: [Positive High Energy ▼] │   │
│  │ Feeling: [Content ▼]                │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ 🌙 Night (10 PM - 6 AM)            │   │
│  │ Mood Level: ━━━━━━●━━━━━━━━━━━━━  │   │
│  │ [7] 😊                              │   │
│  │ Category: [Low Energy Tired ▼]     │   │
│  │ Feeling: [Sleepy ▼]                 │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  ⚡ Energy Level                            │
│  Level: ━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━  │
│  [7] ⚡ Good Energy                         │
│  Reason:                                    │
│  [Good sleep, morning exercise...]         │
│  120/300 characters                         │
├─────────────────────────────────────────────┤
│  😰 Stress Level                            │
│  Level: ━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [4] 😌 Moderate Stress                    │
│  Reason:                                    │
│  [Work deadline approaching...]            │
│  85/300 characters                          │
├─────────────────────────────────────────────┤
│  🧘 Meditation                              │
│  Status: [Yes ▼]                            │
│  Duration: [15] minutes                     │
└─────────────────────────────────────────────┘
```

---

## UI Components Breakdown

### 1. 🧠 Mental State Card

**Visual Design:**
- White card with brain icon
- Two main elements: Dropdown + Textarea
- Color-coded border based on selection

**Mental State Dropdown:**
- Options:
  - Positive (Green border)
  - Neutral (Gray border)
  - Negative (Red border)
  - Mixed (Orange border)
  - Anxious (Red border)
  - Calm (Purple border)
  - Stressed (Red border)
  - Peaceful (Green border)
- Icon changes based on selection
- Full width dropdown

**Reason Textarea:**
- Label: "Why do you feel this way?"
- 4 rows minimum
- Placeholder: "Describe your mental state and what influenced it..."
- Character counter: "X/500 characters"
- Auto-resize as typing
- Border color matches mental state selection

**Behavior:**
- Dropdown change updates card border color
- Emoji appears next to dropdown based on selection
- Auto-save on blur

---

### 2. ⏰ Mood Timeline Section (MOST IMPORTANT)

**Section Header:**
- Icon: ⏰ clock
- Title: "Mood Timeline"
- Subtitle: "Track your mood throughout the day"
- Collapsible (optional)

**Time Period Card Structure:**
Each of 4 periods has identical structure:

**Period Badge:**
- 🌅 Morning: Orange gradient background
- ☀️ Afternoon: Yellow gradient background
- 🌆 Evening: Purple gradient background
- 🌙 Night: Dark blue gradient background
- White text, bold
- Time range displayed: "(6 AM - 12 PM)"
- Full width, rounded top corners

**Mood Level Slider:**
- Label: "Mood Level"
- Range: 1-10
- Large thumb (24px), purple color
- Track: Gray background
- Display below slider:
  - Number value (large, bold)
  - Emoji (changes based on value):
    - 1-2: 😢 Very Sad
    - 3-4: 😔 Low
    - 5-6: 😐 Neutral
    - 7-8: 😊 Happy
    - 9-10: 🌟 Excellent
  - Label text (e.g., "Happy")

**Mood Category Dropdown:**
- Label: "Mood Category"
- Full width
- Options (6 categories):
  1. Positive High Energy
  2. Neutral Balanced
  3. Low Energy Tired
  4. Negative Heavy
  5. Cognitive Mental States
  6. Mixed/Other
- Color-coded icon next to each option
- Default: Empty/unselected

**Mood Feeling Dropdown:**
- Label: "Specific Feeling"
- Full width
- Dynamically populated based on category selection
- Disabled until category is selected
- Placeholder: "Select category first"
- Options change based on category:
  - Example: If "Positive High Energy" selected, show: happy, calm, peaceful, relaxed, content, motivated, energetic, confident, hopeful, satisfied
- Color-coded to match category

**Visual Feedback:**
- Selected category: Dropdown has colored left border
- Selected feeling: Shows emoji next to text
- Slider drag: Smooth emoji transition
- Card background: Subtle color tint based on mood

**Spacing:**
- 16px padding inside each period card
- 12px gap between period cards
- 8px gap between elements within card

---

### 3. ⚡ Energy Level Card

**Visual Design:**
- White card with lightning bolt icon
- Slider + Textarea layout

**Energy Slider:**
- Label: "Energy Level"
- Range: 1-10
- Color-coded track:
  - 1-3: Red (Low energy)
  - 4-6: Yellow (Moderate)
  - 7-8: Light green (Good)
  - 9-10: Dark green (Excellent)
- Display:
  - Number + Emoji + Label
  - Examples:
    - "3 😴 Low Energy"
    - "7 ⚡ Good Energy"
    - "10 🔥 Excellent Energy"

**Energy Reason Textarea:**
- Label: "What affected your energy?"
- 3 rows minimum
- Placeholder: "E.g., Good sleep, exercise, coffee, lack of sleep..."
- Character counter: "X/300 characters"
- Suggestion chips below:
  - Good sleep
  - Exercise
  - Healthy food
  - Coffee/Tea
  - Lack of sleep
  - Stress
  - Illness

**Behavior:**
- Slider changes update emoji and color
- Chips click appends to textarea
- Auto-save on blur

---

### 4. 😰 Stress Level Card

**Visual Design:**
- White card with stress emoji icon
- Slider + Textarea layout
- Similar to Energy card

**Stress Slider:**
- Label: "Stress Level"
- Range: 1-10
- Color-coded track (inverted - lower is better):
  - 1-3: Green (Low stress) 😌
  - 4-6: Yellow (Moderate) 😐
  - 7-8: Orange (High) 😰
  - 9-10: Red (Very high) 😫
- Display:
  - Number + Emoji + Label
  - Examples:
    - "2 😌 Low Stress"
    - "5 😐 Moderate Stress"
    - "9 😫 Very High Stress"

**Stress Reason Textarea:**
- Label: "What's causing stress?"
- 3 rows minimum
- Placeholder: "E.g., Work deadline, relationship issues, financial concerns..."
- Character counter: "X/300 characters"
- Suggestion chips below:
  - Work pressure
  - Deadlines
  - Relationships
  - Financial
  - Health concerns
  - Family issues
  - No stress

**Behavior:**
- Slider changes update emoji and color
- Higher values show warning color
- Chips click appends to textarea
- Auto-save on blur

---

### 5. 🧘 Meditation Card

**Visual Design:**
- White card with meditation icon
- Compact layout
- Two inputs: Status dropdown + Duration input

**Status Dropdown:**
- Label: "Did you meditate today?"
- Options:
  - Yes (Green checkmark icon)
  - No (Red X icon)
  - N/A (Gray dash icon)
- Full width
- Default: N/A

**Duration Input:**
- Label: "Duration (minutes)"
- Number input
- Only visible if Status = "Yes"
- Placeholder: "0"
- Min: 1, Max: 180 (3 hours)
- Unit: "minutes" displayed after input
- Smooth slide-in animation when shown

**Visual Feedback:**
- Status "Yes": Card border turns green
- Status "No": Card border turns red
- Status "N/A": Normal border
- Duration input slides in/out smoothly

**Behavior:**
- Status change shows/hides duration
- Duration auto-saves on blur
- If status changes from "Yes" to other, duration is cleared

---

## Cascading Dropdown Logic

### Category → Feeling Mapping

**Implementation:**
1. User selects mood category
2. Feeling dropdown is enabled
3. Feeling dropdown is populated with category-specific options
4. User selects specific feeling
5. Both values are saved together

**Example Flow:**
```
User selects: "Positive High Energy"
↓
Feeling dropdown shows:
- happy
- calm
- peaceful
- relaxed
- content
- motivated
- energetic
- confident
- hopeful
- satisfied
↓
User selects: "happy"
↓
Saved: { category: "Positive High Energy", feeling: "happy" }
```

**Visual Indicators:**
- Category selected: Colored left border on dropdown
- Feeling selected: Emoji appears next to text
- Both selected: Card background has subtle color tint

---

## Mood Timeline Behavior

### Auto-Save Logic:
- Save each time period independently
- Save on slider change (debounced 500ms)
- Save on dropdown change (immediate)
- Store category + feeling together

### Visual Summary:
- Show average mood for the day (calculated from 4 periods)
- Display as emoji at top of section
- Example: "Average mood today: 😊 Happy (7.5/10)"

### Empty State:
- If no mood data entered: Show placeholder
- Message: "Track your mood throughout the day"
- Gentle reminder: "How are you feeling right now?"

### Time-based Suggestions:
- Morning (6 AM - 12 PM): Default to current time period
- Afternoon (12 PM - 6 PM): Highlight current period
- Evening (6 PM - 10 PM): Highlight current period
- Night (10 PM - 6 AM): Highlight current period
- Current period has subtle glow/highlight

---

## Spacing & Layout Rules

**Card Spacing:**
- Padding inside cards: 16px
- Gap between cards: 16px
- Bottom padding: 80px (for tab navigation)

**Mood Timeline Spacing:**
- Period cards: 12px gap between
- Inside period card: 12px gap between elements
- Slider to display: 8px gap

**Input Spacing:**
- Label to input: 8px
- Between inputs: 12px
- Input height: 44px minimum (touch-friendly)

**Typography:**
- Section headers: 18px, bold (600)
- Period badges: 16px, bold (600)
- Labels: 14px, medium (500)
- Input text: 16px, regular
- Helper text: 12px, muted color
- Character counter: 11px, muted

---

## Interactive Behaviors

### Slider Interactions:
- Smooth drag with emoji transition
- Haptic feedback on mobile (optional)
- Color transition as value changes
- Display updates in real-time

### Dropdown Interactions:
- Category selection enables feeling dropdown
- Feeling dropdown shows filtered options
- Color-coded options with icons
- Search/filter in dropdown (optional)

### Textarea Interactions:
- Auto-resize as typing
- Character counter updates live
- Warning at 90% capacity (color change)
- Suggestion chips append text

### Visual Feedback:
- Input focus: Purple border
- Slider drag: Smooth transitions
- Dropdown open: Shadow increases
- Value change: Subtle highlight animation
- Save success: Brief green checkmark

---

## Responsive Design

**Desktop (>768px):**
- Max width: 600px, centered
- Mood timeline: Single column
- Energy/Stress: Side by side (optional)

**Mobile (<768px):**
- Single column layout
- Full width inputs
- Larger touch targets (48px)
- Reduced padding (12px)
- Period cards stack vertically

**Tablet (768px-1024px):**
- Same as desktop but full width
- Slightly larger fonts

---

## Accessibility

**Keyboard Navigation:**
- Tab through all inputs
- Arrow keys for sliders
- Enter to open dropdowns
- Escape to close dropdowns

**Screen Reader Support:**
- Proper ARIA labels on all inputs
- Announce slider value changes
- Announce dropdown selections
- Announce character count

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

### 1. 📊 Mood Analytics (Optional)
- Weekly mood chart
- Most common feelings
- Mood patterns by time of day
- Stress vs Energy correlation

### 2. 🔔 Mood Reminders
- Notification to log mood
- Time-based: Morning, Afternoon, Evening, Night
- Customizable reminder times

### 3. 💡 Mood Insights
- "You're happiest in the morning"
- "Stress peaks in the evening"
- "Meditation improves your mood by 20%"

### 4. 🎨 Mood Color Themes
- App theme changes based on mood
- Subtle background color tints
- Emoji animations

---

## Key Features Summary

✅ **Mental State** - Overall state with reason
✅ **Mood Timeline** - 4 time periods (Morning, Afternoon, Evening, Night)
✅ **Mood Slider** - 1-10 scale with emoji feedback
✅ **Cascading Dropdowns** - Category → Feeling selection
✅ **6 Mood Categories** - Positive, Neutral, Tired, Negative, Cognitive, Mixed
✅ **50+ Mood Feelings** - Specific emotions within categories
✅ **Energy Tracking** - Level + Reason with color coding
✅ **Stress Tracking** - Level + Reason with color coding
✅ **Meditation Log** - Status + Duration
✅ **Character Counters** - On all textareas
✅ **Suggestion Chips** - Quick input for common reasons
✅ **Color Coding** - Visual mood indicators
✅ **Emoji Feedback** - Throughout the interface
✅ **Auto-Save** - On all input changes
✅ **Responsive Design** - Mobile-first approach

---

## Design Principles Summary

**Emotional Awareness**: Help users identify and track emotions
**Simplicity**: Easy to log mood multiple times per day
**Visual Feedback**: Colors and emojis for quick understanding
**Flexibility**: Detailed tracking without being overwhelming
**Consistency**: Same design language as other tabs
**Privacy**: Sensitive data handled with care
**Insights**: Help users understand their emotional patterns
