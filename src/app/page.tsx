import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLogo } from '@/components/icons';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center border-border shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <AppLogo className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Single Move Puzzle</CardTitle>
          <CardDescription className="text-lg text-muted-foreground px-4">
            A calm, educational puzzle game.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-left space-y-2 px-6">
            <p className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Solve a simple visual puzzle.</span></p>
            <p className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Discover famous landmarks.</span></p>
            <p className="flex items-start gap-3"><span className="mt-1 text-primary">✓</span><span>Learn a few fun facts.</span></p>
          </div>
          <Link href="/play" className="w-full">
            <Button size="lg" className="w-3/4">
              Start Game
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
