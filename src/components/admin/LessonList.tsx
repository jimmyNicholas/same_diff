'use client';

import { useState, useEffect } from 'react';
import { lessonService, type Lesson } from '@/lib/services/lessonService';

interface LessonListProps {
  onSelectLesson: (lesson: Lesson) => void;
  onEditLesson?: (lesson: Lesson) => void;
  onDeleteLesson?: (lessonId: string) => void;
}

export default function LessonList({ onSelectLesson, onEditLesson, onDeleteLesson }: LessonListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [searchTopic, setSearchTopic] = useState<string>('');

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = () => {
    const allLessons = lessonService.getAllLessons();
    setLessons(allLessons);
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesLevel = !filterLevel || lesson.level === filterLevel;
    const matchesTopic = !searchTopic || 
      lesson.topic.toLowerCase().includes(searchTopic.toLowerCase());
    return matchesLevel && matchesTopic;
  });

  const handleDelete = (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      lessonService.deleteLesson(lessonId);
      loadLessons();
      onDeleteLesson?.(lessonId);
    }
  };

  const getLevelDisplayName = (level: string) => {
    const levelMap: Record<string, string> = {
      'ele': 'Elementary',
      'pre_int': 'Pre-Intermediate',
      'intermediate': 'Intermediate',
      'upper_int': 'Upper Intermediate'
    };
    return levelMap[level] || level;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Topic
          </label>
          <input
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            placeholder="Search lessons..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Level
          </label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="ele">Elementary</option>
            <option value="pre_int">Pre-Intermediate</option>
            <option value="intermediate">Intermediate</option>
            <option value="upper_int">Upper Intermediate</option>
          </select>
        </div>
      </div>

      {/* Lesson Count */}
      <div className="text-sm text-gray-600">
        {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''} found
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No lessons found. Create your first lesson to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 truncate" title={lesson.topic}>
                    {lesson.topic}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getLevelDisplayName(lesson.level)}
                  </p>
                </div>
                <div className="flex gap-2 ml-2">
                  {onEditLesson && (
                    <button
                      onClick={() => onEditLesson(lesson)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Edit lesson"
                    >
                      Edit
                    </button>
                  )}
                  {onDeleteLesson && (
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      title="Delete lesson"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-3">
                {lesson.vocabularyRows.length} vocabulary term{lesson.vocabularyRows.length !== 1 ? 's' : ''}
              </div>
              
              <div className="text-xs text-gray-400">
                Created: {new Date(lesson.createdAt).toLocaleDateString()}
              </div>
              
              <button
                onClick={() => onSelectLesson(lesson)}
                className="w-full mt-3 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Use This Lesson
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
