import React, { useEffect, useState } from 'react';
import FlashcardReview from '../components/FlashcardReview/FlashcardReview';
import { useNavigate } from 'react-router-dom';

function ReviewFlashcardPage() {
  const navigate = useNavigate();
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const handleModuleSelect = (moduleId) => {
    setSelectedModuleId(moduleId);
    navigate(`/study-modules/${moduleId}`);
  };

  useEffect(() => {
    if (selectedModuleId) {
      setSelectedModuleId(selectedModuleId);
    }
  }, [selectedModuleId, navigate]);

  return <FlashcardReview />;
}

export default ReviewFlashcardPage;