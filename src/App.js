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
  const [collapsed, setCollapsed] = useState(() => loadFromLocalStorage('collapsed', { tuesday: true, thursday: true, friday: true, saturday: true }));
  const [allUsers, setAllUsers] = useState(() => loadFromLocalStorage('allUsers', ['User 1']));
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState('');
  const [timer, setTimer] = useState(0);
  const [mainTimer, setMainTimer] = useState(0);
  const [mainRunning, setMainRunning] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [showProgress, setShowProgress] = useState(false);
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

  // Rest timer
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

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

  useEffect(() => {
    saveToLocalStorage('collapsed', collapsed);
  }, [collapsed]);

  useEffect(() => {
    saveToLocalStorage('allUsers', allUsers);
  }, [allUsers]);

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
      setTimer(0);
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
    <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <header style={{ background: '#2E3440', padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ color: '#fff', fontSize: 18, margin: 0 }}>Revolve™️</h1>
          <h4 style={{ color: '#fff', fontSize: 12, margin: 0 }}>v.0.1 BETA RELEASE</h4>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowProgress(true)} style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 12
            }}>
              📊 Stats
            </button>
            <button onClick={() => setShowModal(true)} style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 12
            }}>
              👥 Partners
            </button>
          </div>
        </div>

        {/* Workout Streak Display */}
        {workoutStreak > 0 && (
          <div style={{
            background: 'rgba(163, 190, 140, 0.2)',
            color: '#A3BE8C',
            padding: '6px 12px',
            borderRadius: 20,
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 'bold',
            marginBottom: 12
          }}>
            🔥 {workoutStreak} day streak!
          </div>
        )}

        {/* Main Timer - Centered and Bigger */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg, #88C0D0, #5E81AC)',
            borderRadius: 16,
            padding: 20,
            display: 'inline-block',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 12 }}>
              {formatTime(mainTimer)}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => setMainRunning(!mainRunning)}
                style={{
                  background: mainRunning ? '#BF616A' : '#A3BE8C',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 14
                }}>
                {mainRunning ? 'Stop' : 'Start'}
              </button>
              {mainTimer > 0 && (
                <button onClick={() => setMainTimer(0)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: 12,
                    color: '#fff',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: 14
                  }}>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ padding: 16, paddingBottom: 80 }}>
        <div style={{ background: 'linear-gradient(135deg, #88C0D0, #5E81AC)', color: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 }}>
          <strong>Progressive Overload</strong><br />
          Make sure you complete all sets with good form before increasing weight.
        </div>

        {Object.entries(workouts).map(([day, data]) => (
          <div key={day} style={{ marginBottom: 16, border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
            <div onClick={() => setCollapsed(prev => ({ ...prev, [day]: !prev[day] }))}
              style={{ background: '#2E3440', color: '#fff', padding: 16, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, fontWeight: 'bold' }}>{data.title}</div>
              <div style={{ transform: collapsed[day] ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>▼</div>
            </div>
            {!collapsed[day] && (
              <div>
                {data.exercises.map((ex, i) => (
                  <div key={i} style={{
                    padding: 14,
                    borderBottom: i < data.exercises.length - 1 ? '1px solid #eee' : '',
                    display: 'flex',
                    flexDirection: 'column',
                    background: ex.cardio ? '#FFE0B2' : '#fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: ex.id ? 8 : 0 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 600,
                          textDecoration: ex.id && isCompleted(ex.id) ? 'line-through' : 'none',
                          textDecorationThickness: ex.id && isCompleted(ex.id) ? '3.5px' : 'auto',
                          textDecorationColor: ex.id && isCompleted(ex.id) ? '#d11b2dff' : 'auto',
                          fontSize: 14
                        }}>
                          {ex.name}
                        </div>
                        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                          <span style={{ color: '#BF616A', fontWeight: 600 }}>{ex.sets}</span>
                          {ex.note && <span> • {ex.note}</span>}
                        </div>
                      </div>
                      {ex.id && (
                        <input type="checkbox"
                          checked={isCompleted(ex.id)}
                          onChange={() => toggleCompleted(ex.id)}
                          style={{ marginLeft: 8, transform: 'scale(1.2)' }} />
                      )}
                    </div>

                    {/* Weight inputs for all users */}
                    {ex.id && allUsers.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {allUsers.map((user, userIndex) => (
                          <div key={user} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: 8,
                            background: userIndex % 2 === 0 ? '#f9f9f9' : '#fff',
                            borderRadius: 6
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 60, color: '#2E3440' }}>
                              {user}:
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={getCurrentWeight(ex.id, user)}
                              onChange={(e) => saveWeight(ex.id, user, e.target.value)}
                              style={{
                                width: 70,
                                padding: 6,
                                border: '2px solid #ddd',
                                borderRadius: 6,
                                textAlign: 'center',
                                fontSize: 13
                              }}
                            />
                            <span style={{ fontSize: 12, color: '#666' }}>kg</span>
                            {getCurrentWeight(ex.id, user) && getPersonalRecords()[ex.id]?.user === user && getPersonalRecords()[ex.id]?.weight === getCurrentWeight(ex.id, user) && (
                              <span style={{ fontSize: 10, background: '#FFD700', color: '#8B4513', padding: '2px 6px', borderRadius: 10, fontWeight: 'bold' }}>
                                PR!
                              </span>
                            )}
                          </div>
                        ))}

                        {/* Notes input */}
                        <input
                          type="text"
                          placeholder="Notes..."
                          value={getCurrentNote(ex.id)}
                          onChange={(e) => saveNote(ex.id, e.target.value)}
                          style={{
                            padding: 8,
                            border: '1px solid #ddd',
                            borderRadius: 6,
                            fontSize: 13,
                            background: '#fafafa'
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

      {/* Fixed bottom bar */}
      {/* Fixed bottom bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 480,
        margin: '0 auto',
        background: '#fff',
        borderTop: '1px solid #ddd',
        padding: 12,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 10
      }}>
        <button onClick={() => setTimer(90)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, fontWeight: 'bold' }}>
          ⏱️ {timer > 0 ? `${timer}s` : 'Rest Timer'}
        </button>
        {/* <h4 style={{ color: '#000000ff', fontSize: 12, margin: 0 }}>Made with ❤️</h4>
        <div style={{ width: 80 }}></div> Spacer to center the middle text */}
      </div>

      {/* Modal for managing users */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, width: '100%', maxWidth: 360, maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: 16, fontSize: 18 }}>Manage Gym Partners</h2>

            <div style={{ marginBottom: 16 }}>
              <strong>Current Partners:</strong>
              <div style={{ marginTop: 8 }}>
                {allUsers.map(user => (
                  <div key={user} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f5f5f5',
                    padding: '8px 12px',
                    borderRadius: 8,
                    margin: '4px 0',
                    fontSize: 14
                  }}>
                    {editingUser === user ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <input
                          value={editUserName}
                          onChange={(e) => setEditUserName(e.target.value)}
                          style={{ flex: 1, padding: 4, border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}
                          autoFocus
                        />
                        <button
                          onClick={() => editUser(user, editUserName)}
                          style={{ background: '#A3BE8C', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                          ✓
                        </button>
                        <button
                          onClick={() => { setEditingUser(null); setEditUserName(''); }}
                          style={{ background: '#BF616A', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span>{user}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            onClick={() => { setEditingUser(user); setEditUserName(user); }}
                            style={{ background: 'none', border: 'none', color: '#88C0D0', cursor: 'pointer', fontSize: 12 }}>
                            ✏️
                          </button>
                          {allUsers.length > 1 && (
                            <button
                              onClick={() => deleteUser(user)}
                              style={{ background: 'none', border: 'none', color: '#BF616A', cursor: 'pointer', fontSize: 12 }}>
                              🗑️
                            </button>
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
              style={{ width: '100%', padding: 12, marginBottom: 12, border: '1px solid #ddd', borderRadius: 8 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={addUser} style={{ flex: 1, padding: 12, background: '#88C0D0', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Add Partner
              </button>
              <button onClick={() => { setShowModal(false); setNewUser(''); setEditingUser(null); setEditUserName(''); }} style={{ flex: 1, padding: 12, background: '#f0f0f0', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showProgress && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, width: '100%', maxWidth: 360, maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: 16, fontSize: 18 }}>📊 Workout Stats</h2>

            {/* Workout Progress */}
            <div style={{ marginBottom: 16, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 14 }}>Today's Progress</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, background: '#e0e0e0', borderRadius: 10, height: 8 }}>
                  <div style={{
                    width: `${(getWorkoutProgress().completed / getWorkoutProgress().total) * 100}%`,
                    background: 'linear-gradient(90deg, #88C0D0, #5E81AC)',
                    height: '100%',
                    borderRadius: 10
                  }}></div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 'bold' }}>
                  {getWorkoutProgress().completed}/{getWorkoutProgress().total}
                </span>
              </div>
            </div>

            {/* Workout Streak */}
            <div style={{ marginBottom: 16, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 14 }}>🔥 Workout Streak</h3>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#A3BE8C' }}>
                {workoutStreak} days
              </div>
            </div>

            {/* Personal Records */}
            <div style={{ marginBottom: 16, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 14 }}>🏆 Personal Records</h3>
              {Object.keys(getPersonalRecords()).length === 0 ? (
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>No records yet. Start tracking weights!</p>
              ) : (
                <div style={{ maxHeight: 120, overflowY: 'auto' }}>
                  {Object.entries(getPersonalRecords()).slice(0, 5).map(([exerciseId, record]) => {
                    const exerciseName = Object.values(workouts)
                      .flatMap(day => day.exercises)
                      .find(ex => ex.id === exerciseId)?.name || exerciseId;
                    return (
                      <div key={exerciseId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span>{exerciseName}:</span>
                        <span style={{ fontWeight: 'bold' }}>{record.weight}kg ({record.user})</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Add Reset Data Section */}
            <div style={{ marginBottom: 16, padding: 12, background: '#ffebee', borderRadius: 8, border: '1px solid #ffcdd2' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#c62828' }}>⚠️ Danger Zone</h3>
              <p style={{ fontSize: 12, color: '#666', margin: '0 0 8px 0' }}>
                This will permanently delete all your workout data, weights, and progress.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('⚠️ Are you absolutely sure?\n\nThis will permanently delete:\n• All weight records\n• All workout progress\n• All notes\n• Workout streak\n\nThis action cannot be undone.')) {
                    resetAllData();
                    setShowProgress(false);
                  }
                }}
                style={{
                  width: '100%',
                  padding: 8,
                  background: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              >
                🗑️ Reset All Data
              </button>
            </div>
            <button onClick={() => setShowProgress(false)} style={{ width: '100%', padding: 12, background: '#88C0D0', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymTracker;