
import React from 'react';
import ClueCard from './ClueCard';
import AnswerOptions from './AnswerOptions';
import ScoreDisplay from './ScoreDisplay';
import FeedbackModal from './FeedbackModal';

const GameCard: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <ClueCard />
      <AnswerOptions />
      <ScoreDisplay />
      <FeedbackModal />
    </div>
  );
};

export default GameCard;
