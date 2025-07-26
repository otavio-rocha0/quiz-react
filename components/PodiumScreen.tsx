
import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import PlayerAvatar from './PlayerAvatar';
import Confetti from './Confetti';

interface PodiumScreenProps {
    players: Player[];
    onPlayAgain: () => void;
}

const PodiumScreen: React.FC<PodiumScreenProps> = ({ players, onPlayAgain }) => {
    const [revealed, setRevealed] = useState({ third: false, second: false, first: false });
    const [showConfetti, setShowConfetti] = useState(false);
    const [showElements, setShowElements] = useState({ title: false, button: false });

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const topThree = sortedPlayers.slice(0, 3);

    const podiumData = {
        second: { player: topThree.length > 1 ? topThree[1] : null, height: 'h-48', gradient: 'from-slate-400 to-slate-500', placement: 2, order: 2, shadow: 'shadow-slate-300/30' },
        first: { player: topThree.length > 0 ? topThree[0] : null, height: 'h-64', gradient: 'from-yellow-400 to-amber-500', placement: 1, order: 3, shadow: 'shadow-yellow-300/30' },
        third: { player: topThree.length > 2 ? topThree[2] : null, height: 'h-32', gradient: 'from-orange-400 to-amber-600', placement: 3, order: 1, shadow: 'shadow-orange-300/30' },
    };

    useEffect(() => {
        const timers = [
            setTimeout(() => setShowElements(s => ({ ...s, title: true })), 200),
            setTimeout(() => setRevealed(r => ({ ...r, third: true })), 800),
            setTimeout(() => setRevealed(r => ({ ...r, second: true })), 1600),
            setTimeout(() => {
                setRevealed(r => ({ ...r, first: true }));
                setShowConfetti(true);
            }, 2400),
            setTimeout(() => setShowElements(s => ({ ...s, button: true })), 3500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const renderPodiumSlot = (key: 'second' | 'first' | 'third') => {
        const { player, height, gradient, placement, shadow } = podiumData[key];
        const isRevealed = revealed[key];
        const isFirstPlace = key === 'first';

        return (
            <div className={`w-1/3 flex flex-col items-center justify-end transition-opacity duration-500 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
                {player && (
                    <div className={`relative transition-transform duration-500 ${isRevealed ? 'translate-y-0' : 'translate-y-10'}`}>
                        <PlayerAvatar character={player.character} className={`w-28 h-28 mb-4 drop-shadow-xl ${isRevealed ? 'animate-land-on-podium' : 'opacity-0'}`} style={{ animationDelay: `${isRevealed ? '0.2s' : '0s'}` }} />
                        <div className={`text-center mb-2 ${isRevealed ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${isRevealed ? '0.4s' : '0s'}` }}>
                            <div className="text-3xl md:text-4xl font-bold text-white truncate px-2 drop-shadow-md">{player.name}</div>
                            <div className="text-xl md:text-2xl text-gray-300">{player.score} pts</div>
                        </div>
                    </div>
                )}
                <div className={`w-full ${height} bg-gradient-to-b ${gradient} rounded-t-lg flex items-center justify-center text-7xl font-black text-white/80 shadow-2xl ${shadow} relative ${isRevealed ? 'animate-slide-up-bounce' : 'opacity-0'} ${isFirstPlace && isRevealed ? 'animate-pulse-glow' : ''}`}>
                    <span className="drop-shadow-lg">{placement}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-4">
            <Confetti active={showConfetti} />
            <h1 className={`text-5xl md:text-7xl font-black mb-8 drop-shadow-2xl transition-all duration-500 text-gradient ${showElements.title ? 'opacity-100 translate-y-0 animate-title-pop-in' : 'opacity-0 -translate-y-10'}`}>
                Resultados Finais!
            </h1>
            <div className="flex items-end justify-center gap-2 w-full max-w-3xl h-96">
                {renderPodiumSlot('second')}
                {renderPodiumSlot('first')}
                {renderPodiumSlot('third')}
            </div>
            
            <button 
                onClick={onPlayAgain} 
                className={`mt-16 px-12 py-4 text-2xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 duration-500 ${showElements.button ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                disabled={!showElements.button}
            >
                Jogar Novamente
            </button>
        </div>
    );
};

export default PodiumScreen;
