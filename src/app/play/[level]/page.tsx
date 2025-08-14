'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LevelPage() {
  const params = useParams<{ level: string }>();
  
  const units = [
    { id: 'unit_1', name: 'Unit 1' },
    { id: 'unit_2', name: 'Unit 2' },
    { id: 'unit_3', name: 'Unit 3' },
    { id: 'unit_4', name: 'Unit 4' },
    { id: 'unit_5', name: 'Unit 5' },
    { id: 'unit_6', name: 'Unit 6' },
    { id: 'unit_7', name: 'Unit 7' },
    { id: 'unit_8', name: 'Unit 8' },
    { id: 'unit_9', name: 'Unit 9' },
    { id: 'unit_10', name: 'Unit 10' },
    { id: 'unit_11', name: 'Unit 11' },
    { id: 'unit_12', name: 'Unit 12' }
  ];

  const levelNames: Record<string, string> = {
    'ele': 'Elementary',
    'pre_int': 'Pre-Intermediate',
    'intermediate': 'Intermediate',
    'upper_int': 'Upper Intermediate'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/play"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Levels
          </Link>
          <h1 className="text-4xl font-bold text-center text-gray-900">
            {levelNames[params.level] || params.level}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <Link
              key={unit.id}
              href={`/play/${params.level}/${unit.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-900">{unit.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
