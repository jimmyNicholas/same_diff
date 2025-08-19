'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

const AdminActivities = () => {
  const [showActivityForm, setShowActivityForm] = useState(false);

  const handleCreateActivity = () => {
    setShowActivityForm(true);
  };

  const handleCancelActivity = () => {
    setShowActivityForm(false);
  };

  const ActivityForm = ({ onCancel }: { onCancel: () => void }) => {
    return (
      <div>
        <h1>Activity Form</h1>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    );
  };

  if (showActivityForm) {
    return (
      <ActivityForm
        onCancel={handleCancelActivity}
        //onSave={handleSaveLesson}
      />
    );
  }

  return (
    <div>
      <Button onClick={handleCreateActivity}>Create New Activity</Button>
      <div className="h-100 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 border-2 border-gray-200 rounded-lg mt-4">
        <h1>Activities List</h1>
      </div>
    </div>
  );
};

export default AdminActivities;