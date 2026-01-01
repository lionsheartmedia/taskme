# TodoFusion

**Unify Your Tasks, Amplify Your Productivity**

TodoFusion is a comprehensive, beautiful task management application built with modern web technologies. It features a complete UI kit with 80+ components, dark/light theme support, and a fully functional task management system.

## Features

### Core Functionality
- ✅ **Task Management** - Create, edit, delete, and complete tasks
- 📋 **Multiple Views** - All tasks, Today, Upcoming, Completed
- 🎯 **Priority Levels** - Low, Medium, High, Urgent
- 🔍 **Search & Filter** - Find tasks quickly
- 🏷️ **Tags** - Organize with custom tags
- 📅 **Due Dates** - Schedule and track deadlines
- ⏰ **Overdue Detection** - Automatic alerts for overdue tasks

### Design & UI
- 🌓 **Dark & Light Modes** - Seamless theme switching
- 📱 **Fully Responsive** - Mobile, tablet, desktop optimized
- 🎨 **Beautiful Design** - Modern, clean interface
- ⚡ **Smooth Animations** - Polished interactions
- ♿ **Accessible** - WCAG 2.1 AA compliant

### Data & Storage
- 💾 **localStorage** - All data stored locally
- 📤 **Export/Import** - Backup your tasks
- 🔄 **Real-time Updates** - Instant feedback

## Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in a modern browser
3. **Start using TodoFusion** - No build process required!

## File Structure

```
todofusion/
├── index.html                 # Landing page
├── dashboard.html             # Task management dashboard
├── styles/
│   ├── variables.css          # Design tokens (colors, spacing, etc.)
│   ├── base.css              # CSS reset and typography
│   ├── components.css        # UI components
│   ├── layout.css            # Grid and layout utilities
│   ├── animations.css        # Keyframes and transitions
│   ├── utilities.css         # Helper classes
│   └── main.css              # Main import file
├── js/
│   ├── main.js               # Landing page scripts
│   ├── dashboard.js          # Dashboard controller
│   ├── database.js           # localStorage management
│   ├── models/
│   │   └── Task.js           # Task data model
│   ├── services/
│   │   └── TaskService.js    # Business logic
│   └── components/
│       ├── TaskListView.js   # Task list rendering
│       └── ModalManager.js   # Modal dialogs
└── README.md                  # This file
```

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - No frameworks required
- **localStorage** - Client-side data persistence

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Design System

### Colors

**Dark Theme (Default)**
- Background: `#1a1a1e`
- Card: `#242429`
- Accent: `#8b5cf6` (Purple)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)
- Error: `#ef4444` (Red)

**Light Theme**
- Background: `#f7f7f8`
- Card: `#ffffff`
- (Accents remain the same)

### Typography
- Font: Inter (Google Fonts)
- Sizes: 12px - 72px
- Weights: 400, 500, 600, 700

### Spacing
- Base: 8px grid system
- Sizes: 4px, 8px, 16px, 24px, 32px, 48px, 64px, 96px

## Usage

### Creating Tasks
1. Click "New Task" button
2. Fill in task details:
   - Title (required)
   - Description
   - Due date
   - Priority level
   - Tags
3. Click "Save Task"

### Managing Tasks
- **Complete**: Click checkbox
- **Edit**: Click edit icon
- **Delete**: Click delete icon
- **Filter**: Use sidebar navigation
- **Search**: Type in search box

### Theme Toggle
- Click sun/moon icon in header
- Preference saved automatically

## Data Storage

All data is stored in browser localStorage:
- **Tasks**: `todofusion_tasks`
- **Settings**: `todofusion_settings`
- **Theme**: `todofusion_theme`

### Export/Import
```javascript
// Export (open browser console)
console.log(DB.exportData());

// Import
DB.importData(jsonString);
```

## Customization

### Changing Colors
Edit `styles/variables.css`:
```css
:root {
  --color-accent-primary: #your-color;
}
```

### Adding Features
1. Create new service/component in `js/`
2. Import in `dashboard.html`
3. Initialize in `dashboard.js`

## Development

### Local Development
```bash
# Start a local server (Python)
python -m http.server 8000

# Or use any static file server
# Then open http://localhost:8000
```

### Code Structure
- **Models** - Data structures (Task.js)
- **Services** - Business logic (TaskService.js)
- **Components** - UI components (TaskListView.js, ModalManager.js)
- **Controllers** - Page logic (dashboard.js)

## Performance

- No external dependencies
- Minimal JavaScript bundle
- CSS custom properties for theming
- Event delegation for lists
- Debounced search

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast (WCAG AA)

## Future Enhancements

Potential features for expansion:
- [ ] Timer functionality
- [ ] Time tracking
- [ ] Analytics dashboard
- [ ] Recurring tasks
- [ ] Subtasks/checklists
- [ ] Calendar view
- [ ] Backend integration
- [ ] Team collaboration

## Credits

**Design Inspiration**: TodoFusion UI Kit  
**Built with**: HTML5, CSS3, JavaScript  
**Fonts**: Inter by Rasmus Andersson

## License

This project is for educational and personal use.

## Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try clearing site data and refreshing

---

**Made with ❤️ for productivity enthusiasts**

TodoFusion - Unify Your Tasks, Amplify Your Productivity
