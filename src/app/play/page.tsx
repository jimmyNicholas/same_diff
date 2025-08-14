'use client';

import Link from 'next/link';

export default function PlayPage() {
  const levels = [
    { id: 'ele', name: 'Elementary' },
    { id: 'pre_int', name: 'Pre-Intermediate' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'upper_int', name: 'Upper Intermediate' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Choose Your Level
        </h1>
        
        <div className="grid gap-4">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={`/play/${level.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-900">{level.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
