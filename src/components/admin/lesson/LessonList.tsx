"use client";

import { useState, useEffect } from "react";
import { lessonService, type Lesson } from "@/lib/services/lessonService";
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
import LessonForm from "./LessonForm";
import LessonCard from "./LessonCard";

interface LessonListProps {
  onSelectLesson: (lesson: Lesson) => void;
  onEditLesson?: (lesson: Lesson) => void;
  onDeleteLesson?: (lessonId: string) => void;
}

export default function LessonList({
  onSelectLesson,
  onEditLesson,
  onDeleteLesson,
}: LessonListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>("");
  const [searchTopic, setSearchTopic] = useState<string>("");
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = () => {
    const allLessons = lessonService.getAllLessons();
    setLessons(allLessons);
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesLevel = !filterLevel || lesson.level === filterLevel;
    const matchesTopic =
      !searchTopic ||
      lesson.topic.toLowerCase().includes(searchTopic.toLowerCase());
    return matchesLevel && matchesTopic;
  });

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingLesson(null);
    setIsEditing(false);
  };

  const handleSave = (lesson: Lesson) => {
    // Update the lesson in the service
    lessonService.updateLesson(lesson.id, lesson);
    // Reload lessons to get updated data
    loadLessons();
    // Exit editing mode
    setEditingLesson(null);
    setIsEditing(false);
    // Notify parent if callback provided
    onEditLesson?.(lesson);
  };

  const handleDelete = (lessonId: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      lessonService.deleteLesson(lessonId);
      loadLessons();
      onDeleteLesson?.(lessonId);
    }
  };

  const getLevelDisplayName = (level: string) => {
    const levelMap: Record<string, string> = {
      ele: "Elementary",
      pre_int: "Pre-Intermediate",
      intermediate: "Intermediate",
      upper_int: "Upper Intermediate",
    };
    return levelMap[level] || level;
  };

  // If editing, show the form
  if (isEditing && editingLesson) {
    return (
      <LessonForm
        initialData={editingLesson}
        isEditing={true}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    );
  }

  // Otherwise show the lesson list
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Label
            htmlFor="search-topic"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
          <Label
            htmlFor="filter-level"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
        {filteredLessons.length} lesson{filteredLessons.length !== 1 ? "s" : ""}{" "}
        found
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No lessons found. Create your first lesson to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onSelectLesson={onSelectLesson}
              onEditLesson={handleEdit}
              onDeleteLesson={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
