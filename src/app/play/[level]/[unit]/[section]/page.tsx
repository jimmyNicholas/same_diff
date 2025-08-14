'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SectionPage() {
  const params = useParams<{ level: string; unit: string; section: string }>();
  
  const playerCounts = [2, 3, 4, 5];
  
  const sectionNames: Record<string, string> = {
    'A': 'Animals',
    'B': 'Fears', 
    'C': 'Family'
  };

  const unitNames: Record<string, string> = {
    'unit_1': 'Unit 1',
    'unit_2': 'Unit 2',
    'unit_3': 'Unit 3',
    'unit_4': 'Unit 4',
    'unit_5': 'Unit 5',
    'unit_6': 'Unit 6',
    'unit_7': 'Unit 7',
    'unit_8': 'Unit 8',
    'unit_9': 'Unit 9',
    'unit_10': 'Unit 10',
    'unit_11': 'Unit 11',
    'unit_12': 'Unit 12'
  };

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
            href={`/play/${params.level}/${params.unit}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to {unitNames[params.unit] || params.unit}
          </Link>
          <h1 className="text-4xl font-bold text-center text-gray-900">
            {sectionNames[params.section] || params.section}
          </h1>
          <p className="text-center text-gray-600 mt-2">
            {unitNames[params.unit] || params.unit} - {levelNames[params.level] || params.level}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            How many players?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {playerCounts.map((count) => (
              <Link
                key={count}
                href={`/play/${params.level}/${params.unit}/${params.section}/${count}_players`}
                className="bg-blue-600 text-white text-center py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm">Players</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
