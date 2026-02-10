import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type ThemeType = 'default' | 'mystic' | 'tech' | 'orkut' | 'nature' | 'ocean';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    bgImage: string | null;
    setBgImage: (image: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<ThemeType>(() => {
        return (localStorage.getItem('theme') as ThemeType) || 'default';
    });
    const [bgImage, setBgImageState] = useState<string | null>(() => {
        return localStorage.getItem('bgImage');
    });

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const setBgImage = (image: string | null) => {
        setBgImageState(image);
        if (image) {
            localStorage.setItem('bgImage', image);
        } else {
            localStorage.removeItem('bgImage');
        }
    };

    useEffect(() => {
        const body = document.body;
        // Remove all possible theme classes
        body.classList.remove('theme-mystic', 'theme-tech', 'theme-orkut', 'theme-nature', 'theme-ocean');

        if (theme !== 'default') {
            body.classList.add(`theme-${theme}`);
        }

        // Apply background image if exists
        if (bgImage) {
            body.style.backgroundImage = `url(${bgImage}), var(--bg-gradient)`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundAttachment = 'fixed';
            body.style.backgroundPosition = 'center';
        } else {
            body.style.backgroundImage = '';
            body.style.backgroundSize = '';
            body.style.backgroundAttachment = '';
            body.style.backgroundPosition = '';
        }
    }, [theme, bgImage]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, bgImage, setBgImage }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
