const workouts = {
    monday: {
        title: "MONDAY - Upper Power (Chest & Shoulders)",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Treadmill walk incline 8-10% at 3.5mph", cardio: true },
            { id: 'inc_bb_press', name: "Incline Barbell Press", sets: "4 sets x 6-8 reps", note: "" },
            { id: 'weighted_dips', name: "Weighted Dips", sets: "3 sets x 8-10 reps", note: "" },
            { id: 'overhead_press', name: "Overhead Press", sets: "4 sets x 6-8 reps", note: "" },
            { id: 'inc_db_press', name: "Incline Dumbbell Press", sets: "3 sets x 10-12 reps", note: "" },
            { id: 'lat_raises', name: "Lateral Raises", sets: "4 sets x 12-15 reps", note: "" },
            { id: 'close_bench', name: "Close-Grip Bench Press", sets: "3 sets x 8-10 reps", note: "" },
            { id: 'face_pulls', name: "Face Pulls", sets: "3 sets x 15-20 reps", note: "" },
            { name: "Finisher Cardio", sets: "10 mins", note: "Stairmaster: 2 mins moderate, 1 min intense (repeat 3x) + 1 min cool down", cardio: true }
        ]
    },
    tuesday: {
        title: "TUESDAY - Lower Body (Quad/Glute Focus)",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Treadmill walk incline 6% at 4mph", cardio: true },
            { id: 'back_squats', name: "Back Squats", sets: "4 sets x 6-8 reps", note: "" },
            { id: 'romanian_dl', name: "Romanian Deadlifts", sets: "4 sets x 8-10 reps", note: "" },
            { id: 'bulgarian_squats', name: "Bulgarian Split Squats", sets: "3 sets x 10-12 each leg", note: "Single-leg strength" },
            { id: 'leg_press', name: "Leg Press", sets: "3 sets x 15-20 reps", note: "Volume for growth" },
            { id: 'walking_lunges', name: "Walking Lunges", sets: "3 sets x 12 each leg", note: "Functional movement" },
            { id: 'calf_raises', name: "Calf Raises", sets: "4 sets x 15-20 reps", note: "" },
            { id: 'plank', name: "Plank", sets: "3 sets x 45-60 seconds", note: "Core stability" },
            { name: "Finisher Cardio", sets: "10 mins", note: "Treadmill incline walk: 12-15% at 3.5mph", cardio: true }
        ]
    },
    thursday: {
        title: "THURSDAY - Upper Hypertrophy (Back/Arms)",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Stairmaster moderate pace", cardio: true },
            { id: 'pullups', name: "Pull-ups/Chin-ups", sets: "4 sets x 8-12 reps", note: "" },
            { id: 'bb_rows', name: "Barbell Rows", sets: "4 sets x 8-10 reps", note: "" },
            { id: 'lat_pulldowns', name: "Lat Pulldowns", sets: "3 sets x 10-12 reps", note: "" },
            { id: 'bb_curls', name: "Barbell Curls", sets: "4 sets x 8-10 reps", note: "" },
            { id: 'hammer_curls', name: "Hammer Curls", sets: "3 sets x 10-12 reps", note: "" },
            { id: 'tricep_dips', name: "Tricep Dips", sets: "3 sets x 10-15 reps", note: "" },
            { id: 'cable_lat_raises', name: "Cable Lateral Raises", sets: "3 sets x 12-15 reps", note: "" },
            { name: "Finisher Cardio", sets: "10 mins", note: "Stairmaster intervals: 1 min hard, 1 min easy (5 rounds)", cardio: true }
        ]
    },
    friday: {
        title: "FRIDAY - Lower Hypertrophy (Hamstring/Glute Focus)",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Treadmill walk incline 8% at 3.8mph", cardio: true },
            { id: 'conv_deadlifts', name: "Conventional Deadlifts", sets: "4 sets x 6-8 reps", note: "" },
            { id: 'front_squats', name: "Front Squats", sets: "3 sets x 8-10 reps", note: "Core engagement" },
            { id: 'stiff_dl', name: "Stiff Leg Deadlifts", sets: "4 sets x 10-12 reps", note: "" },
            { id: 'leg_curls', name: "Leg Curls", sets: "3 sets x 12-15 reps", note: "" },
            { id: 'hip_thrusts', name: "Hip Thrusts", sets: "3 sets x 12-15 reps", note: "Glute activation" },
            { id: 'goblet_squats', name: "Goblet Squats", sets: "3 sets x 15-20 reps", note: "" },
            { id: 'hanging_leg_raises', name: "Hanging Leg Raises", sets: "3 sets x 10-15 reps", note: "Abs focus" },
            { name: "Finisher Cardio", sets: "10 mins", note: "Treadmill: 5 mins steady state + 5 mins intervals (30s sprint, 90s walk)", cardio: true }
        ]
    },
    saturday: {
        title: "SATURDAY - Optional Cardio/Abs Day",
        exercises: [
            { id: 'burpees', name: "Burpees", sets: "3 sets x 10", note: "", cardio: true },
            { id: 'mountain_climbers', name: "Mountain Climbers", sets: "3 sets x 20", note: "", cardio: true },
            { id: 'russian_twists', name: "Russian Twists", sets: "3 sets x 30", note: "" },
            { id: 'plank_pushup', name: "Plank to Push-up", sets: "3 sets x 10", note: "" },
            { id: 'jump_squats', name: "Jump Squats", sets: "3 sets x 15", note: "", cardio: true },
            { id: 'pike_pushups', name: "Pike Push-ups", sets: "3 sets x 12", note: "" },
            { name: "Extended Cardio", sets: "25 mins", note: "Stairmaster: 20-25 minutes steady state (conversation pace)", cardio: true }
        ]
    }
};

export default workouts;