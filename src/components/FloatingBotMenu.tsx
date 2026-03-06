import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import gerabotIcon from '../assets/gerabot.png';
import randombotIcon from '../assets/randombot.png';

const FloatingBotMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const bots = [
        {
            name: 'GeraBot',
            icon: gerabotIcon,
            link: 'https://t.me/RGeraBot',
            description: 'Gerador de Relatos'
        },
        {
            name: 'RandomBot',
            icon: randombotIcon,
            link: 'https://t.me/Relatozbot',
            description: 'Relatos Aleatórios'
        }
    ];

    return (
        <div className="floating-bot-container">
            <div className={`bot-options ${isOpen ? 'show' : ''}`}>
                {bots.map((bot, index) => (
                    <a
                        key={index}
                        href={bot.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bot-option-item glass-card"
                        style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                        <div className="bot-icon-wrapper">
                            <img src={bot.icon} alt={bot.name} />
                        </div>
                        <div className="bot-info">
                            <span className="bot-name">{bot.name}</span>
                            <span className="bot-desc">{bot.description}</span>
                        </div>
                    </a>
                ))}
            </div>

            <button
                className={`bot-main-button glass-card ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Abrir menu de bots"
            >
                {isOpen ? <X size={24} /> : <Bot size={24} />}
                {!isOpen && <span className="bot-label">Bots</span>}
            </button>
        </div>
    );
};

export default FloatingBotMenu;
