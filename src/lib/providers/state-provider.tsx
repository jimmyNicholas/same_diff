"use client"

import { Provider } from 'react-redux'
import { store } from '@/store'
import { useEffect, useState } from 'react'
import { localStorageUtils } from '@/lib/storage/localStorage'
import { addWord } from '@/store/slices/vocabularySlice'
import { VocabularyWordType } from '../types'

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Load data from localStorage after hydration
    const savedWords = localStorageUtils.load('vocabulary_words', [])
    
    // Dispatch actions to restore the state
    savedWords.forEach((word: VocabularyWordType) => {
      store.dispatch(addWord(word))
    })
    
    setIsHydrated(true)
  }, [])

  // Subscribe to store changes and save to localStorage
  useEffect(() => {
    if (!isHydrated) return

    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      localStorageUtils.save('vocabulary_words', state.vocabulary.words)
    })

    return unsubscribe
  }, [isHydrated])

  return <Provider store={store}>{children}</Provider>
}