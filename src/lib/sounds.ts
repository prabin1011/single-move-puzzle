
export type Sound =
  | "click"
  | "ui"
  | "success"
  | "fail"
  | "win"
  | "start"
  | "preview_done"
  | "swap";

let sounds: Record<Sound, HTMLAudioElement> | null = null;

export const initializeSounds = () => {
  if (typeof window !== "undefined" && !sounds) {
    sounds = {
      click: new Audio("/sounds/click.wav"),
      ui: new Audio("/sounds/ui.wav"),
      success: new Audio("/sounds/success.wav"),
      fail: new Audio("/sounds/fail.wav"),
      win: new Audio("/sounds/win.wav"),
      start: new Audio("/sounds/start.wav"),
      preview_done: new Audio("/sounds/preview_done.wav"),
      swap: new Audio("/sounds/swap.wav"),
    };

    // tweak volumes if you like
    sounds.click.volume = 0.25;
    sounds.ui.volume = 0.3;
    sounds.success.volume = 0.35;
    sounds.fail.volume = 0.3;
    sounds.win.volume = 0.4;
    sounds.start.volume = 0.3;
    sounds.preview_done.volume = 0.35;
    sounds.swap.volume = 0.35;
  }
};

export const playSound = (sound: Sound, isSoundOn: boolean) => {
  if (!isSoundOn) return;

  if (!sounds) initializeSounds();

  const audio = sounds?.[sound];
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch((err) => {
    // autoplay might be blocked; just log and ignore
    console.warn(`Could not play sound: ${sound}`, err);
  });
};
