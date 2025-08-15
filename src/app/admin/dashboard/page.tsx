'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LessonForm from '@/components/admin/LessonForm';
import LessonList from '@/components/admin/LessonList';
import { type Lesson } from '@/lib/services/lessonService';

export default function AdminDashboard() {
  const [username, setUsername] = useState<string>('');
  const [showLessonForm, setShowLessonForm] = useState<boolean>(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
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
    loadLessons();
  }, [router]);

  const loadLessons = () => {
    // Import lessonService dynamically to avoid SSR issues
    import('@/lib/services/lessonService').then(({ lessonService }) => {
      const allLessons = lessonService.getAllLessons();
      setLessons(allLessons);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin');
  };

  const handleCreateLesson = () => {
    setShowLessonForm(true);
  };

  const handleCancelLesson = () => {
    setShowLessonForm(false);
  };

  const handleSaveLesson = (lesson: Lesson) => {
    console.log('Lesson saved successfully:', lesson);
    // Refresh the lesson list to show the new lesson
    loadLessons();
    setShowLessonForm(false);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    console.log('Selected lesson:', lesson);
    // TODO: Navigate to lesson view or game
  };

  const handleEditLesson = (lesson: Lesson) => {
    console.log('Edit lesson:', lesson);
    // TODO: Implement lesson editing
  };

  const handleDeleteLesson = (lessonId: string) => {
    // Refresh the lesson list after deletion
    loadLessons();
  };

  if (showLessonForm) {
    return (
      <LessonForm
        username={username}
        onCancel={handleCancelLesson}
        onSave={handleSaveLesson}
      />
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
          {/* Header with Create Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Lessons</h2>
            <button 
              onClick={handleCreateLesson}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create New Lesson
            </button>
          </div>

          {/* Lesson List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <LessonList
                onSelectLesson={handleSelectLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
