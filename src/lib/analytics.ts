
'use client';

// This file is temporarily disabled to prevent server crashes due to a missing
// 'firebase/analytics' dependency. We can re-enable this later by adding
// the package to package.json and uncommenting the code.

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


export const trackEvent = (eventName: EventName, params?: EventParams) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Disabled] Event: ${eventName}`, params);
  }
};
