
import React, { useState } from 'react';
import { LoaderIcon, ArrowLeftIcon } from './icons';

interface SetupScreenProps {
    onCreateQuiz: (topic: string, numQuestions: number) => void;
    loading: boolean;
    error: string | null;
    onBack: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onCreateQuiz, loading, error, onBack }) => {
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim() && numQuestions > 0 && !loading) {
            onCreateQuiz(topic, numQuestions);
        }
    };

    return (
        <div className="text-center bg-black/30 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl animate-fade-in max-w-2xl mx-auto relative">
            <button
                onClick={onBack}
                className="absolute top-4 left-4 text-indigo-300 hover:text-white transition p-2 rounded-full hover:bg-white/10"
                disabled={loading}
                aria-label="Voltar"
            >
                <ArrowLeftIcon className="w-6 h-6"/>
            </button>
            <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">Gemini Quiz Whiz</h1>
            <p className="text-xl text-indigo-200 mb-8">Crie um quiz sobre qualquer tópico em segundos!</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: 'Sistema Solar', 'História do Cinema'..."
                    className="w-full p-4 text-lg text-white bg-black/30 rounded-lg border-2 border-white/20 focus:border-purple-500 focus:ring-0 transition placeholder:text-gray-400"
                    disabled={loading}
                />
                <div className="flex flex-col items-center gap-4">
                    <label htmlFor="numQuestions" className="text-lg text-indigo-200">
                        Número de Perguntas: <span className="font-bold text-white text-xl">{numQuestions}</span>
                    </label>
                    <input
                        id="numQuestions"
                        type="range"
                        min="3"
                        max="15"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(Number(e.target.value))}
                        className="w-full max-w-sm h-3 bg-white/20 rounded-lg appearance-none cursor-pointer range-lg accent-purple-500"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-4 text-xl font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                    disabled={loading || !topic.trim()}
                >
                    {loading && <LoaderIcon className="w-6 h-6" />}
                    {loading ? 'Gerando Quiz...' : 'Criar Quiz'}
                </button>
            </form>
            {error && <p className="mt-6 text-red-300 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </div>
    );
};

export default SetupScreen;
