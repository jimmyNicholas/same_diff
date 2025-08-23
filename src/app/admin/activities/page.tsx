"use client";

import VocabRow from "@/components/vocab-row";
import { VocabularyProvider } from "@/lib/contexts/VocabularyContext";

const AdminActivities = () => {
  
  return (
    <div>
      <div className="grid grid-flow-row gap-2 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 border-2 border-gray-200 rounded-lg mt-4">
        <VocabularyProvider>
          <VocabRows />
        </VocabularyProvider>
      </div>
    </div>
  );
};

export default AdminActivities;


// temp container for the vocab rows will move to new file soon
import { useVocabulary } from "@/lib/contexts/VocabularyContext";

const VocabRows = () => {
  const { vocabWords } = useVocabulary();
  return (
    <div>
      {vocabWords.map((vocabWord) => (
        <VocabRow key={vocabWord.id} vocabulary={vocabWord} />
      ))}
    </div>
  );
};