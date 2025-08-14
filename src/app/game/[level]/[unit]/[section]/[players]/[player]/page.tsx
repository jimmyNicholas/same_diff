'use client';

import { useParams } from 'next/navigation';

export default function GamePage() {
  const params = useParams<{ 
    level: string; 
    unit: string; 
    section: string; 
    players: string; 
    player: string 
  }>();
  
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              ELICOS Game
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {sectionNames[params.section] || params.section} - {unitNames[params.unit] || params.unit} - {levelNames[params.level] || params.level}
            </p>
            <p className="text-md text-gray-500 mt-1">
              You are Player {params.player} • {params.players} total players
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500 mb-4">
            <p className="text-lg">Game implementation coming soon...</p>
            <p className="text-sm mt-2">
              This is where the actual ELICOS game logic will be integrated from your existing project
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">Game Details:</h3>
            <ul className="text-sm text-blue-800 text-left space-y-1">
              <li>• Level: {levelNames[params.level] || params.level}</li>
              <li>• Unit: {unitNames[params.unit] || params.unit}</li>
              <li>• Section: {sectionNames[params.section] || params.section}</li>
              <li>• Players: {params.players}</li>
              <li>• Your Position: Player {params.player}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
