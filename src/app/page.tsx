import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to Firebase Studio</CardTitle>
          <CardDescription>
            You've successfully started a new project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This is your starting point. What would you like to build today?
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </main>
  );
}
