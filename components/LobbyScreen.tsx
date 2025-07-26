
import React, { useState } from 'react';
import { Player, Character } from '../types';
import CharacterCreator from './CharacterCreator';
import PlayerAvatar from './PlayerAvatar';
import { CopyIcon, ArrowLeftIcon } from './icons';

interface LobbyScreenProps {
    gamePin: string;
    players: Player[];
    onAddPlayer: (name: string, character: Character) => boolean;
    onStartGame: () => void;
    onBack: () => void;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ gamePin, players, onAddPlayer, onStartGame, onBack }) => {
    const [nickname, setNickname] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (nickname.trim()) {
             if (players.some(p => p.name === nickname.trim())) {
                alert('This name is already taken. Please choose another one.');
                return;
            }
            setIsCreating(true);
        }
    };
    
    const handleSaveCharacter = (character: Character) => {
        const success = onAddPlayer(nickname.trim(), character);
        if (success) {
            setIsCreating(false);
            setNickname('');
        }
    };
    
    const handleCancelCharacter = () => {
        setIsCreating(false);
    };

    const copyGamePin = () => {
        navigator.clipboard.writeText(gamePin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in relative pt-16">
             <button
                onClick={onBack}
                className="absolute top-4 left-4 text-indigo-300 hover:text-white transition p-2 rounded-full hover:bg-white/10"
                aria-label="Voltar e cancelar sala"
            >
                <ArrowLeftIcon className="w-8 h-8"/>
            </button>
            {isCreating && (
                <CharacterCreator 
                    playerName={nickname}
                    onSave={handleSaveCharacter}
                    onCancel={handleCancelCharacter}
                />
            )}
            
            <div className="text-center mb-8">
                <p className="text-2xl text-indigo-200">Convide jogadores com o PIN:</p>
                <div 
                    className="inline-flex items-center gap-4 mt-2 p-2 pr-4 bg-black/30 border border-white/20 rounded-lg cursor-pointer group"
                    onClick={copyGamePin}
                >
                    <h2 className="text-6xl md:text-8xl font-black tracking-[0.2em] text-white drop-shadow-xl">{gamePin}</h2>
                    <div className="relative">
                        <CopyIcon className="w-8 h-8 text-indigo-200 group-hover:text-white transition-colors"/>
                        {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-2 py-1 text-xs rounded-md">Copiado!</span>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                    <h3 className="text-3xl font-bold mb-4">Entrar no Jogo</h3>
                    <form onSubmit={handleJoin} className="flex gap-2">
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Digite seu apelido"
                            className="flex-grow p-3 text-lg text-white bg-black/30 rounded-lg border-2 border-white/20 focus:border-green-500 focus:ring-0 transition placeholder:text-gray-400"
                            maxLength={12}
                        />
                        <button type="submit" className="px-6 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:bg-gray-500" disabled={!nickname.trim()}>Entrar</button>
                    </form>
                </div>

                <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                    <h3 className="text-3xl font-bold mb-4">Jogadores na Sala ({players.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 min-h-[7rem]">
                        {players.length > 0 ? (
                            players.map(p => (
                                <div key={p.name} className="flex flex-col items-center justify-center gap-2 p-2 bg-white/10 rounded-lg font-semibold truncate animate-fade-in">
                                    <PlayerAvatar character={p.character} className="w-12 h-12 flex-shrink-0" />
                                    <span className="truncate text-sm">{p.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex items-center justify-center">
                                <p className="text-indigo-200 self-center">Aguardando jogadores...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button 
                    onClick={onStartGame} 
                    className={`px-20 py-5 text-3xl font-black text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 disabled:bg-gray-600/70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 ${players.length > 0 ? 'animate-pulse' : ''}`}
                    disabled={players.length === 0}
                >
                    Começar Jogo
                </button>
            </div>
        </div>
    );
};

export default LobbyScreen;
