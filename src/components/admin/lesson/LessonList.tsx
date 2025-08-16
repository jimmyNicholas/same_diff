'use client';

import { useState, useEffect } from 'react';
import { lessonService, type Lesson } from '@/lib/services/lessonService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
          <Label htmlFor="search-topic" className="block text-sm font-medium text-gray-700 mb-2">
            Search by Topic
          </Label>
          <Input
            id="search-topic"
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
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
                {filterLevel ? getLevelDisplayName(filterLevel) : "All Levels"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => setFilterLevel("")}>
                All Levels
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterLevel("ele")}>
                Elementary
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterLevel("pre_int")}>
                Pre-Intermediate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterLevel("intermediate")}>
                Intermediate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterLevel("upper_int")}>
                Upper Intermediate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <div className="grid grid-cols-1 gap-4">
          {filteredLessons.map((lesson) => (
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
                    {onEditLesson && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditLesson(lesson)}
                        className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                        title="Edit lesson"
                      >
                        Edit
                      </Button>
                    )}
                    {onDeleteLesson && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(lesson.id)}
                        className="text-red-600 hover:text-red-800 p-0 h-auto"
                        title="Delete lesson"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="text-sm text-gray-500 mb-3">
                  {lesson.vocabularyRows.length} vocabulary term{lesson.vocabularyRows.length !== 1 ? 's' : ''}
                </div>
                
                <div className="text-xs text-gray-400 mb-3">
                  Created: {new Date(lesson.createdAt).toLocaleDateString()}
                </div>
                
                <Button
                  onClick={() => onSelectLesson(lesson)}
                  className="w-full"
                  size="sm"
                >
                  Create Activity
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
