import { lessonService, type Lesson, type VocabularyRow } from '../lessonService'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('LessonService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('getAllLessons', () => {
    it('should return empty array when no lessons exist', () => {
      const lessons = lessonService.getAllLessons()
      expect(lessons).toEqual([])
    })

    it('should return lessons from localStorage', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))
      const lessons = lessonService.getAllLessons()
      expect(lessons).toEqual(mockLessons)
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const lessons = lessonService.getAllLessons()
      expect(lessons).toEqual([])
    })
  })

  describe('saveLesson', () => {
    it('should save a new lesson with generated id and timestamps', () => {
      const lessonData = {
        level: 'elementary',
        topic: 'Animals',
        vocabularyRows: [] as VocabularyRow[],
      }

      const savedLesson = lessonService.saveLesson(lessonData)

      expect(savedLesson.id).toMatch(/^lesson_\d+$/)
      expect(savedLesson.level).toBe('elementary')
      expect(savedLesson.topic).toBe('Animals')
      expect(savedLesson.createdAt).toBeDefined()
      expect(savedLesson.updatedAt).toBeDefined()
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should add lesson to existing lessons', () => {
      const existingLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingLessons))

      const lessonData = {
        level: 'intermediate',
        topic: 'Food',
        vocabularyRows: [] as VocabularyRow[],
      }

      lessonService.saveLesson(lessonData)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'lessons',
        expect.stringContaining('"topic":"Food"')
      )
    })
  })

  describe('getLessonById', () => {
    it('should return lesson when found', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))
      const lesson = lessonService.getLessonById('lesson-1')

      expect(lesson).toEqual(mockLessons[0])
    })

    it('should return null when lesson not found', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))
      const lesson = lessonService.getLessonById('nonexistent')

      expect(lesson).toBeNull()
    })
  })

  describe('updateLesson', () => {
    it('should update existing lesson', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))

      const updatedLesson = lessonService.updateLesson('lesson-1', {
        topic: 'Updated Topic',
      })

      expect(updatedLesson).toBeDefined()
      expect(updatedLesson?.topic).toBe('Updated Topic')
      expect(updatedLesson?.updatedAt).not.toBe('2024-01-01T00:00:00.000Z')
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should return null when lesson not found', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))

      const updatedLesson = lessonService.updateLesson('nonexistent', {
        topic: 'Updated Topic',
      })

      expect(updatedLesson).toBeNull()
    })
  })

  describe('deleteLesson', () => {
    it('should delete existing lesson', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'lesson-2',
          level: 'intermediate',
          topic: 'Food',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))

      const result = lessonService.deleteLesson('lesson-1')

      expect(result).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'lessons',
        JSON.stringify([mockLessons[1]])
      )
    })

    it('should return false when lesson not found', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))

      const result = lessonService.deleteLesson('nonexistent')

      expect(result).toBe(false)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('getLessonsByLevel', () => {
    it('should return lessons filtered by level', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'lesson-2',
          level: 'intermediate',
          topic: 'Food',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))

      const elementaryLessons = lessonService.getLessonsByLevel('elementary')
      const intermediateLessons = lessonService.getLessonsByLevel('intermediate')

      expect(elementaryLessons).toHaveLength(1)
      expect(elementaryLessons[0].level).toBe('elementary')
      expect(intermediateLessons).toHaveLength(1)
      expect(intermediateLessons[0].level).toBe('intermediate')
    })
  })

  describe('getLessonsByTopic', () => {
    it('should return lessons filtered by topic (case-insensitive)', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'lesson-2',
          level: 'intermediate',
          topic: 'Wild Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'lesson-3',
          level: 'elementary',
          topic: 'Food',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))

      const animalLessons = lessonService.getLessonsByTopic('animal')
      const foodLessons = lessonService.getLessonsByTopic('FOOD')

      expect(animalLessons).toHaveLength(2)
      expect(foodLessons).toHaveLength(1)
      expect(foodLessons[0].topic).toBe('Food')
    })
  })

  describe('getRecentLessons', () => {
    it('should return recent lessons sorted by updatedAt', () => {
      const mockLessons: Lesson[] = [
        {
          id: 'lesson-1',
          level: 'elementary',
          topic: 'Animals',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'lesson-2',
          level: 'intermediate',
          topic: 'Food',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: 'lesson-3',
          level: 'elementary',
          topic: 'Colors',
          vocabularyRows: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-03T00:00:00.000Z',
        },
      ]

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))

      const recentLessons = lessonService.getRecentLessons(2)

      expect(recentLessons).toHaveLength(2)
      expect(recentLessons[0].id).toBe('lesson-3') // Most recent
      expect(recentLessons[1].id).toBe('lesson-2')
    })

    it('should return default limit of 10 when no limit specified', () => {
      const mockLessons = Array.from({ length: 15 }, (_, i) => ({
        id: `lesson-${i}`,
        level: 'elementary',
        topic: `Topic ${i}`,
        vocabularyRows: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00.000Z`,
      }))

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockLessons))

      const recentLessons = lessonService.getRecentLessons()

      expect(recentLessons).toHaveLength(10)
    })
  })
})
