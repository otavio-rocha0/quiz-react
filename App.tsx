
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Question, Player, Character } from './types';
import { generateQuiz } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import LobbyScreen from './components/LobbyScreen';
import QuestionScreen from './components/QuestionScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import PodiumScreen from './components/PodiumScreen';
import HomeScreen from './components/HomeScreen';
import JoinRoomScreen from './components/JoinRoomScreen';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('HOME');
    const [quiz, setQuiz] = useState<Question[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [previousPlayers, setPreviousPlayers] = useState<Player[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [gamePin, setGamePin] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastAnswers, setLastAnswers] = useState<Map<string, { correct: boolean, score: number }>>(new Map());

    const handleCreateQuiz = useCallback(async (topic: string, numQuestions: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const newQuiz = await generateQuiz(topic, numQuestions);
            if (newQuiz && newQuiz.length > 0) {
                setQuiz(newQuiz);
                setGamePin(Math.floor(100000 + Math.random() * 900000).toString());
                setGameState('LOBBY');
            } else {
                setError('Failed to generate a quiz. The topic might be too specific or the response was empty. Please try another topic.');
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while creating the quiz.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAddPlayer = useCallback((name: string, character: Character): boolean => {
        if (players.some(p => p.name === name)) {
            alert('Player name already taken!');
            return false;
        }
        setPlayers(prev => [...prev, { name, score: 0, character }]);
        return true;
    }, [players]);
    
    const handleJoinRoom = useCallback((pin: string) => {
        setIsLoading(true);
        setError(null);
        // This is a mock verification. In a real app, this would be an API call.
        setTimeout(() => {
            // Since we don't have a central server, we can't truly "join" another
            // person's room. We'll simulate a failure for any PIN that doesn't
            // match one created in the current session.
            if (gamePin && pin === gamePin) {
                setGameState('LOBBY');
            } else {
                setError('Invalid Game PIN. Please check the code and try again.');
            }
            setIsLoading(false);
        }, 500);
    }, [gamePin]);

    const handleStartGame = useCallback(() => {
        if (players.length > 0) {
            setCurrentQuestionIndex(0);
            setGameState('QUESTION');
            setPreviousPlayers([]); // Reset for the first round
        } else {
            alert('At least one player must join before starting!');
        }
    }, [players.length]);

    const handleAnswer = useCallback((answerIndex: number, timeLeft: number) => {
        const currentQuestion = quiz[currentQuestionIndex];
        const isCorrect = answerIndex >= 0 ? currentQuestion.answers[answerIndex].isCorrect : false;
        // Simplified dummy player logic for single-player answering
        const score = isCorrect ? Math.round(500 + (timeLeft / currentQuestion.timeLimit) * 500) : 0;
        
        const newLastAnswers = new Map<string, { correct: boolean, score: number }>();
        
        setPreviousPlayers([...players].sort((a,b) => b.score - a.score));

        const updatedPlayers = players.map(player => {
             // In a real multiplayer game, you'd identify the specific player answering.
             // Here, we'll apply the score to all players for demonstration.
            const updatedScore = player.score + score;
            newLastAnswers.set(player.name, { correct: isCorrect, score });
            return { ...player, score: updatedScore };
        });
        
        setPlayers(updatedPlayers);
        setLastAnswers(newLastAnswers);
        setGameState('LEADERBOARD');
    }, [quiz, currentQuestionIndex, players]);

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setGameState('QUESTION');
        } else {
            setGameState('PODIUM');
        }
    }, [currentQuestionIndex, quiz.length]);

    const handleResetAndGoHome = useCallback(() => {
        setGameState('HOME');
        setQuiz([]);
        setPlayers([]);
        setPreviousPlayers([]);
        setCurrentQuestionIndex(0);
        setGamePin('');
        setError(null);
        setLastAnswers(new Map());
    }, []);
    
    useEffect(() => {
        if (gameState === 'LEADERBOARD') {
            const timer = setTimeout(() => {
                handleNextQuestion();
            }, 8000); // 8 seconds on leaderboard
            return () => clearTimeout(timer);
        }
    }, [gameState, handleNextQuestion]);


    const renderScreen = () => {
        switch (gameState) {
            case 'HOME':
                return <HomeScreen 
                    onNavigateToCreate={() => setGameState('SETUP')}
                    onNavigateToJoin={() => { setError(null); setGameState('JOIN_ROOM'); }}
                />;
            case 'JOIN_ROOM':
                return <JoinRoomScreen 
                    onJoin={handleJoinRoom}
                    onBack={() => setGameState('HOME')}
                    error={error}
                    loading={isLoading}
                />;
            case 'SETUP':
                return <SetupScreen onCreateQuiz={handleCreateQuiz} loading={isLoading} error={error} onBack={() => setGameState('HOME')} />;
            case 'LOBBY':
                return <LobbyScreen gamePin={gamePin} players={players} onAddPlayer={handleAddPlayer} onStartGame={handleStartGame} onBack={handleResetAndGoHome} />;
            case 'QUESTION':
                if (quiz[currentQuestionIndex]) {
                    return <QuestionScreen
                        question={quiz[currentQuestionIndex]}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={quiz.length}
                        onAnswer={handleAnswer}
                    />;
                }
                return null;
            case 'LEADERBOARD':
                return <LeaderboardScreen players={players} previousPlayers={previousPlayers} lastAnswers={lastAnswers} />;
            case 'PODIUM':
                return <PodiumScreen players={players} onPlayAgain={handleResetAndGoHome} />;
            default:
                return <div>Game state is unknown.</div>;
        }
    };

    return (
        <main className="min-h-screen text-white flex flex-col items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
            <div className="w-full max-w-5xl mx-auto">
                {renderScreen()}
            </div>
        </main>
    );
};

export default App;
