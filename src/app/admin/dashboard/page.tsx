'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VocabularyRow {
  id: string;
  searchTerm: string;
  picture1: string;
  picture2: string;
  picture3: string;
}

export default function AdminDashboard() {
  const [username, setUsername] = useState<string>('');
  const [showGameForm, setShowGameForm] = useState<boolean>(false);
  const [gameData, setGameData] = useState({
    level: '',
    unit: '',
    section: '',
    vocabularyText: ''
  });
  const [vocabularyRows, setVocabularyRows] = useState<VocabularyRow[]>([]);
  const [showVocabularyRows, setShowVocabularyRows] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const session = localStorage.getItem('adminSession');
    if (!session) {
      router.push('/admin');
      return;
    }
    
    // Set username from stored credentials
    setUsername('admin');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin');
  };

  const handleCreateGame = () => {
    setShowGameForm(true);
  };

  const handleCancel = () => {
    setShowGameForm(false);
    setGameData({ level: '', unit: '', section: '', vocabularyText: '' });
    setVocabularyRows([]);
    setShowVocabularyRows(false);
  };

  const handleVocabularyTextChange = (text: string) => {
    setGameData(prev => ({ ...prev, vocabularyText: text }));
  };

  const addVocabularyRow = () => {
    const newRow: VocabularyRow = {
      id: `row-${Date.now()}`,
      searchTerm: '',
      picture1: '',
      picture2: '',
      picture3: ''
    };
    setVocabularyRows(prev => [...prev, newRow]);
  };

  const updateVocabularyRow = (id: string, field: keyof VocabularyRow, value: string) => {
    setVocabularyRows(prev => 
      prev.map(row => 
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const deleteVocabularyRow = (id: string) => {
    setVocabularyRows(prev => prev.filter(row => row.id !== id));
  };

  const handleSearch = (id: string) => {
    const row = vocabularyRows.find(r => r.id === id);
    if (row && row.searchTerm.trim()) {
      // TODO: Call API to search for images
      console.log(`Searching for: ${row.searchTerm}`);
      alert(`Searching for: ${row.searchTerm} (API call will be implemented)`);
    }
  };

  const handleSearchAll = () => {
    if (!gameData.vocabularyText.trim()) {
      alert('Please enter vocabulary terms first');
      return;
    }
    
    // Parse CSV-like text into rows - each term becomes a separate row
    const terms = gameData.vocabularyText.split(',').map(term => term.trim()).filter(term => term);
    
    if (terms.length === 0) {
      alert('No valid terms found');
      return;
    }
    
    const rows = terms.map((term, index) => ({
      id: `row-${index}`,
      searchTerm: term,
      picture1: '',
      picture2: '',
      picture3: ''
    }));
    
    setVocabularyRows(rows);
    setShowVocabularyRows(true);
    
    // TODO: Call API to search for all terms
    console.log('Searching for all terms:', terms);
    alert(`Searching for ${terms.length} terms: ${terms.join(', ')} (API call will be implemented)`);
  };

  const handleSaveGame = () => {
    // TODO: Save game data
    console.log('Game Data:', gameData);
    console.log('Vocabulary Rows:', vocabularyRows);
    alert('Game saved! (Check console for data)');
  };

  if (showGameForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Cancel
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Game
              </h1>
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{username}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Basic Game Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={gameData.level}
                  onChange={(e) => setGameData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  <option value="ele">Elementary</option>
                  <option value="pre_int">Pre-Intermediate</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="upper_int">Upper Intermediate</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={gameData.unit}
                  onChange={(e) => setGameData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Unit</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={`unit_${i + 1}`}>Unit {i + 1}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  value={gameData.section}
                  onChange={(e) => setGameData(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Section</option>
                  <option value="A">A - Animals</option>
                  <option value="B">B - Fears</option>
                  <option value="C">C - Family</option>
                </select>
              </div>
            </div>

            {/* Vocabulary Input */}
            {!showVocabularyRows && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vocabulary Words (comma-separated terms)
                </label>
                <textarea
                  value={gameData.vocabularyText}
                  onChange={(e) => handleVocabularyTextChange(e.target.value)}
                  placeholder="Enter vocabulary terms separated by commas:&#10;cat, dog, bird, elephant, lion"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSearchAll}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Search All
                  </button>
                </div>
              </div>
            )}

            {/* Vocabulary Rows */}
            {showVocabularyRows && vocabularyRows.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Vocabulary Rows</h3>
                  <button
                    onClick={addVocabularyRow}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    + Add Row
                  </button>
                </div>
                
                <div className="space-y-3">
                  {vocabularyRows.map((row) => (
                    <div key={row.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="text"
                        value={row.searchTerm}
                        onChange={(e) => updateVocabularyRow(row.id, 'searchTerm', e.target.value)}
                        placeholder="Search term"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <input
                        type="text"
                        value={row.picture1}
                        onChange={(e) => updateVocabularyRow(row.id, 'picture1', e.target.value)}
                        placeholder="Picture 1"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={row.picture2}
                        onChange={(e) => updateVocabularyRow(row.id, 'picture2', e.target.value)}
                        placeholder="Picture 2"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={row.picture3}
                        onChange={(e) => updateVocabularyRow(row.id, 'picture3', e.target.value)}
                        placeholder="Picture 3"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => deleteVocabularyRow(row.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGame}
                disabled={!gameData.level || !gameData.unit || !gameData.section || vocabularyRows.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Save Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <button 
              onClick={handleCreateGame}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
