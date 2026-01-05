
'use client';

import { getAnalytics, logEvent as logFirebaseEvent, isSupported } from 'firebase/analytics';
import { getApp, getApps } from 'firebase/app';

type EventName =
  | 'game_start_new'
  | 'game_continue'
  | 'game_level_complete'
  | 'game_over'
  | 'game_all_levels_complete'
  | 'puzzle_start'
  | 'puzzle_retry'
  | 'hint_viewed'
  | 'landmark_preview_skip'
  | 'navigate_to_home'
  | 'navigate_to_legal'
  | 'sound_toggled'
  | 'theme_toggled';

type EventParams = {
  game?: 'landmark' | 'math' | 'patterns' | 'word-swap' | 'symbol-puzzle';
  level?: number;
  page?: 'about' | 'privacy' | 'contact' | 'disclaimer';
  status?: 'on' | 'off';
  theme?: 'light' | 'dark';
};

let analyticsInitialized = false;

// Initialize analytics only once
const initializeAnalytics = async () => {
    if (analyticsInitialized) return;
    if (typeof window !== 'undefined' && (await isSupported())) {
        if (getApps().length > 0) {
            getAnalytics(getApp());
            analyticsInitialized = true;
        }
    }
};

initializeAnalytics();


export const trackEvent = (eventName: EventName, params?: EventParams) => {
  if (!analyticsInitialized) {
    // Analytics is not supported or not initialized.
    // In a production app, you might queue these events or log them differently.
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Disabled] Event: ${eventName}`, params);
    }
    return;
  }

  try {
    const analytics = getAnalytics();
    logFirebaseEvent(analytics, eventName, params);
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};
