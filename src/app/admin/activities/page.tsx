"use client";

import VocabRowContainer from "@/components/vocab-row";
import useVocabulary from "@/lib/hooks/useVocabulary";

const AdminActivities = () => {
  const { words, manageVocabulary } = useVocabulary();
  return (
    <div>
      <div className="grid grid-flow-row gap-2 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 border-2 border-accent-foreground rounded-lg">
          <VocabRowContainer vocabularyWords={words} manageVocabulary={manageVocabulary} />
      </div>
    </div>
  );
};

export default AdminActivities;
