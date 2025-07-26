
import React, { useState } from 'react';
import { Character } from '../types';
import PlayerAvatar from './PlayerAvatar';
import { BASE_CHARACTER_MAP } from '../services/characterService';

interface CharacterCreatorProps {
    playerName: string;
    onSave: (character: Character) => void;
    onCancel: () => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ playerName, onSave, onCancel }) => {
    const [selectedBase, setSelectedBase] = useState<string>('sun');

    const characterForPreview: Character = {
        base: selectedBase,
        accessory: null, // Accessories are disabled
    };
    
    const handleSave = () => {
        onSave({ base: selectedBase, accessory: null });
    };

    const baseCharacters = Object.entries(BASE_CHARACTER_MAP);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in" onClick={onCancel}>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl w-full max-w-lg m-4 flex flex-col text-gray-800" onClick={(e) => e.stopPropagation()}>
                
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Crie seu Avatar</h2>
                <p className="text-center text-gray-500 mb-4">Escolha um personagem para representar você, <span className="font-bold text-purple-700">{playerName}</span>!</p>

                {/* Live Preview */}
                <div className="w-full bg-gradient-to-br from-purple-200 to-indigo-200 rounded-xl p-4 flex items-center justify-center mb-4">
                    <PlayerAvatar character={characterForPreview} className="w-32 h-32" />
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-xl font-bold text-left text-gray-700 mb-3">Escolha seu Personagem</h3>
                  {/* Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 w-full h-56 overflow-y-auto pr-2 custom-scrollbar">
                      {baseCharacters.map(([id, { component: Component, name }]) => (
                           <button
                              key={id}
                              onClick={() => setSelectedBase(id)}
                              className={`p-2 rounded-lg transition-all transform focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 hover:scale-105 hover:bg-purple-100 ${selectedBase === id ? 'bg-purple-200 ring-4 ring-purple-400' : 'bg-gray-100'}`}
                              aria-label={`Select ${name}`}
                          >
                              <Component className="w-full h-auto aspect-square rounded-md" />
                          </button>
                      ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-6 w-full border-t pt-4">
                     <button onClick={onCancel} className="px-8 py-3 text-lg font-bold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
                     <button onClick={handleSave} className="px-8 py-3 text-lg font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Pronto</button>
                </div>
            </div>
        </div>
    );
};

export default CharacterCreator;