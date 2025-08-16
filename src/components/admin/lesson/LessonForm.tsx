'use client';

import { useState } from 'react';
import { useImageSearch } from '@/lib/hooks/useImageSearch';
import ImageSection from '../ImageSection';
import { lessonService, type Lesson, type VocabularyRow } from '@/lib/services/lessonService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
  

  const handleSaveLesson = () => {
    if (!lessonData.level || !lessonData.topic) {
      alert('Please fill in all required fields and add vocabulary terms');
      return;
    }

    try {
      const savedLesson = lessonService.saveLesson({
        level: lessonData.level,
        topic: lessonData.topic,
        vocabularyRows: lessonData.vocabularyText.split(',').map(term => ({
          id: `row-${Date.now()}`,
          searchTerm: term.trim(),
          pictures: []
        }))
      });

      console.log('Lesson saved successfully:', savedLesson);
      onSave(savedLesson);
    } catch (error) {
      console.error('Failed to save lesson:', error);
      alert('Failed to save lesson. Please try again.');
    }
  };

  const canSave = lessonData.level && lessonData.topic;

  const getLevelDisplayName = (level: string) => {
    switch (level) {
      case 'ele':
        return 'Elementary';
      case 'pre_int':
        return 'Pre-Intermediate';
      case 'intermediate':
        return 'Intermediate';
      case 'upper_int':
        return 'Upper Intermediate';
      default:
        return level;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="p-6 space-y-6">
          {/* Basic Lesson Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {lessonData.level ? getLevelDisplayName(lessonData.level) : "Select Level"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setLessonData(prev => ({ ...prev, level: "ele" }))}>
                    Elementary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLessonData(prev => ({ ...prev, level: "pre_int" }))}>
                    Pre-Intermediate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLessonData(prev => ({ ...prev, level: "intermediate" }))}>
                    Intermediate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLessonData(prev => ({ ...prev, level: "upper_int" }))}>
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
                onChange={(e) => setLessonData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Animals, Food, Travel, Family"
                className="w-full"
              />
            </div>
          </div>

          {/* Vocabulary Input */}
          <div>
            <Label htmlFor="vocabulary-text" className="block text-sm font-medium text-gray-700 mb-2">
              Vocabulary Words (comma-separated terms)
            </Label>
            <Textarea
              id="vocabulary-text"
              value={lessonData.vocabularyText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLessonData(prev => ({ ...prev, vocabularyText: e.target.value }))}
              placeholder="Enter vocabulary terms separated by commas:&#10;cat, dog, bird, elephant, lion"
              className="w-full h-32"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLesson}
              disabled={!canSave}
              className="px-6 py-2"
            >
              Save Lesson
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
