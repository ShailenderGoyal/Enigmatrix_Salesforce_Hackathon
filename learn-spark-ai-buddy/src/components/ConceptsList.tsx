
import React from 'react';
import { useLearning } from '@/contexts/LearningContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ConceptsList: React.FC = () => {
  const { currentModule, activeSubtopicId } = useLearning();

  if (!currentModule || !activeSubtopicId) {
    return null;
  }

  const activeSubtopic = currentModule.subtopics.find(
    (subtopic) => subtopic.id === activeSubtopicId
  );

  if (!activeSubtopic) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Key Concepts</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {activeSubtopic.concepts.map((concept, index) => (
            <React.Fragment key={index}>
              <li className="py-1 text-sm">{concept}</li>
              {index < activeSubtopic.concepts.length - 1 && (
                <Separator className="my-1" />
              )}
            </React.Fragment>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ConceptsList;
