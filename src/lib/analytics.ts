
'use client';

// This file is temporarily disabled to prevent server crashes due to a missing
// 'firebase/analytics' dependency. We can re-enable this later by adding
// the package to package.json and uncommenting the code.

type EventName =
  // Main Menu Events
  | 'landmark_start_new'
  | 'landmark_continue'
  | 'math_start_new'
  | 'math_continue'
  | 'patterns_start_new'
  | 'patterns_continue'
  | 'wordswap_start_new'
  | 'wordswap_continue'
  | 'symbol_start_new'
  | 'symbol_continue'
  
  // In-Game Events (generic for all games)
  | 'game_level_complete'
  | 'game_level_fail'
  | 'game_over'
  | 'game_all_levels_complete'
  | 'puzzle_start'
  | 'puzzle_retry'
  | 'hint_viewed'
  | 'navigate_to_home'
  
  // Specific In-Game Events
  | 'landmark_preview_skip'

  // App-level events
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


export const trackEvent = (eventName: EventName, params?: EventParams) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Disabled] Event: ${eventName}`, params);
  }
};

    