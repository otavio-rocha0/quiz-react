
import React from 'react';
import { PlusCircleIcon, LogInIcon } from './icons';

interface HomeScreenProps {
    onNavigateToCreate: () => void;
    onNavigateToJoin: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToCreate, onNavigateToJoin }) => {
    return (
        <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full py-12">
            <h1 className="text-6xl md:text-8xl font-black text-gradient drop-shadow-lg mb-4 animate-float">Tavin Quiz</h1>
            <p className="text-xl text-indigo-200 mb-12 max-w-2xl">Crie seu próprio quiz ou junte-se a um amigo!</p>
            <div className="flex flex-col md:flex-row gap-6">
                <button
                    onClick={onNavigateToCreate}
                    className="w-72 py-4 px-8 text-2xl font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                    <PlusCircleIcon className="w-8 h-8"/>
                    Criar Sala
                </button>
                <button
                    onClick={onNavigateToJoin}
                    className="w-72 py-4 px-8 text-2xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                >
                    <LogInIcon className="w-8 h-8"/>
                    Entrar na Sala
                </button>
            </div>
            <div className="absolute bottom-4 text-center w-full text-indigo-300/50">
                Criado por TAVIN
            </div>
        </div>
    );
};

export default HomeScreen;
