# Accountability ToDo App — PWA

A Progressive Web App (PWA) for friends to hold each other accountable for completing daily tasks. Users create tasks every day, complete them with proof (photo upload), and receive monetary penalties for missed tasks. The app tracks penalties, completion streaks, and leaderboards in a gamified dashboard.

## 🚀 Features

### Core Functionality
- **Daily Task Management**: Create and manage tasks for each day
- **Proof Upload**: Upload photos as proof of task completion
- **Penalty System**: £5 penalty for each missed task
- **Real-time Tracking**: Monitor completion rates and penalties

### Gamification
- **Leaderboard**: Rank users by total completed tasks and points
- **Achievement System**: Unlock badges for milestones
- **Streak Tracking**: Maintain completion streaks
- **Points System**: Earn points for completed tasks, lose points for missed ones

### Achievements
- ⭐ **Perfect Day**: Complete all tasks for the day
- 🔥 **Comeback King**: Go from <50% completion to 100% next day
- 👑 **Penalty King**: Most penalties in a week
- ⚡ **Streak Master**: Maintain a 7-day completion streak
- 🎯 **First Steps**: Complete your first task
- 📸 **Proof Pro**: Upload proof for 10 tasks
- 📈 **Consistency**: Complete 80%+ tasks for 5 consecutive days

### PWA Features
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile devices
- **Responsive Design**: Optimized for all screen sizes
- **Local Storage**: Data persists locally

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd accountability-todo-pwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically open in your default browser

### Building for Production

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   - The built files are in the `dist` folder
   - Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## 📱 Usage Guide

### Getting Started

1. **First Launch**
   - The app comes with two default users: "Me" and "Friend"
   - Customize user names and avatars in Settings

2. **Daily Workflow**
   - Navigate to the Tasks page
   - Add tasks for each user
   - Mark tasks as completed or upload proof photos
   - Tasks automatically reset at midnight

3. **Dashboard Overview**
   - View leaderboard rankings
   - Check penalty summaries
   - Monitor completion streaks
   - See recent achievements

### Task Management

- **Adding Tasks**: Type task title and press Enter or click the + button
- **Completing Tasks**: Click the checkmark or upload proof photo
- **Editing Tasks**: Click the edit button to modify task title
- **Deleting Tasks**: Click the trash button to remove tasks

### Proof Upload

- **Camera**: Use device camera to take photo
- **File Picker**: Select existing photo from gallery
- **Automatic Completion**: Uploading proof automatically marks task as completed

### Penalty System

- **Automatic Penalties**: £5 penalty for each incomplete task at midnight
- **Penalty Tracking**: View who owes what in the Dashboard
- **Customizable**: Adjust penalty amounts in Settings

### Achievement System

- **Automatic Unlocking**: Achievements unlock based on your actions
- **Progress Tracking**: View achievement progress in the Achievements page
- **Points Rewards**: Earn points for unlocking achievements

## 🎨 Customization

### User Management
- Edit user names and avatars in Settings
- Add custom emoji avatars
- Track individual progress and streaks

### App Settings
- **Penalty Amount**: Customize penalty amount (default: £5)
- **Points System**: Adjust points for completed/missed tasks
- **Data Management**: Export/import data for backup

### Styling
- Modern, responsive design
- Dark mode support (future feature)
- Customizable color scheme via CSS variables

## 📊 Data Structure

### Local Storage Keys
- `accountability_users`: User profiles and stats
- `accountability_tasks`: Task data and completion status
- `accountability_penalties`: Penalty tracking
- `accountability_achievements`: Unlocked achievements
- `accountability_settings`: App configuration

### Data Export/Import
- Export all data as JSON file
- Import data from exported files
- Backup and restore functionality

## 🔧 Technical Details

### Tech Stack
- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts (planned for future)
- **Date Handling**: date-fns
- **PWA**: Vite PWA Plugin

### Architecture
- **Component-based**: Modular React components
- **State Management**: React hooks and Supabase database
- **Responsive Design**: Mobile-first approach
- **PWA Ready**: Service worker and manifest

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- PWA installation support

## 🚀 Future Enhancements

### Planned Features
- **Real-time Sync**: Supabase backend integration
- **Charts & Analytics**: Visual progress tracking
- **Push Notifications**: Task reminders and achievements
- **Dark Mode**: Theme switching
- **Multi-language**: Internationalization support
- **Cloud Backup**: Automatic data synchronization

### Backend Integration
- **Supabase**: Real-time database and authentication
- **File Storage**: Cloud storage for proof photos
- **User Authentication**: Secure user accounts
- **Real-time Updates**: Live collaboration between friends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ for accountability and productivity**
