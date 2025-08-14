'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function UnitPage() {
  const params = useParams<{ level: string; unit: string }>();
  
  const unitSections = [
    { id: 'A', name: 'Animals', description: 'Learn about different animals' },
    { id: 'B', name: 'Fears', description: 'Common fears and phobias' },
    { id: 'C', name: 'Family', description: 'Family members and relationships' }
  ];

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
            href={`/play/${params.level}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to {levelNames[params.level] || params.level}
          </Link>
          <h1 className="text-4xl font-bold text-center text-gray-900">
            {unitNames[params.unit] || params.unit}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {unitSections.map((section) => (
            <Link
              key={section.id}
              href={`/play/${params.level}/${params.unit}/${section.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {section.id} - {section.name}
              </h2>
              <p className="text-gray-600">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
