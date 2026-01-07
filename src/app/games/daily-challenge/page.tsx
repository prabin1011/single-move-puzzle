import { Loader2 } from 'lucide-react';

export default function DailyChallengePage() {
  // This page will eventually fetch the daily challenge from Firestore
  // and render the correct game component.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
       <div className="flex flex-col items-center gap-4">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <p className="text-muted-foreground">Loading Daily Challenge...</p>
       </div>
    </main>
  );
}
