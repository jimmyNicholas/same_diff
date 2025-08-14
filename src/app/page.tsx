import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          ELICOS Game Generator
        </h1>
        
        <div className="flex flex-col space-y-4 items-center">
          <Link 
            href="/admin"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Admin Panel
          </Link>
          
          <Link 
            href="/play"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Play Game
          </Link>
        </div>
      </div>
    </main>
  );
}
