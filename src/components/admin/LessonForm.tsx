'use client';

import { useState } from 'react';
import { useImageSearch } from '@/lib/hooks/useImageSearch';
import ImageSection from './ImageSection';
import { lessonService, type Lesson, type VocabularyRow } from '@/lib/services/lessonService';

interface LessonFormProps {
  username: string;
  onCancel: () => void;
  onSave: (lesson: Lesson) => void;
}

export default function LessonForm({ username, onCancel, onSave }: LessonFormProps) {
  const [lessonData, setLessonData] = useState({
    level: '',
    topic: '',
    vocabularyText: ''
  });
  const [vocabularyRows, setVocabularyRows] = useState<VocabularyRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { searchBatch, isLoading: isImageSearchLoading } = useImageSearch();

  const handleVocabularyTextChange = (text: string) => {
    setLessonData(prev => ({ ...prev, vocabularyText: text }));
  };

  const addVocabularyRow = () => {
    const newRow: VocabularyRow = {
      id: `row-${Date.now()}`,
      searchTerm: '',
      pictures: ['', '']
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

  const handleSearchAll = async () => {
    if (!lessonData.vocabularyText.trim()) {
      alert('Please enter vocabulary terms first');
      return;
    }
    
    const terms = lessonData.vocabularyText.split(',').map(term => term.trim()).filter(term => term);
    
    if (terms.length === 0) {
      alert('No valid terms found');
      return;
    }
    
    const rows = terms.map((term, index) => ({
      id: `row-${index}`,
      searchTerm: term,
      pictures: ['', '']
    }));
    
    setVocabularyRows(rows);
    setIsLoading(true);
    
    try {
      const batchResult = await searchBatch(terms, 4);
      
      // Update rows with found images
      batchResult.results.forEach((result, index) => {
        if (result.success && result.images.length > 0) {
          const imageUrls = result.images.map(img => img.urls.small);
          setVocabularyRows(prev => 
            prev.map(r => 
              r.id === rows[index].id ? {
                ...r,
                pictures: imageUrls.slice(0, 5)
              } : r
            )
          );
        }
      });
      
      alert(`Searched for ${batchResult.totalQueries} terms. Success: ${batchResult.successfulQueries}, Failed: ${batchResult.failedQueries}`);
    } catch (error) {
      console.error('Batch search failed:', error);
      alert('Batch search failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLesson = () => {
    if (!lessonData.level || !lessonData.topic || vocabularyRows.length === 0) {
      alert('Please fill in all required fields and add vocabulary terms');
      return;
    }

    try {
      const savedLesson = lessonService.saveLesson({
        level: lessonData.level,
        topic: lessonData.topic,
        vocabularyRows
      });

      console.log('Lesson saved successfully:', savedLesson);
      onSave(savedLesson);
    } catch (error) {
      console.error('Failed to save lesson:', error);
      alert('Failed to save lesson. Please try again.');
    }
  };

  const canSave = lessonData.level && lessonData.topic && vocabularyRows.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Cancel
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Lesson
            </h1>
            <span className="text-gray-700">
              Welcome, <span className="font-semibold">{username}</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Lesson Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={lessonData.level}
                onChange={(e) => setLessonData(prev => ({ ...prev, level: e.target.value }))}
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
                Topic
              </label>
              <input
                type="text"
                value={lessonData.topic}
                onChange={(e) => setLessonData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Animals, Food, Travel, Family"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Vocabulary Input */}
          {vocabularyRows.length === 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vocabulary Words (comma-separated terms)
              </label>
              <textarea
                value={lessonData.vocabularyText}
                onChange={(e) => handleVocabularyTextChange(e.target.value)}
                placeholder="Enter vocabulary terms separated by commas:&#10;cat, dog, bird, elephant, lion"
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSearchAll}
                  disabled={isLoading || isImageSearchLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading || isImageSearchLoading ? 'Searching...' : 'Search All'}
                </button>
              </div>
            </div>
          )}

          {/* Vocabulary Rows */}
          {vocabularyRows.length > 0 && (
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
                    
                    <ImageSection
                      rowId={row.id}
                      pictures={row.pictures}
                      searchTerm={row.searchTerm}
                      onUpdatePictures={(id, pictures) => {
                        setVocabularyRows(prev => 
                          prev.map(r => 
                            r.id === id ? { ...r, pictures } : r
                          )
                        );
                      }}
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
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveLesson}
              disabled={!canSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Save Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
