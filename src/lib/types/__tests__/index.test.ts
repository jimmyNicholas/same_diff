import { VocabularyWord, Unit, Level, GameConfig, AdminUser, GameRouteParams } from '../index'

describe('Type Definitions', () => {
  describe('VocabularyWord', () => {
    it('should have all required properties', () => {
      const vocab: VocabularyWord = {
        id: 'test-id',
        word: 'test',
        definition: 'A test word',
        approved: true,
        createdAt: new Date('2024-01-01'),
      }

      expect(vocab.id).toBe('test-id')
      expect(vocab.word).toBe('test')
      expect(vocab.definition).toBe('A test word')
      expect(vocab.approved).toBe(true)
      expect(vocab.createdAt).toBeInstanceOf(Date)
    })

    it('should allow optional imageUrl', () => {
      const vocab: VocabularyWord = {
        id: 'test-id',
        word: 'test',
        definition: 'A test word',
        imageUrl: 'https://example.com/image.jpg',
        approved: true,
        createdAt: new Date('2024-01-01'),
      }

      expect(vocab.imageUrl).toBe('https://example.com/image.jpg')
    })
  })

  describe('Unit', () => {
    it('should have all required properties', () => {
      const unit: Unit = {
        id: 'unit-1',
        name: 'Test Unit',
        level: 'elementary',
        vocabulary: [],
        createdAt: new Date('2024-01-01'),
      }

      expect(unit.id).toBe('unit-1')
      expect(unit.name).toBe('Test Unit')
      expect(unit.level).toBe('elementary')
      expect(unit.vocabulary).toEqual([])
      expect(unit.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('Level', () => {
    it('should have all required properties', () => {
      const level: Level = {
        id: 'level-1',
        name: 'Elementary',
        units: [],
      }

      expect(level.id).toBe('level-1')
      expect(level.name).toBe('Elementary')
      expect(level.units).toEqual([])
    })
  })

  describe('GameConfig', () => {
    it('should accept valid player counts', () => {
      const config2: GameConfig = {
        unitId: 'unit-1',
        playerCount: 2,
        difficulty: 'easy',
      }

      const config5: GameConfig = {
        unitId: 'unit-1',
        playerCount: 5,
        difficulty: 'hard',
      }

      expect(config2.playerCount).toBe(2)
      expect(config5.playerCount).toBe(5)
    })

    it('should accept valid difficulty levels', () => {
      const difficulties: GameConfig['difficulty'][] = ['easy', 'medium', 'hard']
      
      difficulties.forEach(difficulty => {
        const config: GameConfig = {
          unitId: 'unit-1',
          playerCount: 2,
          difficulty,
        }
        expect(config.difficulty).toBe(difficulty)
      })
    })
  })

  describe('AdminUser', () => {
    it('should have all required properties', () => {
      const admin: AdminUser = {
        username: 'admin',
        passwordHash: 'hashed-password',
      }

      expect(admin.username).toBe('admin')
      expect(admin.passwordHash).toBe('hashed-password')
    })
  })

  describe('GameRouteParams', () => {
    it('should have all required route parameters', () => {
      const params: GameRouteParams = {
        level: 'elementary',
        unit: 'unit-1',
        lesson: 'lesson-1',
        players: '2',
      }

      expect(params.level).toBe('elementary')
      expect(params.unit).toBe('unit-1')
      expect(params.lesson).toBe('lesson-1')
      expect(params.players).toBe('2')
    })
  })
})
