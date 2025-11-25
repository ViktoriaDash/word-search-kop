import { useState, useEffect } from "react";

const SETTINGS_KEY_PREFIX = "gameSettings_";
const COMPLETED_LEVELS_KEY_PREFIX = "completedLevels_";

export const useGameSettings = (userId) => {
    const SETTINGS_KEY = SETTINGS_KEY_PREFIX + userId;
    const COMPLETED_LEVELS_KEY = COMPLETED_LEVELS_KEY_PREFIX + userId;

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem(SETTINGS_KEY); 
        if (!saved) {
            return { difficulty: "easy", boardSize: 5 };
        }
        
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.difficulty && parsed.boardSize) {
                return parsed;
            }
            return { difficulty: "easy", boardSize: 5 };
        } catch (e) {
            console.error("Помилка завантаження налаштувань:", e);
            return { difficulty: "easy", boardSize: 5 };
        }
    });

    const [completedLevels, setCompletedLevels] = useState(() => {
        const saved = localStorage.getItem(COMPLETED_LEVELS_KEY); 
        if (!saved) {
            return ["easy"];
        }
        
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
            return ["easy"];
        } catch (e) {
            console.error("Помилка завантаження пройдених рівнів:", e);
            return ["easy"];
        }
    });

    const updateSettings = (newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const completeLevel = (level) => {
        setCompletedLevels(prev => {
            const newLevels = [...prev];

            if (!newLevels.includes(level)) {
                newLevels.push(level);
            }
            
            const levels = ["easy", "medium", "hard"];
            const currentIndex = levels.indexOf(level);
            if (currentIndex < levels.length - 1) {
                const nextLevel = levels[currentIndex + 1];
                let allPreviousCompleted = true;
                for (let i = 0; i <= currentIndex; i++) {
                    if (!newLevels.includes(levels[i])) {
                        allPreviousCompleted = false;
                        break;
                    }
                }
                
                if (allPreviousCompleted && !newLevels.includes(nextLevel)) {
                    newLevels.push(nextLevel);
                    console.log("🔓 Розблоковано рівень:", nextLevel);
                }
            }
            
            console.log("💾 Зберігаємо пройдені рівні:", newLevels);
            localStorage.setItem(COMPLETED_LEVELS_KEY, JSON.stringify(newLevels));
            return newLevels;
        });
    };
    
    const resetProgress = () => {
        setCompletedLevels(["easy"]);
        localStorage.setItem(COMPLETED_LEVELS_KEY, JSON.stringify(["easy"]));
        setSettings({ difficulty: "easy", boardSize: 5 });
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ difficulty: "easy", boardSize: 5 }));
        console.log(`❌ Прогрес користувача ${userId} скинуто до "Легкий"!`);
    };

    useEffect(() => {
        if (!userId) {
            console.error("useGameSettings викликано без userId!");
            return;
        }
        console.log(`⚙️ Поточні налаштування для ${userId}:`, settings);
        console.log(`📊 Пройдені рівні для ${userId}:`, completedLevels);
    }, [settings, completedLevels, userId]);

    return { 
        settings, 
        updateSettings, 
        completedLevels, 
        completeLevel,
        resetProgress 
    };
};