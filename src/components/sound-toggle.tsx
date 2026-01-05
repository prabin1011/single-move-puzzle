
"use client"

import * as React from "react"
import { Volume2, VolumeX } from "lucide-react"
import { useSound } from "@/contexts/sound-context"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

export function SoundToggle() {
  const { isSoundOn, toggleSound } = useSound();

  const handleToggle = () => {
    trackEvent('sound_toggled', { status: !isSoundOn ? 'on' : 'off' });
    toggleSound();
  }

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      {isSoundOn ? (
        <Volume2 className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <VolumeX className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle sound</span>
    </Button>
  )
}
