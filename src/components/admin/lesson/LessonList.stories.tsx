import { Meta, StoryObj } from "@storybook/react";
import LessonList from "./LessonList";

// Mock lesson data
const mockLessons = [
    {
      id: "lesson_1",
      level: "ele",
      topic: "Basic Colors",
      vocabularyRows: [
        {
          id: "vocab_1",
          searchTerm: "red",
          pictures: ["red-circle.png", "red-apple.png"]
        },
        {
          id: "vocab_2", 
          searchTerm: "blue",
          pictures: ["blue-sky.png", "blue-car.png"]
        }
      ],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "lesson_2",
      level: "intermediate",
      topic: "Weather Conditions",
      vocabularyRows: [
        {
          id: "vocab_3",
          searchTerm: "sunny",
          pictures: ["sun.png", "beach.png"]
        }
      ],
      createdAt: "2024-01-16T14:30:00Z",
      updatedAt: "2024-01-16T14:30:00Z"
    },
    {
      id: "lesson_3",
      level: "pre_int",
      topic: "Family Members",
      vocabularyRows: [
        {
          id: "vocab_4",
          searchTerm: "mother",
          pictures: ["mom.png"]
        },
        {
          id: "vocab_5",
          searchTerm: "father", 
          pictures: ["dad.png"]
        }
      ],
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z"
    }
  ];

  const meta: Meta<typeof LessonList> = {
    title: "Admin/Lesson/LessonList",
    component: LessonList,
    decorators: [
      (Story) => {
        // Mock the lessonService before rendering
        const originalGetAllLessons = require('@/lib/services/lessonService').lessonService.getAllLessons;
        require('@/lib/services/lessonService').lessonService.getAllLessons = () => mockLessons;
        
        return (
          <div className="w-full max-w-6xl mx-auto p-4">
            <Story />
          </div>
        );
      },
    ],
  };

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { 
    args: {
        onSelectLesson: () => {},
        onEditLesson: () => {},
        onDeleteLesson: () => {},
    },
};