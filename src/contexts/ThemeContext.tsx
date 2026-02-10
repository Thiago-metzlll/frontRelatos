import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type ThemeType = 'default' | 'mystic' | 'tech';

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>('default');

    useEffect(() => {
        // Apply theme class to body
        const body = document.body;
        body.classList.remove('theme-mystic', 'theme-tech');
        if (theme !== 'default') {
            body.classList.add(`theme-${theme}`);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
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
