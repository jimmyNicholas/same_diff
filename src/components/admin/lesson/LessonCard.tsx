import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lesson } from "@/lib/services/lessonService";
import { useState } from "react";

interface LessonCardProps {
  lesson: Lesson;
  onSelectLesson: (lesson: Lesson) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
}

const LessonCard = ({
  lesson,
  onSelectLesson,
  onEditLesson,
  onDeleteLesson,
}: LessonCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const getLevelDisplayName = (level: string) => {
    switch (level) {
      case "ele":
        return "Elementary";
      case "pre_int":
        return "Pre-Intermediate";
      case "intermediate":
        return "Intermediate";
      default:
        return level;
    }
  };

  const handleDelete = (lessonId: string) => {
    onDeleteLesson(lessonId);
  };

  return (
    <Card key={lesson.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle
              className="text-base font-semibold text-gray-900 truncate"
              title={lesson.topic}
            >
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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(lesson.id)}
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
          {lesson.vocabularyRows.length} vocabulary term
          {lesson.vocabularyRows.length !== 1 ? "s" : ""}
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
  );
};

export default LessonCard;
