
import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { Player } from '../types';
import PlayerAvatar from './PlayerAvatar';
import { CrownIcon, ArrowUpIcon, ArrowDownIcon } from './icons';

interface LeaderboardScreenProps {
    players: Player[];
    previousPlayers: Player[];
    lastAnswers: Map<string, { correct: boolean; score: number }>;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ players, previousPlayers, lastAnswers }) => {
    const sortedPlayers = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);
    
    const oldRanks = useMemo(() => {
        const ranks = new Map<string, number>();
        previousPlayers.forEach((p, i) => ranks.set(p.name, i));
        return ranks;
    }, [previousPlayers]);

    const playerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    useLayoutEffect(() => {
        const newPositions = new Map<string, DOMRect>();
        sortedPlayers.forEach(p => {
            const el = playerRefs.current.get(p.name);
            if (el) newPositions.set(p.name, el.getBoundingClientRect());
        });

        newPositions.forEach((newPos, name) => {
            const el = playerRefs.current.get(name);
            if (el) {
                const oldPos = JSON.parse(el.dataset.oldpos || '{}');
                if (oldPos.y) {
                    const deltaY = oldPos.y - newPos.y;
                    if (deltaY !== 0) {
                        requestAnimationFrame(() => {
                            el.style.transform = `translateY(${deltaY}px)`;
                            el.style.transition = 'transform 0s';
                            requestAnimationFrame(() => {
                                el.style.transform = '';
                                el.style.transition = 'transform 0.5s ease-in-out';
                            });
                        });
                    }
                }
            }
        });

    }, [sortedPlayers]);

    const renderRankChange = (player: Player, newRank: number) => {
        if (!oldRanks.has(player.name) || previousPlayers.length === 0) return null;

        const oldRank = oldRanks.get(player.name)!;
        const rankChange = oldRank - newRank;

        if (rankChange > 0) {
            return <span className="flex items-center text-green-400"><ArrowUpIcon className="w-5 h-5" /> {rankChange}</span>;
        }
        if (rankChange < 0) {
            return <span className="flex items-center text-red-400"><ArrowDownIcon className="w-5 h-5" /> {Math.abs(rankChange)}</span>;
        }
        return <span className="w-5 h-5 text-gray-500">-</span>;
    };
    
    const getInitialPosition = (name: string) => {
        const oldRank = oldRanks.get(name);
        const oldPlayerEl = oldRank !== undefined ? playerRefs.current.get(previousPlayers[oldRank].name) : undefined;
        return oldPlayerEl ? JSON.stringify(oldPlayerEl.getBoundingClientRect()) : '{}';
    };

    return (
        <div className="flex flex-col items-center justify-center animate-fade-in">
            <h1 className="text-6xl font-black mb-8 drop-shadow-lg text-gradient">Placar</h1>
            <div className="w-full max-w-3xl bg-black/30 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl space-y-3">
                {sortedPlayers.map((player, index) => {
                    const lastAnswer = lastAnswers.get(player.name);
                    const scoreChange = lastAnswer?.score || 0;
                    
                    return (
                        <div
                            key={player.name}
                            ref={node => { if (node) playerRefs.current.set(player.name, node); }}
                            data-oldpos={getInitialPosition(player.name)}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${index === 0 ? 'bg-yellow-500/20 border-2 border-yellow-400' : 'bg-black/20'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold w-12 text-center text-indigo-200">{index + 1}</span>
                                <PlayerAvatar character={player.character} className="w-12 h-12" />
                                <span className="text-2xl font-semibold">{player.name}</span>
                                {index === 0 && <CrownIcon className="w-8 h-8 text-yellow-400" />}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-xl font-bold w-16 text-center">{renderRankChange(player, index)}</div>
                                <span className="text-2xl font-bold text-white w-24 text-right">{player.score}</span>
                                {lastAnswer && (
                                    <span className={`text-lg font-bold w-20 text-right animate-score-pop ${scoreChange > 0 ? 'text-green-300' : 'text-gray-400'}`}>
                                        {`+${scoreChange}`}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
             <div className="mt-8 w-full max-w-3xl">
                <p className="text-center text-xl text-indigo-200 mb-2">Próxima pergunta em...</p>
                <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full animate-[progress_8s_linear_forwards]"></div>
                </div>
             </div>
        </div>
    );
};

// Add keyframes to a global stylesheet or style tag if not already present
const keyframes = `
@keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
}
`;
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  console.warn("Could not insert keyframes rule, may already exist.", e);
}


export default LeaderboardScreen;