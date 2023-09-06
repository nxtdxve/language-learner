import React, { useState } from 'react';
import sentences from './data';

function LearningTool() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [streak, setStreak] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [askedIndices, setAskedIndices] = useState([0]); // Starts with the first question
    const [showRepeatOptions, setShowRepeatOptions] = useState(false);

    const currentSentence = sentences[currentIndex];

    const getRandomIndex = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * sentences.length);
        } while (askedIndices.includes(randomIndex));
        
        setAskedIndices(prevIndices => [...prevIndices, randomIndex]);
        return randomIndex;
    };
    
    const handleRepeatAll = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * sentences.length);
        } while (newIndex === currentIndex);

        setAskedIndices([newIndex]);
        setCurrentIndex(newIndex);
        setShowRepeatOptions(false);
    };

    const checkAnswer = () => {
        if (userInput === currentSentence.blank) {
            setFeedback({ message: "Richtig!", type: "correct" });
            setStreak(prevStreak => prevStreak + 1);

            setIsExiting(true);
            setTimeout(() => {
                setIsExiting(false);
                if (askedIndices.length === sentences.length) {
                    setShowRepeatOptions(true);
                } else {
                    setCurrentIndex(getRandomIndex());
                }
                setUserInput("");
                setFeedback(null);
            }, 300);
        } else {
            setFeedback({ message: `Falsch! Die richtige Antwort ist: ${currentSentence.blank}`, type: "incorrect" });
            setStreak(0);
        }
    };

    const [beforeBlank, afterBlank] = currentSentence.translated.split("______");

    return (
        <>
        <div className="streak-counter">Aktueller Streak: {streak}</div>
        <div className="card-container">
            {showRepeatOptions ? (
                <div className="repeat-options">
                    <p>Was möchten Sie tun?</p>
                    <button onClick={handleRepeatAll}>Alles wiederholen</button>
                </div>
            ) : (
                <div className={isExiting ? 'card exit' : 'card'}>
                    <p>{currentSentence.original}</p>
                    <div className="sentence-container">
                        <span>{beforeBlank}</span>
                        <input 
                            type="text" 
                            value={userInput} 
                            onChange={e => setUserInput(e.target.value)} 
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    checkAnswer();
                                }
                            }}
                            placeholder="Tippe hier"
                            className="input-blank"
                        />
                        <span>{afterBlank}</span>
                    </div>
                    <button onClick={checkAnswer}>Überprüfen</button>
                </div>
            )}
            {feedback && (
                <p className={feedback.type === "correct" ? "feedback correct-feedback" : "feedback incorrect-feedback"}>
                    {feedback.message}
                </p>
            )}
        </div>
        </>
    );
}

export default LearningTool;
