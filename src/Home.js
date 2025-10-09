import React, { useState, useEffect, useCallback } from 'react';

const Home = ({ onNavigateToWorkouts }) => {
    const [motivationalQuote, setMotivationalQuote] = useState({ text: 'Loading...', author: '' });
    const [workoutStreak] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

    const fetchMotivationalQuote = useCallback(async () => {
        try {
            const response = await fetch('https://api.quotable.io/random?tags=inspirational');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setMotivationalQuote({ text: data.content, author: data.author });
        } catch (error) {
            const fallbackQuotes = [
                { text: 'The only bad workout is the one that didn\'t happen.', author: 'Unknown' },
                { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
                { text: 'The body achieves what the mind believes.', author: 'Unknown' },
                { text: 'Don\'t limit your challenges. Challenge your limits.', author: 'Unknown' }
            ];
            const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            setMotivationalQuote(randomFallback);
        }
    }, []);

    useEffect(() => {
        fetchMotivationalQuote();
    }, [fetchMotivationalQuote]);

    useEffect(() => {
        if (showHelp) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [showHelp]);

    const getDaysInYear = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31);
        const total = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const passed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
        const remaining = total - passed;
        return { remaining, total, passed };
    };

    return (
        <div style={{
            maxWidth: 430,
            margin: '0 auto',
            background: '#F2F2F7',
            minHeight: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
            WebkitFontSmoothing: 'antialiased'
        }}>
            {/* Header */}
            <header style={{
                background: '#FFFFFF',
                padding: '48px 20px 24px',
                marginBottom: 20
            }}>
                <h1 style={{
                    color: '#000000',
                    fontSize: 34,
                    margin: 0,
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    marginBottom: 4
                }}>RevolveMe</h1>
                <div style={{
                    color: '#8E8E93',
                    fontSize: 13,
                    fontWeight: 400
                }}>by DinoTheDeveloper</div>
            </header>

            <div style={{ padding: '0 20px' }}>
                {/* Streak Badge */}
                {workoutStreak > 0 && (
                    <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #E5E5EA',
                        borderRadius: 12,
                        padding: '16px',
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                    }}>
                        <div style={{
                            fontSize: 28,
                            lineHeight: 1
                        }}>🔥</div>
                        <div>
                            <div style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: '#000000'
                            }}>{workoutStreak} Day Streak</div>
                            <div style={{
                                fontSize: 13,
                                color: '#8E8E93',
                                marginTop: 2
                            }}>Keep it going!</div>
                        </div>
                    </div>
                )}

                {/* Motivational Quote */}
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: 12,
                    padding: '20px',
                    marginBottom: 16
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12
                    }}>
                        <div style={{
                            fontSize: 13,
                            color: '#8E8E93',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>Daily Motivation</div>
                        <button
                            onClick={fetchMotivationalQuote}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#007AFF',
                                padding: '4px 8px',
                                fontSize: 15,
                                cursor: 'pointer',
                                fontWeight: 400
                            }}
                        >
                            Refresh
                        </button>
                    </div>

                    <div style={{
                        fontSize: 17,
                        color: '#000000',
                        lineHeight: 1.5,
                        marginBottom: 12
                    }}>
                        "{motivationalQuote.text}"
                    </div>

                    {motivationalQuote.author && (
                        <div style={{
                            fontSize: 15,
                            color: '#8E8E93',
                            textAlign: 'right'
                        }}>
                            — {motivationalQuote.author}
                        </div>
                    )}
                </div>

                {/* Year Progress */}
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: 12,
                    padding: '20px',
                    marginBottom: 16
                }}>
                    <h3 style={{
                        margin: '0 0 8px 0',
                        fontSize: 17,
                        color: '#000000',
                        fontWeight: 600
                    }}>
                        Year Progress
                    </h3>

                    <div style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: '#000000',
                        marginBottom: 4
                    }}>
                        {getDaysInYear().remaining} days left
                    </div>

                    <div style={{
                        fontSize: 15,
                        color: '#8E8E93',
                        marginBottom: 16
                    }}>
                        Make this year count
                    </div>

                    <div style={{
                        width: '100%',
                        height: 8,
                        background: '#E5E5EA',
                        borderRadius: 4,
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${(getDaysInYear().passed / getDaysInYear().total) * 100}%`,
                            height: '100%',
                            background: '#007AFF',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>

                {/* Action Buttons */}
                <button
                    onClick={onNavigateToWorkouts}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: '#007AFF',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 12,
                        cursor: 'pointer',
                        fontSize: 17,
                        fontWeight: 600,
                        marginBottom: 12,
                        transition: 'opacity 0.2s ease'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseUp={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    View Workouts
                </button>

                <button
                    onClick={() => setShowHelp(true)}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'transparent',
                        color: '#007AFF',
                        border: 'none',
                        borderRadius: 12,
                        cursor: 'pointer',
                        fontSize: 17,
                        fontWeight: 400,
                        transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    Help & Information
                </button>
            </div>

            {/* Help Modal */}
            {showHelp && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    zIndex: 100
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '12px 12px 0 0',
                        width: '100%',
                        maxWidth: 430,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '24px 20px 40px',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <div style={{
                            width: 36,
                            height: 5,
                            background: '#C6C6C8',
                            borderRadius: 3,
                            margin: '0 auto 24px'
                        }} />

                        <h2 style={{
                            margin: '0 0 8px 0',
                            fontSize: 28,
                            color: '#000000',
                            fontWeight: 700,
                            textAlign: 'center'
                        }}>
                            Welcome to RevolveMe
                        </h2>
                        <div style={{
                            fontSize: 15,
                            color: '#8E8E93',
                            marginBottom: 24,
                            textAlign: 'center'
                        }}>
                            For the boys, by the boys
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: 17,
                                color: '#000000',
                                fontWeight: 600
                            }}>
                                Best Experience
                            </h3>
                            <p style={{
                                fontSize: 15,
                                color: '#8E8E93',
                                margin: 0,
                                lineHeight: 1.5
                            }}>
                                This is a mobile-only web app. For the best experience,
                                tap the Share button in your browser and select
                                "Add to Home Screen" to use it like a native app.
                            </p>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: 17,
                                color: '#000000',
                                fontWeight: 600
                            }}>
                                Made with Love
                            </h3>
                            <p style={{
                                fontSize: 15,
                                color: '#8E8E93',
                                margin: 0,
                                lineHeight: 1.5
                            }}>
                                Built to keep us motivated and on track
                                with our fitness goals. We're in this together!
                            </p>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{
                                margin: '0 0 8px 0',
                                fontSize: 17,
                                color: '#000000',
                                fontWeight: 600
                            }}>
                                Workout Updates
                            </h3>
                            <p style={{
                                fontSize: 15,
                                color: '#8E8E93',
                                margin: 0,
                                lineHeight: 1.5
                            }}>
                                Workouts are updated every 1-2 months to keep things
                                fresh and maximize gains. Stay consistent!
                            </p>
                        </div>

                        <button
                            onClick={() => setShowHelp(false)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: '#007AFF',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 12,
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: 17
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;