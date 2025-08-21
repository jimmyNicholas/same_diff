export interface Vocabulary {
  id: string;
  searchTerm: string;
  pictures: string[];
}

export interface Lesson {
  id: string;
  level: string;
  topic: string;
  vocabulary: Vocabulary[];
  createdAt: string;
  updatedAt: string;
}

class LessonService {
  private readonly STORAGE_KEY = 'lessons';

  private getLessons(): Lesson[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading lessons from localStorage:', error);
      return [];
    }
  }

  private saveLessons(lessons: Lesson[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lessons));
    } catch (error) {
      console.error('Error saving lessons to localStorage:', error);
    }
  }

  /**
   * Get all lessons
   */
  getAllLessons(): Lesson[] {
    return this.getLessons();
  }

  /**
   * Get a lesson by ID
   */
  getLessonById(id: string): Lesson | null {
    const lessons = this.getLessons();
    return lessons.find(lesson => lesson.id === id) || null;
  }

  /**
   * Save a new lesson
   */
  saveLesson(lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Lesson {
    const lessons = this.getLessons();
    const now = new Date().toISOString();
    
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson_${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };

    lessons.push(newLesson);
    this.saveLessons(lessons);
    
    return newLesson;
  }

  /**
   * Update an existing lesson
   */
  updateLesson(id: string, updates: Partial<Omit<Lesson, 'id' | 'createdAt'>>): Lesson | null {
    const lessons = this.getLessons();
    const lessonIndex = lessons.findIndex(lesson => lesson.id === id);
    
    if (lessonIndex === -1) return null;

    const updatedLesson: Lesson = {
      ...lessons[lessonIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    lessons[lessonIndex] = updatedLesson;
    this.saveLessons(lessons);
    
    return updatedLesson;
  }

  /**
   * Delete a lesson
   */
  deleteLesson(id: string): boolean {
    const lessons = this.getLessons();
    const filteredLessons = lessons.filter(lesson => lesson.id !== id);
    
    if (filteredLessons.length === lessons.length) {
      return false; // Lesson not found
    }

    this.saveLessons(filteredLessons);
    return true;
  }

  /**
   * Get lessons by level
   */
  getLessonsByLevel(level: string): Lesson[] {
    const lessons = this.getLessons();
    return lessons.filter(lesson => lesson.level === level);
  }

  /**
   * Get lessons by topic (case-insensitive search)
   */
  getLessonsByTopic(topic: string): Lesson[] {
    const lessons = this.getLessons();
    const searchTerm = topic.toLowerCase();
    return lessons.filter(lesson => 
      lesson.topic.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get recent lessons (last 10)
   */
  getRecentLessons(limit: number = 10): Lesson[] {
    const lessons = this.getLessons();
    return lessons
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }
}

// Export singleton instance
export const lessonService = new LessonService();
