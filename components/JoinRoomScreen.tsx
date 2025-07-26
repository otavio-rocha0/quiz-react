
import React, { useState, useRef } from 'react';
import { LoaderIcon, ArrowLeftIcon } from './icons';

interface JoinRoomScreenProps {
    onJoin: (pin: string) => void;
    onBack: () => void;
    error: string | null;
    loading: boolean;
}

const PIN_LENGTH = 6;

const JoinRoomScreen: React.FC<JoinRoomScreenProps> = ({ onJoin, onBack, error, loading }) => {
    const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pinString = pin.join('');
        if (pinString.length === PIN_LENGTH && !loading) {
            onJoin(pinString);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        const newPin = [...pin];

        // Only allow a single digit
        newPin[index] = value.slice(-1).replace(/[^0-9]/g, '');
        setPin(newPin);
        
        // Move to next input if a digit was entered
        if (value && index < PIN_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, PIN_LENGTH);
        if (pasteData) {
            const newPin = Array(PIN_LENGTH).fill('');
            for (let i = 0; i < pasteData.length; i++) {
                newPin[i] = pasteData[i];
            }
            setPin(newPin);
            const focusIndex = Math.min(pasteData.length, PIN_LENGTH - 1);
            inputRefs.current[focusIndex]?.focus();
        }
    };


    return (
        <div className="text-center bg-black/30 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl animate-fade-in w-full max-w-lg mx-auto relative">
            <button
                onClick={onBack}
                className="absolute top-4 left-4 text-indigo-300 hover:text-white transition p-2 rounded-full hover:bg-white/10"
                disabled={loading}
                aria-label="Voltar"
            >
                <ArrowLeftIcon className="w-6 h-6"/>
            </button>
            <h1 className="text-4xl font-black text-white drop-shadow-lg mb-6">Entrar em uma Sala</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex justify-center gap-2" onPaste={handlePaste}>
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputRefs.current[index] = el; }}
                            type="tel"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-14 h-16 text-center text-4xl font-bold text-white bg-black/30 rounded-lg border-2 border-white/20 focus:border-green-500 focus:ring-0 transition"
                            disabled={loading}
                            maxLength={1}
                            autoComplete="off"
                        />
                    ))}
                </div>
                <button
                    type="submit"
                    className="w-full py-4 text-xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed transition-transform transform hover:scale-105 flex justify-center items-center gap-3"
                    disabled={loading || pin.join('').length !== PIN_LENGTH}
                >
                     {loading && <LoaderIcon className="w-6 h-6" />}
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
             {error && <p className="mt-6 text-red-300 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </div>
    );
};

export default JoinRoomScreen;