
import React, { useState, useEffect, useMemo } from 'react';
import { Question } from '../types';
import { TriangleIcon, DiamondIcon, CircleIcon, SquareIcon } from './icons';

interface QuestionScreenProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    onAnswer: (answerIndex: number, timeLeft: number) => void;
}

const answerOptions = [
    { icon: TriangleIcon, color: 'from-red-500 to-red-700', hover: 'hover:from-red-600 hover:to-red-800' },
    { icon: DiamondIcon, color: 'from-blue-500 to-blue-700', hover: 'hover:from-blue-600 hover:to-blue-800' },
    { icon: CircleIcon, color: 'from-yellow-400 to-yellow-600', hover: 'hover:from-yellow-500 hover:to-yellow-700' },
    { icon: SquareIcon, color: 'from-green-500 to-green-700', hover: 'hover:from-green-600 hover:to-green-800' },
];

const RadialTimer: React.FC<{ timeLeft: number; timeLimit: number }> = ({ timeLeft, timeLimit }) => {
    const percentage = (timeLeft / timeLimit) * 100;
    const circumference = 2 * Math.PI * 45; // 2 * pi * r
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-white/10"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                <circle
                    className="text-purple-500 drop-shadow-lg"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold">{timeLeft}</span>
            </div>
        </div>
    );
};


const QuestionScreen: React.FC<QuestionScreenProps> = ({ question, questionNumber, totalQuestions, onAnswer }) => {
    const [timeLeft, setTimeLeft] = useState(question.timeLimit);
    const [hasAnswered, setHasAnswered] = useState(false);

    const shuffledAnswers = useMemo(() => {
        return [...question.answers].map((a, i) => ({...a, originalIndex: i})).sort(() => Math.random() - 0.5);
    }, [question]);


    useEffect(() => {
        setTimeLeft(question.timeLimit);
        setHasAnswered(false);
    }, [question]);

    useEffect(() => {
        if (hasAnswered) return;
        if (timeLeft <= 0) {
            setHasAnswered(true);
            onAnswer(-1, 0); // -1 indicates timeout
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onAnswer, hasAnswered]);

    const handleAnswerClick = (originalIndex: number) => {
        if (hasAnswered) return;
        setHasAnswered(true);
        onAnswer(originalIndex, timeLeft);
    };

    return (
        <div className="flex flex-col h-full w-full p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold bg-black/20 px-4 py-2 rounded-lg">{questionNumber} de {totalQuestions}</span>
                <RadialTimer timeLeft={timeLeft} timeLimit={question.timeLimit} />
            </div>

            <div className="flex-grow flex items-center justify-center my-4 md:my-8">
                <h2 className="text-3xl md:text-5xl font-bold text-center bg-black/30 backdrop-blur-xl border border-white/20 p-6 md:p-12 rounded-2xl shadow-xl">
                    {question.question}
                </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {shuffledAnswers.map((answer, i) => {
                    const { icon: Icon, color, hover } = answerOptions[i];
                    return (
                        <button
                            key={answer.text}
                            onClick={() => handleAnswerClick(answer.originalIndex)}
                            disabled={hasAnswered}
                            className={`flex items-center p-4 rounded-lg text-white font-bold text-xl md:text-2xl transition-all transform hover:scale-105 bg-gradient-to-br ${color} ${hover} shadow-lg disabled:opacity-50 disabled:transform-none`}
                        >
                            <Icon className="w-10 h-10 md:w-12 md:h-12 mr-4 flex-shrink-0" />
                            <span className="text-left">{answer.text}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionScreen;
