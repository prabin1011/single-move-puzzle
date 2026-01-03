

type Sound = 'click' | 'success' | 'fail' | 'win';

let sounds: Record<Sound, HTMLAudioElement> | null = null;

// This function should be called once in a client component to initialize sounds.
export const initializeSounds = () => {
    if (typeof window !== 'undefined' && !sounds) {
        sounds = {
            click: new Audio('/sounds/click.wav'),
            success: new Audio('/sounds/success.wav'),
            fail: new Audio('/sounds/fail.wav'),
            win: new Audio('/sounds/win.wav'),
        };
        // Set volumes
        if (sounds.click) sounds.click.volume = 0.5;
        if (sounds.success) sounds.success.volume = 0.7;
        if (sounds.fail) sounds.fail.volume = 0.6;
        if (sounds.win) sounds.win.volume = 0.8;
    }
}


export const playSound = (sound: Sound, isSoundOn: boolean) => {
    if (!isSoundOn) return;
    
    // Ensure sounds are initialized
    if (!sounds) {
        initializeSounds();
    }
    
    if (sounds && sounds[sound]) {
        sounds[sound].currentTime = 0; // Rewind to the start
        sounds[sound].play().catch(error => {
            // Autoplay can be blocked by the browser, so we log this error
            // without crashing the app. It's a non-critical feature.
            console.error(`Could not play sound: ${sound}`, error);
        });
    }
};
