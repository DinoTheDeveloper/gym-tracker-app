import React, { useState, useEffect, useCallback } from 'react';

const Home = ({ onNavigateToWorkouts }) => {
    const [motivationalQuote, setMotivationalQuote] = useState(() => {
        try {
            const saved = localStorage.getItem('motivationalQuote');
            return saved ? JSON.parse(saved) : { text: 'Loading...', author: '' };
        } catch {
            return { text: 'Loading...', author: '' };
        }
    });

    const [setLastQuoteFetch] = useState(() => {
        try {
            const saved = localStorage.getItem('lastQuoteFetch');
            return saved ? parseInt(saved) : null;
        } catch {
            return null;
        }
    });

    const [workoutStreak] = useState(() => {
        try {
            const saved = localStorage.getItem('workoutStreak');
            return saved ? parseInt(saved) : 0;
        } catch {
            return 0;
        }
    });

    const [showHelp, setShowHelp] = useState(false);

    const fetchMotivationalQuote = useCallback(async () => {
        try {
            console.log('Fetching new motivational quote...');
            const response = await fetch('https://api.quotable.io/random?tags=inspirational');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Quote fetched successfully:', data);

            const newQuote = {
                text: data.content,
                author: data.author
            };

            setMotivationalQuote(newQuote);
            const now = new Date().getTime();
            setLastQuoteFetch(now);

            localStorage.setItem('motivationalQuote', JSON.stringify(newQuote));
            localStorage.setItem('lastQuoteFetch', now.toString());

            console.log('Quote saved to localStorage');
        } catch (error) {
            console.error('Failed to fetch quote:', error);

            // Try to use stored quote if available
            const storedQuote = localStorage.getItem('motivationalQuote');
            if (storedQuote) {
                try {
                    const parsed = JSON.parse(storedQuote);
                    console.log('Using stored quote:', parsed);
                    setMotivationalQuote(parsed);
                    return;
                } catch (e) {
                    console.error('Failed to parse stored quote');
                }
            }

            // Fallback quotes if API fails and no stored quote
            const fallbackQuotes = [
                { text: 'The only bad workout is the one that didn\'t happen.', author: 'Unknown' },
                { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
                { text: 'The body achieves what the mind believes.', author: 'Unknown' },
                { text: 'Don\'t limit your challenges. Challenge your limits.', author: 'Unknown' }
            ];

            const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            console.log('Using fallback quote:', randomFallback);
            setMotivationalQuote(randomFallback);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const checkAndFetchQuote = async () => {
            const now = new Date().getTime();
            const twelveHours = 12 * 60 * 60 * 1000;

            const storedLastFetch = localStorage.getItem('lastQuoteFetch');
            const lastFetch = storedLastFetch ? parseInt(storedLastFetch) : null;

            if (!lastFetch || (now - lastFetch) >= twelveHours) {
                await fetchMotivationalQuote();
            }
        };

        checkAndFetchQuote();
        const interval = setInterval(checkAndFetchQuote, 60 * 60 * 1000);
        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchMotivationalQuote]);

    useEffect(() => {
        if (showHelp) {
            // Save current scroll position
            const scrollY = window.scrollY;

            // Apply styles to prevent scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                // Restore scroll position
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
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
            maxWidth: 480,
            margin: '0 auto',
            background: 'linear-gradient(180deg, #0a0e27 0%, #0d1117 100%)',
            minHeight: '100vh',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            userSelect: 'none',
            WebkitUserSelect: 'none',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <header style={{
                textAlign: 'center',
                marginBottom: 40,
                paddingTop: 20
            }}>
                <div style={{
                    fontSize: 64,
                    marginBottom: 16,
                    animation: 'bounce 2s infinite'
                }}>💪</div>
                <h1 style={{
                    color: '#e8eef7',
                    fontSize: 32,
                    margin: 0,
                    fontWeight: 700,
                    letterSpacing: '-1px',
                    marginBottom: 8
                }}>RevolveMe™</h1>
                <div style={{
                    background: 'rgba(139, 172, 255, 0.15)',
                    color: '#8bacff',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    display: 'inline-block'
                }}>DinoTheDeveloper</div>
            </header>

            {/* Streak Badge */}
            {workoutStreak > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 172, 255, 0.2) 0%, rgba(97, 175, 254, 0.15) 100%)',
                    border: '1px solid rgba(139, 172, 255, 0.3)',
                    color: '#a8c5ff',
                    padding: '14px 20px',
                    borderRadius: 14,
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 32,
                    boxShadow: '0 4px 12px rgba(139, 172, 255, 0.1)'
                }}>
                    🔥 {workoutStreak} Day Streak!
                </div>
            )}

            {/* Motivational Quote - WITH REFRESH BUTTON */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(139, 172, 255, 0.1) 0%, rgba(97, 175, 254, 0.08) 100%)',
                border: '1px solid rgba(139, 172, 255, 0.2)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 15,
                    right: 15,
                    fontSize: 32,
                    opacity: 0.2
                }}></div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                }}>
                    <div style={{
                        fontSize: 12,
                        color: '#7a8fb8',
                        fontWeight: 600,
                        letterSpacing: '0.5px'
                    }}>DAILY MOTIVATION</div>

                    {/* REFRESH BUTTON - THIS IS NEW! */}
                    <button
                        onClick={fetchMotivationalQuote}
                        style={{
                            background: 'rgba(97, 175, 254, 0.2)',
                            border: '1px solid rgba(97, 175, 254, 0.3)',
                            borderRadius: 6,
                            color: '#61affe',
                            padding: '4px 8px',
                            fontSize: 11,
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(97, 175, 254, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(97, 175, 254, 0.2)';
                        }}
                    >
                        🔄 New Quote
                    </button>
                </div>

                <div style={{
                    fontSize: 16,
                    color: '#e8eef7',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    marginBottom: 12
                }}>
                    "{motivationalQuote.text}"
                </div>

                {motivationalQuote.author && (
                    <div style={{
                        fontSize: 13,
                        color: '#8bacff',
                        fontWeight: 600,
                        textAlign: 'right'
                    }}>
                        — {motivationalQuote.author}
                    </div>
                )}
            </div>

            {/* Year Progress */}
            <div style={{
                background: 'rgba(26, 31, 58, 0.6)',
                border: '1px solid rgba(139, 172, 255, 0.15)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 32
            }}>
                <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: 15,
                    color: '#b4c5e4',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    📅 Year Progress
                </h3>

                <div style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#61affe',
                    marginBottom: 8
                }}>
                    {getDaysInYear().remaining} days left
                </div>

                <div style={{
                    fontSize: 14,
                    color: '#b4c5e4',
                    marginBottom: 16
                }}>
                    Make this year count!
                </div>

                <div style={{
                    width: '100%',
                    height: 10,
                    background: 'rgba(10, 14, 31, 0.6)',
                    borderRadius: 5,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${(getDaysInYear().passed / getDaysInYear().total) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(135deg, #61affe 0%, #8bacff 100%)',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16
            }}>
                <button
                    onClick={onNavigateToWorkouts}
                    style={{
                        width: '100%',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #61affe 0%, #8bacff 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 14,
                        cursor: 'pointer',
                        fontSize: 18,
                        fontWeight: 700,
                        boxShadow: '0 6px 20px rgba(97, 175, 254, 0.4)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(97, 175, 254, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(97, 175, 254, 0.4)';
                    }}
                >
                    <span style={{ fontSize: 24 }}>🏋️</span>
                    View Workouts
                </button>

                <button
                    onClick={() => setShowHelp(true)}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'rgba(26, 31, 58, 0.8)',
                        color: '#b4c5e4',
                        border: '1px solid rgba(139, 172, 255, 0.2)',
                        borderRadius: 14,
                        cursor: 'pointer',
                        fontSize: 15,
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 172, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(26, 31, 58, 0.8)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <span style={{ fontSize: 20 }}>❓</span>
                    Help & Information
                </button>
            </div>

            {/* Help Modal */}
            {showHelp && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    padding: 16,
                    backdropFilter: 'blur(8px)'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1419 100%)',
                        padding: 28,
                        borderRadius: 20,
                        width: '100%',
                        maxWidth: 380,
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        border: '1px solid rgba(139, 172, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>💪</div>
                            <h2 style={{ margin: 0, fontSize: 24, color: '#e8eef7', fontWeight: 700 }}>
                                Welcome to RevolveMe™
                            </h2>
                            <div style={{ fontSize: 13, color: '#8bacff', marginTop: 8, fontStyle: 'italic' }}>
                                For the boys, by the boys
                            </div>
                        </div>

                        <div style={{
                            marginBottom: 20,
                            padding: 18,
                            background: 'rgba(139, 172, 255, 0.1)',
                            borderRadius: 12,
                            border: '1px solid rgba(139, 172, 255, 0.2)'
                        }}>
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: 15,
                                color: '#61affe',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                📱 Best Experience
                            </h3>
                            <p style={{ fontSize: 13, color: '#b4c5e4', margin: 0, lineHeight: 1.6 }}>
                                This is a <strong>mobile-only web app</strong>. For the best experience,
                                tap the <strong>Share button</strong> in your browser and select
                                <strong> "Add to Home Screen"</strong> to use it like a native app!
                            </p>
                        </div>

                        <div style={{
                            marginBottom: 20,
                            padding: 18,
                            background: 'rgba(26, 31, 58, 0.6)',
                            borderRadius: 12,
                            border: '1px solid rgba(139, 172, 255, 0.15)'
                        }}>
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: 15,
                                color: '#61affe',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                💙 Made with Love
                            </h3>
                            <p style={{ fontSize: 13, color: '#b4c5e4', margin: 0, lineHeight: 1.6 }}>
                                I built this app to keep myself motivated and to help us all stay on track
                                with our fitness goals. We're in this together! 👑
                            </p>
                        </div>

                        <div style={{
                            marginBottom: 20,
                            padding: 18,
                            background: 'rgba(26, 31, 58, 0.6)',
                            borderRadius: 12,
                            border: '1px solid rgba(139, 172, 255, 0.15)'
                        }}>
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: 15,
                                color: '#61affe',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                🔄 Workout Updates
                            </h3>
                            <p style={{ fontSize: 13, color: '#b4c5e4', margin: 0, lineHeight: 1.6 }}>
                                Workouts are updated <strong>every 1-2 months</strong> to keep things
                                fresh and maximize gains. Stay consistent! 🔥
                            </p>
                        </div>

                        <button
                            onClick={() => setShowHelp(false)}
                            style={{
                                width: '100%',
                                padding: 14,
                                background: 'linear-gradient(135deg, #61affe 0%, #8bacff 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 12,
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: 14,
                                boxShadow: '0 4px 16px rgba(97, 175, 254, 0.4)'
                            }}
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
        </div>
    );
};

export default Home;