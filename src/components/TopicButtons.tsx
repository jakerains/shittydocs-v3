import React from 'react';

interface Topic {
  topic: string;
  prompt: string;
}

interface TopicButtonsProps {
  topics: Topic[];
  onTopicClick: (topic: Topic) => void;
}

export function TopicButtons({ topics, onTopicClick }: TopicButtonsProps) {
  return (
    <div className="w-full lg:w-[800px] mb-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {topics.map((topic) => (
          <button
            key={topic.topic}
            onClick={() => onTopicClick(topic)}
            className="px-4 py-2 bg-[#3c1f10]/80 rounded-full text-sm text-amber-200/90
                     hover:bg-[#3c1f10] hover:text-amber-200 transition-all duration-200
                     border border-amber-900/20 shadow-inner
                     animate-fadeIn opacity-0 will-change-transform"
          >
            {topic.topic}
          </button>
        ))}
      </div>
    </div>
  );
}