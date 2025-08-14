'use client';

import { useParams } from 'next/navigation';
import { GameRouteParams } from '@/lib/types';

export default function GamePage() {
  const params = useParams<GameRouteParams>();
  
  // TODO: Fetch game data based on params
  // TODO: Implement actual game logic from existing project
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            ELICOS Game
          </h1>
          
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-600">
              Level: <span className="font-semibold">{params.level}</span>
            </p>
            <p className="text-lg text-gray-600">
              Unit: <span className="font-semibold">{params.unit}</span>
            </p>
            <p className="text-lg text-gray-600">
              Lesson: <span className="font-semibold">{params.lesson}</span>
            </p>
            <p className="text-lg text-gray-600">
              Players: <span className="font-semibold">{params.players}</span>
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Game implementation coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
