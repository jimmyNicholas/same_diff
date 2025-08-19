'use client';

import { useState, useEffect } from 'react';
import { lessonService, type Lesson } from '@/lib/services/lessonService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useModals } from '@/lib/providers/app-context';

export default function AdminLessons() {
  const { createLessonOpen, closeCreateLesson } = useModals();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [searchTopic, setSearchTopic] = useState<string>('');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = () => {
    const allLessons = lessonService.getAllLessons();
    setLessons(allLessons);
  };

  const handleCreateLesson = () => {
    setEditingLesson(null);
    setIsEditing(false);
    closeCreateLesson();
  };

  const handleSaveLesson = (lesson: Lesson) => {
    if (isEditing && editingLesson) {
      lessonService.updateLesson(lesson.id, lesson);
    } else {
      lessonService.saveLesson({
        level: lesson.level,
        topic: lesson.topic,
        vocabulary: lesson.vocabulary,
      });
    }
    loadLessons();
    setEditingLesson(null);
    setIsEditing(false);
    closeCreateLesson();
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsEditing(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      lessonService.deleteLesson(lessonId);
      loadLessons();
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    console.log('Selected lesson:', lesson);
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesLevel = !filterLevel || lesson.level === filterLevel;
    const matchesTopic = !searchTopic || lesson.topic.toLowerCase().includes(searchTopic.toLowerCase());
    return matchesLevel && matchesTopic;
  });

  const getLevelDisplayName = (level: string) => {
    const levelMap: Record<string, string> = {
      ele: 'Elementary',
      pre_int: 'Pre-Intermediate',
      intermediate: 'Intermediate',
      upper_int: 'Upper Intermediate',
    };
    return levelMap[level] || level;
  };

  // Helper function for level display names
  const getLevelDisplayNameHelper = (level: string) => {
    const levelMap: Record<string, string> = {
      ele: 'Elementary',
      pre_int: 'Pre-Intermediate',
      intermediate: 'Intermediate',
      upper_int: 'Upper Intermediate',
    };
    return levelMap[level] || level;
  };

  // Show lesson form when creating or editing
  if (createLessonOpen || isEditing) {
    return <LessonFormSection 
      onSave={handleSaveLesson}
      onCancel={handleCreateLesson}
      initialData={editingLesson}
      isEditing={isEditing}
      getLevelDisplayName={getLevelDisplayNameHelper}
    />;
  }

  // Show lesson list
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <LessonListSection 
                lessons={filteredLessons}
                filterLevel={filterLevel}
                searchTopic={searchTopic}
                onFilterLevelChange={setFilterLevel}
                onSearchTopicChange={setSearchTopic}
                onCreateLesson={() => closeCreateLesson()}
                onSelectLesson={handleSelectLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
                getLevelDisplayName={getLevelDisplayName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lesson Form Component
function LessonFormSection({ 
  onSave, 
  onCancel, 
  initialData, 
  isEditing,
  getLevelDisplayName
}: { 
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
  initialData?: Lesson | null;
  isEditing: boolean;
  getLevelDisplayName: (level: string) => string;
}) {
  const [lessonData, setLessonData] = useState({
    level: initialData?.level || '',
    topic: initialData?.topic || '',
    vocabularyText: initialData?.vocabulary?.map((word) => word.searchTerm).join(', ') || '',
  });

  const handleSave = () => {
    if (!lessonData.level || !lessonData.topic) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const vocabulary = lessonData.vocabularyText
        .split(',')
        .map((term) => ({
          id: `vocab-${Date.now()}-${Math.random()}`,
          searchTerm: term.trim(),
          pictures: [],
        }))
        .filter((row) => row.searchTerm);

      if (isEditing && initialData) {
        const updatedLesson: Lesson = {
          ...initialData,
          level: lessonData.level,
          topic: lessonData.topic,
          vocabulary,
          updatedAt: new Date().toISOString(),
        };
        onSave(updatedLesson);
      } else {
        const newLesson = lessonService.saveLesson({
          level: lessonData.level,
          topic: lessonData.topic,
          vocabulary,
        });
        onSave(newLesson);
      }
    } catch (error) {
      console.error('Failed to save lesson:', error);
      alert('Failed to save lesson. Please try again.');
    }
  };

  const canSave = lessonData.level && lessonData.topic;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Lesson' : 'Create New Lesson'}
            </h1>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onCancel} className="px-6 py-2">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!canSave} className="px-6 py-2">
                {isEditing ? 'Update Lesson' : 'Save Lesson'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {lessonData.level ? getLevelDisplayName(lessonData.level) : 'Select Level'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setLessonData((prev) => ({ ...prev, level: 'ele' }))}>
                    Elementary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLessonData((prev) => ({ ...prev, level: 'pre_int' }))}>
                    Pre-Intermediate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLessonData((prev) => ({ ...prev, level: 'intermediate' }))}>
                    Intermediate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLessonData((prev) => ({ ...prev, level: 'upper_int' }))}>
                    Upper Intermediate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <Label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </Label>
              <Input
                id="topic"
                type="text"
                value={lessonData.topic}
                onChange={(e) => setLessonData((prev) => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Animals, Food, Travel, Family"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vocabulary-text" className="block text-sm font-medium text-gray-700 mb-2">
              Vocabulary Words (comma-separated terms)
            </Label>
            <Textarea
              id="vocabulary-text"
              value={lessonData.vocabularyText}
              onChange={(e) => setLessonData((prev) => ({ ...prev, vocabularyText: e.target.value }))}
              placeholder="Enter vocabulary terms separated by commas:&#10;cat, dog, bird, elephant, lion"
              className="w-full h-32"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

// Lesson List Component
function LessonListSection({
  lessons,
  filterLevel,
  searchTopic,
  onFilterLevelChange,
  onSearchTopicChange,
  onCreateLesson,
  onSelectLesson,
  onEditLesson,
  onDeleteLesson,
  getLevelDisplayName,
}: {
  lessons: Lesson[];
  filterLevel: string;
  searchTopic: string;
  onFilterLevelChange: (level: string) => void;
  onSearchTopicChange: (topic: string) => void;
  onCreateLesson: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  getLevelDisplayName: (level: string) => string;
}) {
  return (
    <div className="grid gap-4">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search-topic" className="block text-sm font-medium text-gray-700 mb-2">
            Search by Topic
          </Label>
          <Input
            id="search-topic"
            type="text"
            value={searchTopic}
            onChange={(e) => onSearchTopicChange(e.target.value)}
            placeholder="Search lessons..."
            className="w-full"
          />
        </div>
        <div className="w-48">
          <Label htmlFor="filter-level" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Level
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {filterLevel ? getLevelDisplayName(filterLevel) : 'All Levels'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => onFilterLevelChange('')}>
                All Levels
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterLevelChange('ele')}>
                Elementary
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterLevelChange('pre_int')}>
                Pre-Intermediate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterLevelChange('intermediate')}>
                Intermediate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterLevelChange('upper_int')}>
                Upper Intermediate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={onCreateLesson} className="h-full px-4 py-2 rounded-md transition-colors">
          Create New Lesson
        </Button>
      </div>

      <div className="text-sm text-gray-600">
        {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} found
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No lessons found. Create your first lesson to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {lessons.map((lesson) => (
            <LessonCardSection
              key={lesson.id}
              lesson={lesson}
              onSelectLesson={onSelectLesson}
              onEditLesson={onEditLesson}
              onDeleteLesson={onDeleteLesson}
              getLevelDisplayName={getLevelDisplayName}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Lesson Card Component
function LessonCardSection({
  lesson,
  onSelectLesson,
  onEditLesson,
  onDeleteLesson,
  getLevelDisplayName,
}: {
  lesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  getLevelDisplayName: (level: string) => string;
}) {
  return (
    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-gray-900 truncate" title={lesson.topic}>
              {lesson.topic}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {getLevelDisplayName(lesson.level)}
            </p>
          </div>
          <div className="flex gap-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditLesson(lesson)}
              className="text-blue-600 hover:text-blue-800 p-0 h-auto"
              title="Edit lesson"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteLesson(lesson.id)}
              className="text-red-600 hover:text-red-800 p-0 h-auto"
              title="Delete lesson"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="text-sm text-gray-500 mb-3">
          {'Vocabulary: '}
          {lesson.vocabulary.length > 0 
            ? lesson.vocabulary.map((word) => word.searchTerm).join(', ') 
            : 'No vocabulary terms'
          }
        </div>

        <div className="text-xs text-gray-400 mb-3">
          Created: {new Date(lesson.createdAt).toLocaleDateString()}
        </div>

        <Button onClick={() => onSelectLesson(lesson)} className="w-full" size="sm">
          Create Activity
        </Button>
      </CardContent>
    </Card>
  );
}
