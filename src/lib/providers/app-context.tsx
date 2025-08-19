'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// App state interface - focused only on UI state
interface AppState {
  currentUser: {
    isAuthenticated: boolean;
    isAdmin: boolean;
    username?: string;
  };
  ui: {
    sidebarCollapsed: boolean;
    selectedLesson?: string;
    selectedActivity?: string;
  };
  modals: {
    createLessonOpen: boolean;
  };
}

// Action types - simplified
type AppAction =
  | { type: 'SET_AUTH'; payload: { isAuthenticated: boolean; isAdmin: boolean; username?: string } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'LOGOUT' }
  | { type: 'OPEN_CREATE_LESSON_MODAL' }
  | { type: 'CLOSE_CREATE_LESSON_MODAL' }
  | { type: 'SET_SELECTED_LESSON'; payload: string | undefined }
  | { type: 'SET_SELECTED_ACTIVITY'; payload: string | undefined }

// Initial state
const initialState: AppState = {
  currentUser: {
    isAuthenticated: false,
    isAdmin: false,
  },
  ui: {
    sidebarCollapsed: false,
  },
  modals: {
    createLessonOpen: false,
  },
};

// Reducer function - simplified
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.payload,
        },
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: !state.ui.sidebarCollapsed,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        currentUser: {
          isAuthenticated: false,
          isAdmin: false,
        },
        ui: {
          ...state.ui,
          selectedLesson: undefined,
          selectedActivity: undefined,
        },
      };
    case 'OPEN_CREATE_LESSON_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          createLessonOpen: true,
        },
      };
    case 'CLOSE_CREATE_LESSON_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          createLessonOpen: false,
        },
      };
    case 'SET_SELECTED_LESSON':
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedLesson: action.payload,
        },
      };
    case 'SET_SELECTED_ACTIVITY':
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedActivity: action.payload,
        },
      };
    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks for specific state
export function useAuth() {
  const { state, dispatch } = useApp();
  return {
    user: state.currentUser,
    login: (username: string, isAdmin: boolean) =>
      dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: true, isAdmin, username } }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  };
}

export function useUI() {
  const { state, dispatch } = useApp();
  return {
    sidebarCollapsed: state.ui.sidebarCollapsed,
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    selectedLesson: state.ui.selectedLesson,
    selectedActivity: state.ui.selectedActivity,
    setSelectedLesson: (id: string | undefined) => 
      dispatch({ type: 'SET_SELECTED_LESSON', payload: id }),
    setSelectedActivity: (id: string | undefined) => 
      dispatch({ type: 'SET_SELECTED_ACTIVITY', payload: id }),
  };
}

export function useModals() {
  const { state, dispatch } = useApp();
  return {
    createLessonOpen: state.modals.createLessonOpen,
    openCreateLesson: () => dispatch({ type: 'OPEN_CREATE_LESSON_MODAL' }),
    closeCreateLesson: () => dispatch({ type: 'CLOSE_CREATE_LESSON_MODAL' }),
  };
}
