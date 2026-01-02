
type Sound = 'click' | 'success' | 'fail' | 'win';

const sounds: Record<Sound, HTMLAudioElement> = {
    click: typeof Audio !== 'undefined' ? new Audio('/sounds/click.wav') : null,
    success: typeof Audio !== 'undefined' ? new Audio('/sounds/success.wav') : null,
    fail: typeof Audio !== 'undefined' ? new Audio('/sounds/fail.wav') : null,
    win: typeof Audio !== 'undefined' ? new Audio('/sounds/win.wav') : null,
};

// Set volumes
if (sounds.click) sounds.click.volume = 0.5;
if (sounds.success) sounds.success.volume = 0.7;
if (sounds.fail) sounds.fail.volume = 0.6;
if (sounds.win) sounds.win.volume = 0.8;


export const playSound = (sound: Sound) => {
    if (typeof window !== 'undefined' && sounds[sound]) {
        sounds[sound].currentTime = 0; // Rewind to the start
        sounds[sound].play().catch(error => {
            // Autoplay can be blocked by the browser, so we log this error
            // without crashing the app. It's a non-critical feature.
            console.error(`Could not play sound: ${sound}`, error);
        });
    }
};
