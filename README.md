# Recipes App

A modern React-based recipe management application built with Firebase backend, featuring user authentication, recipe CRUD operations, favorites system, and responsive design.

## Features

- 🔐 **User Authentication** - Secure login/register with Firebase Auth
- 📝 **Recipe Management** - Create, read, update, and delete recipes
- ❤️ **Favorites System** - Save and manage your favorite recipes
- 🔍 **Search & Filter** - Find recipes quickly with advanced filtering
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- 🧪 **Testing** - Partial test coverage with Vitest and React Testing Library
- 🚀 **Fast Development** - Vite build tool for rapid development

## Tech Stack

- **Frontend**: React 19, React Router DOM 7, Redux Toolkit
- **Styling**: Tailwind CSS 4, Radix UI components
- **Backend**: Firebase (Auth, Firestore)
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **State Management**: Redux Toolkit with React Redux

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for backend services)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd recipes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Set up Firestore security rules
6. Get your configuration values from Project Settings

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── __tests__/      # Component tests
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── store/               # Redux store and slices
├── lib/                 # Utility functions
├── firebase.js          # Firebase configuration
├── router.jsx           # Application routing
└── App.jsx              # Root application component
```

## Key Components

- **RecipeCard** - Displays recipe information in a card format
- **SearchAndFilterBar** - Search and filter recipes
- **FavoriteButton** - Toggle recipe favorites
- **RecipeForm** - Create/edit recipe form
- **AuthBar** - User authentication interface

## State Management

The app uses Redux Toolkit for state management with three main slices:
- **authSlice** - User authentication state
- **recipesSlice** - Recipe data management
- **favoritesSlice** - User favorites management

## Testing

The project includes comprehensive testing setup:
- Unit tests for components, hooks, and utilities
- Integration tests for Redux slices
- Test coverage reporting
- Mock setup for Firebase services

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For issues and questions, please check the existing issues or create a new one in the repository.
