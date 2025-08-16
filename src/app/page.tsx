import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">
              ELICOS Game Generator
            </CardTitle>
            <CardDescription>
              Create and play educational games
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Link href="/login/admin">
              <Button className="w-full" size="lg">
                Admin Panel
              </Button>
            </Link>
            
            <Link href="/play">
              <Button variant="secondary" className="w-full" size="lg">
                Play Game
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
