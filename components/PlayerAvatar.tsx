import React from 'react';
import { Character, AccessoryPosition } from '../types';
import { BASE_CHARACTER_MAP, ACCESSORY_MAP } from '../services/characterService';

interface PlayerAvatarProps {
    character: Character;
    className?: string;
    style?: React.CSSProperties;
}

const getAccessoryStyles = (position: AccessoryPosition): string => {
    switch (position) {
        case 'head':
            return 'w-full h-full absolute top-[-10%] left-0 transform-gpu scale-90';
        case 'eyes':
            return 'w-[85%] h-[85%] absolute top-[15%] left-[7.5%] transform-gpu';
        case 'face':
            return 'w-full h-full absolute top-[10%] left-0 transform-gpu';
        case 'overlay':
        default:
            return 'w-full h-full absolute top-0 left-0 transform-gpu';
    }
};

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ character, className, style }) => {
    const BaseComponent = BASE_CHARACTER_MAP[character.base]?.component || BASE_CHARACTER_MAP['polar_bear'].component;
    const accessoryAsset = character.accessory ? ACCESSORY_MAP[character.accessory] : null;

    const AccessoryComponent = accessoryAsset?.component;
    const accessoryPosition = accessoryAsset?.position ?? 'overlay';

    return (
        <div className={`relative ${className}`} style={style}>
            <BaseComponent className="w-full h-full" />
            {AccessoryComponent && <AccessoryComponent className={getAccessoryStyles(accessoryPosition)} />}
        </div>
    );
};

export default PlayerAvatar;
