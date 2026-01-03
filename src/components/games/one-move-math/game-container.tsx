
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function GameContainer() {
  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-headline">One Move Math</CardTitle>
        <CardDescription>Coming Soon!</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          The game logic for the math puzzle is being built.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary" className="w-full">
            <Link href="/">Back to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
