import React, { useState, useEffect } from 'react';
import workouts from './workoutData';

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

const GymTracker = () => {
  const [weights, setWeights] = useState(() => loadFromLocalStorage('weights', {}));
  const [notes, setNotes] = useState(() => loadFromLocalStorage('notes', {}));
  const [completed, setCompleted] = useState(() => loadFromLocalStorage('completed', {}));
  const [collapsed, setCollapsed] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  });
  const [allUsers, setAllUsers] = useState(() => loadFromLocalStorage('allUsers', ['User 1']));
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState('');
  const [mainTimer, setMainTimer] = useState(0);
  const [mainRunning, setMainRunning] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workoutStreak, setWorkoutStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('workoutStreak');
      return saved ? parseInt(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [lastWorkoutDate, setLastWorkoutDate] = useState(() => {
    try {
      return localStorage.getItem('lastWorkoutDate') || null;
    } catch {
      return null;
    }
  });

  // Main workout timer
  useEffect(() => {
    let interval;
    if (mainRunning) {
      interval = setInterval(() => setMainTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mainRunning]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage('weights', weights);
  }, [weights]);

  useEffect(() => {
    saveToLocalStorage('notes', notes);
  }, [notes]);

  useEffect(() => {
    saveToLocalStorage('completed', completed);
  }, [completed]);

  // useEffect(() => {
  //   saveToLocalStorage('collapsed', collapsed);
  // }, [collapsed]);

  useEffect(() => {
    saveToLocalStorage('allUsers', allUsers);
  }, [allUsers]);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showModal || showProgress || showSettings) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal, showProgress, showSettings]);

  const saveWeight = (id, user, val) => {
    const num = Math.max(0, parseFloat(val) || 0);
    const key = `${user}_${id}`;
    if (num > 0) {
      setWeights(prev => ({ ...prev, [key]: num }));
    } else {
      setWeights(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const saveNote = (id, val) => {
    setNotes(prev => ({ ...prev, [id]: val }));
  };

  const toggleCompleted = (id) => {
    const wasCompleted = completed[id] || false;
    const newCompleted = !wasCompleted;
    setCompleted(prev => ({ ...prev, [id]: newCompleted }));

    // Update workout streak when completing exercises
    if (newCompleted && !wasCompleted) {
      const today = new Date().toDateString();
      if (lastWorkoutDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = lastWorkoutDate === yesterday.toDateString();

        const newStreak = isConsecutive ? workoutStreak + 1 : 1;
        setWorkoutStreak(newStreak);
        setLastWorkoutDate(today);

        try {
          localStorage.setItem('workoutStreak', newStreak.toString());
          localStorage.setItem('lastWorkoutDate', today);
        } catch { }
      }
    }
  };

  const getCurrentWeight = (id, user) => {
    return weights[`${user}_${id}`] || '';
  };

  const getCurrentNote = (id) => {
    return notes[id] || '';
  };

  const isCompleted = (id) => {
    return completed[id] || false;
  };

  const addUser = () => {
    if (newUser && !allUsers.includes(newUser)) {
      setAllUsers(prev => [...prev, newUser]);
      setNewUser('');
      setShowModal(false);
    }
  };

  const editUser = (oldName, newName) => {
    if (newName && newName !== oldName && !allUsers.includes(newName)) {
      setAllUsers(prev => prev.map(user => user === oldName ? newName : user));

      // Update weights with new user name
      const updatedWeights = {};
      Object.keys(weights).forEach(key => {
        if (key.startsWith(`${oldName}_`)) {
          const exerciseId = key.substring(oldName.length + 1);
          updatedWeights[`${newName}_${exerciseId}`] = weights[key];
        } else {
          updatedWeights[key] = weights[key];
        }
      });
      setWeights(updatedWeights);

      setEditingUser(null);
      setEditUserName('');
    }
  };

  const deleteUser = (userName) => {
    if (allUsers.length > 1 && window.confirm(`Remove ${userName} from the gym tracker?`)) {
      setAllUsers(prev => prev.filter(user => user !== userName));

      // Remove user's weight data
      const updatedWeights = {};
      Object.keys(weights).forEach(key => {
        if (!key.startsWith(`${userName}_`)) {
          updatedWeights[key] = weights[key];
        }
      });
      setWeights(updatedWeights);
    }
  };

  const getWorkoutProgress = () => {
    const totalExercises = Object.values(workouts).reduce((sum, day) =>
      sum + day.exercises.filter(ex => ex.id).length, 0
    );
    const completedExercises = Object.keys(completed).filter(key => completed[key]).length;
    return { completed: completedExercises, total: totalExercises };
  };

  const getPersonalRecords = () => {
    const prs = {};
    allUsers.forEach(user => {
      Object.keys(weights).forEach(key => {
        if (key.startsWith(`${user}_`)) {
          const exerciseId = key.substring(user.length + 1);
          const weight = weights[key];
          if (!prs[exerciseId] || weight > prs[exerciseId].weight) {
            prs[exerciseId] = { weight, user };
          }
        }
      });
    });
    return prs;
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const resetAllData = () => {
    if (window.confirm('Reset all data?')) {
      setWeights({});
      setNotes({});
      setCompleted({});
      setMainTimer(0);
      setMainRunning(false);
      setWorkoutStreak(0);
      setLastWorkoutDate(null);

      localStorage.removeItem('weights');
      localStorage.removeItem('notes');
      localStorage.removeItem('completed');
      localStorage.removeItem('workoutStreak');
      localStorage.removeItem('lastWorkoutDate');
    }
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      background: 'linear-gradient(180deg, #0a0e27 0%, #0d1117 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1419 100%)',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(139, 172, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <h1 style={{
            color: '#e8eef7',
            fontSize: 22,
            margin: 0,
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>RevolveMe™</h1>
          <div style={{
            background: 'rgba(139, 172, 255, 0.15)',
            color: '#8bacff',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}>v.3.0</div>
        </div>

        {workoutStreak > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 172, 255, 0.2) 0%, rgba(97, 175, 254, 0.15) 100%)',
            border: '1px solid rgba(139, 172, 255, 0.3)',
            color: '#a8c5ff',
            padding: '10px 16px',
            borderRadius: 12,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
            boxShadow: '0 4px 12px rgba(139, 172, 255, 0.1)'
          }}>
            🔥 {workoutStreak} day streak!
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 20
        }}>
          {[
            { icon: '🪧', label: 'Coming Soon' },
            { icon: '📊', label: 'Analytics', onClick: () => setShowProgress(true) },
            { icon: '⚙️', label: 'Settings', onClick: () => setShowSettings(true) },
            { icon: '👥', label: 'Add Partner', onClick: () => setShowModal(true) }
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              style={{
                background: 'rgba(26, 31, 58, 0.6)',
                border: '1px solid rgba(139, 172, 255, 0.15)',
                borderRadius: 12,
                padding: 18,
                textAlign: 'center',
                cursor: item.onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                if (item.onClick) {
                  e.currentTarget.style.background = 'rgba(139, 172, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (item.onClick) {
                  e.currentTarget.style.background = 'rgba(26, 31, 58, 0.6)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, color: '#b4c5e4', fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(15, 20, 25, 0.8) 100%)',
          border: '1px solid rgba(139, 172, 255, 0.3)',
          borderRadius: 14,
          padding: 18,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
            <div style={{
              fontSize: 11,
              color: '#7a8fb8',
              minWidth: 80,
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>WORKOUT</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#e8eef7' }}>
              {formatTime(mainTimer)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setMainRunning(!mainRunning)}
              style={{
                background: mainRunning ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #8bacff 0%, #61affe 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '8px 18px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                boxShadow: mainRunning ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(139, 172, 255, 0.3)',
                transition: 'all 0.2s ease'
              }}>
              {mainRunning ? 'Stop' : 'Start'}
            </button>
            {mainTimer > 0 && (
              <button onClick={() => setMainTimer(0)}
                style={{
                  background: 'rgba(26, 31, 58, 0.8)',
                  border: '1px solid rgba(139, 172, 255, 0.2)',
                  borderRadius: 10,
                  color: '#b4c5e4',
                  padding: '8px 18px',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}>
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ padding: 20, paddingBottom: 80 }}>
        {Object.entries(workouts).map(([day, data]) => (
          <div key={day} style={{
            marginBottom: 16,
            border: '1px solid rgba(139, 172, 255, 0.2)',
            borderRadius: 14,
            overflow: 'hidden',
            background: 'rgba(26, 31, 58, 0.4)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}>
            <div onClick={() => setCollapsed(prev => ({ ...prev, [day]: !prev[day] }))}
              style={{
                background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(15, 20, 25, 0.9) 100%)',
                borderBottom: !collapsed[day] ? '1px solid rgba(139, 172, 255, 0.15)' : 'none',
                color: '#e8eef7',
                padding: 18,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{data.title}</div>
              <div style={{
                transform: collapsed[day] ? 'rotate(-90deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease',
                color: '#8bacff'
              }}>▼</div>
            </div>
            {!collapsed[day] && (
              <div>
                {data.exercises.map((ex, i) => (
                  <div key={i} style={{
                    padding: 16,
                    borderBottom: i < data.exercises.length - 1 ? '1px solid rgba(139, 172, 255, 0.1)' : '',
                    display: 'flex',
                    flexDirection: 'column',
                    background: ex.cardio ? 'rgba(15, 20, 37, 0.6)' : 'rgba(10, 14, 31, 0.6)',
                    color: '#e8eef7',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: ex.id ? 12 : 0 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 600,
                          textDecoration: ex.id && isCompleted(ex.id) ? 'line-through' : 'none',
                          textDecorationThickness: ex.id && isCompleted(ex.id) ? '2px' : 'auto',
                          textDecorationColor: ex.id && isCompleted(ex.id) ? '#ef4444' : 'auto',
                          fontSize: 15,
                          color: '#e8eef7'
                        }}>
                          {ex.name}
                        </div>
                        <div style={{ fontSize: 13, color: '#8fa3c7', marginTop: 4 }}>
                          <span style={{ color: '#61affe', fontWeight: 600 }}>{ex.sets}</span>
                          {ex.note && <span> • {ex.note}</span>}
                        </div>
                      </div>
                      {ex.id && (
                        <input type="checkbox"
                          checked={isCompleted(ex.id)}
                          onChange={() => toggleCompleted(ex.id)}
                          style={{
                            marginLeft: 12,
                            transform: 'scale(1.3)',
                            accentColor: '#61affe',
                            cursor: 'pointer'
                          }} />
                      )}
                    </div>

                    {ex.id && allUsers.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                        {allUsers.map((user, userIndex) => (
                          <div key={user} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: 12,
                            background: userIndex % 2 === 0 ? 'rgba(26, 31, 58, 0.5)' : 'rgba(15, 20, 37, 0.5)',
                            borderRadius: 10,
                            border: '1px solid rgba(139, 172, 255, 0.1)'
                          }}>
                            <span style={{ fontSize: 14, fontWeight: 600, minWidth: 60, color: '#b4c5e4' }}>
                              {user}:
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={getCurrentWeight(ex.id, user)}
                              onChange={(e) => saveWeight(ex.id, user, e.target.value)}
                              style={{
                                width: 70,
                                padding: 8,
                                border: '1px solid rgba(139, 172, 255, 0.2)',
                                borderRadius: 8,
                                textAlign: 'center',
                                fontSize: 14,
                                background: 'rgba(10, 14, 31, 0.6)',
                                color: '#e8eef7',
                                fontWeight: 600
                              }}
                            />
                            <span style={{ fontSize: 12, color: '#7a8fb8' }}>kg</span>
                            {getCurrentWeight(ex.id, user) && getPersonalRecords()[ex.id]?.user === user && getPersonalRecords()[ex.id]?.weight === getCurrentWeight(ex.id, user) && (
                              <span style={{
                                fontSize: 10,
                                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                                color: '#1a1f3a',
                                padding: '3px 8px',
                                borderRadius: 6,
                                fontWeight: 700,
                                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                              }}>
                                PR!
                              </span>
                            )}
                          </div>
                        ))}

                        <input
                          type="text"
                          placeholder="Notes..."
                          value={getCurrentNote(ex.id)}
                          onChange={(e) => saveNote(ex.id, e.target.value)}
                          style={{
                            padding: 10,
                            border: '1px solid rgba(139, 172, 255, 0.2)',
                            borderRadius: 10,
                            fontSize: 13,
                            background: 'rgba(26, 31, 58, 0.5)',
                            color: '#e8eef7',
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1419 100%)', padding: 28, borderRadius: 20, width: '100%', maxWidth: 360, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(139, 172, 255, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
            <h2 style={{ marginBottom: 20, fontSize: 20, color: '#e8eef7', fontWeight: 700 }}>Manage Gym Partners</h2>

            <div style={{ marginBottom: 20 }}>
              <strong style={{ color: '#b4c5e4', fontSize: 14 }}>Current Partners:</strong>
              <div style={{ marginTop: 12 }}>
                {allUsers.map(user => (
                  <div key={user} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(26, 31, 58, 0.6)',
                    border: '1px solid rgba(139, 172, 255, 0.15)',
                    padding: '10px 14px',
                    borderRadius: 10,
                    margin: '6px 0',
                    fontSize: 14,
                    color: '#e8eef7'
                  }}>
                    {editingUser === user ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <input
                          value={editUserName}
                          onChange={(e) => setEditUserName(e.target.value)}
                          style={{ flex: 1, padding: 4, border: '1px solid rgba(139, 172, 255, 0.3)', borderRadius: 6, fontSize: 13, background: 'rgba(10, 14, 31, 0.6)', color: '#e8eef7' }}
                          autoFocus
                        />
                        <button
                          onClick={() => editUser(user, editUserName)}
                          style={{ background: '#61affe', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                          ✓
                        </button>
                        <button
                          onClick={() => { setEditingUser(null); setEditUserName(''); }}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{user}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => { setEditingUser(user); setEditUserName(user); }} style={{ background: 'none', border: 'none', color: '#8bacff', cursor: 'pointer', fontSize: 14 }}>✏️</button>
                          {allUsers.length > 1 && (
                            <button onClick={() => deleteUser(user)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14 }}>🗑️</button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <input
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="Enter new partner name..."
              style={{ width: '100%', padding: 12, marginBottom: 16, border: '1px solid rgba(139, 172, 255, 0.2)', borderRadius: 10, background: 'rgba(10, 14, 31, 0.6)', color: '#e8eef7', fontSize: 14 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={addUser} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #61affe 0%, #8bacff 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(97, 175, 254, 0.3)' }}>
                Add Partner
              </button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showProgress && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1419 100%)', padding: 28, borderRadius: 20, width: '100%', maxWidth: 360, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(139, 172, 255, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
            <h2 style={{ marginBottom: 20, fontSize: 20, color: '#e8eef7', fontWeight: 700 }}>📊 Workout Stats</h2>

            <div style={{ marginBottom: 16, padding: 16, background: 'rgba(26, 31, 58, 0.5)', borderRadius: 12, border: '1px solid rgba(139, 172, 255, 0.15)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#b4c5e4', fontWeight: 600 }}>Today's Progress</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, background: 'rgba(10, 14, 31, 0.8)', borderRadius: 10, height: 10, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(getWorkoutProgress().completed / getWorkoutProgress().total) * 100}%`,
                    background: 'linear-gradient(90deg, #61affe 0%, #8bacff 100%)',
                    height: '100%',
                    borderRadius: 10,
                    boxShadow: '0 0 12px rgba(97, 175, 254, 0.5)'
                  }}></div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e8eef7' }}>
                  {getWorkoutProgress().completed}/{getWorkoutProgress().total}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 16, padding: 16, background: 'rgba(26, 31, 58, 0.5)', borderRadius: 12, border: '1px solid rgba(139, 172, 255, 0.15)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#b4c5e4', fontWeight: 600 }}>🔥 Workout Streak</h3>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#61affe' }}>
                {workoutStreak} days
              </div>
            </div>

            <div style={{ marginBottom: 20, padding: 16, background: 'rgba(26, 31, 58, 0.5)', borderRadius: 12, border: '1px solid rgba(139, 172, 255, 0.15)' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#b4c5e4', fontWeight: 600 }}>🏆 Personal Records</h3>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: '#e8eef7' }}>
                  <span>Bench Press:</span>
                  <span style={{ fontWeight: 700, color: '#61affe' }}>80kg (Alex)</span>
                </div>
              </div>
            </div>

            <button onClick={() => setShowProgress(false)} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a1f3a 0%, #0f1419 100%)', padding: 28, borderRadius: 20, width: '100%', maxWidth: 360, maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(139, 172, 255, 0.2)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
            <h2 style={{ marginBottom: 20, fontSize: 20, color: '#e8eef7', fontWeight: 700 }}>⚙️ Settings</h2>

            <div style={{ marginBottom: 20, padding: 16, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 14, color: '#ef4444', fontWeight: 700 }}>⚠️ Danger Zone</h3>
              <p style={{ fontSize: 12, color: '#b4c5e4', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                This will permanently delete all your workout data, weights, and progress.
              </p>
              <button
                onClick={resetAllData}
                style={{
                  width: '100%',
                  padding: 10,
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1a1f3a',
                  border: '2px solid #fbbf24',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                }}
              >
                Reset All Data
              </button>
            </div>

            <button onClick={() => setShowSettings(false)} style={{ width: '100%', padding: 12, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymTracker;