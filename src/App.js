import React, { useState } from 'react';
import Home from './Home';
import Workouts from './Workouts';

function App() {
    const [currentPage, setCurrentPage] = useState('home');

    return (
        <div>
            {currentPage === 'home' ? (
                <Home onNavigateToWorkouts={() => setCurrentPage('workouts')} />
            ) : (
                <Workouts onBackToHome={() => setCurrentPage('home')} />
            )}
        </div>
    );
}

export default App;