const workouts = {
    monday: {
        title: "MONDAY - Push (Chest, Shoulders, Triceps)",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Incline treadmill walk, 8–10% incline, walking pace", cardio: true },
            { id: "flat_bb_bench", name: "Flat Barbell Bench Press", sets: "4 sets x 6–8 reps", note: "" },
            { id: "inc_db_press", name: "Incline Dumbbell Press", sets: "3 sets x 8–10 reps", note: "" },
            { id: "seated_oh_press", name: "Seated Overhead Press", sets: "3 sets x 8–10 reps", note: "" },
            { id: "lat_raises", name: "Lateral Raises", sets: "3 sets x 12–15 reps", note: "" },
            { id: "tricep_pushdown", name: "Cable Tricep Pushdowns", sets: "3 sets x 10–12 reps", note: "" },
            { id: "dips", name: "Dips (Weighted if possible)", sets: "2 sets to failure", note: "" },
            { name: "Finisher Cardio", sets: "10 mins", note: "Stairmaster: 2 mins moderate, 1 min intense (repeat 3x) + 1 min cool down", cardio: true },
            { id: "dips", name: "EXTRA (Viking Press)", sets: "2 sets to failure", note: "" },
        ]
    },
    tuesday: {
        title: "TUESDAY - Pull (Back, Biceps)",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Incline treadmill walk, 8–10% incline, walking pace", cardio: true },
            { id: "pullups", name: "Pull-Ups or Lat Pulldown", sets: "4 sets x 6–8 reps", note: "" },
            { id: "bb_rows", name: "Barbell Rows", sets: "3 sets x 8–10 reps", note: "" },
            { id: "face_pulls", name: "Face Pulls", sets: "3 sets x 12–15 reps", note: "" },
            { id: "db_curls", name: "Dumbbell Bicep Curls", sets: "3 sets x 8–10 reps", note: "" },
            { id: "hammer_curls", name: "Hammer Curls", sets: "3 sets x 10–12 reps", note: "" },
            { id: "rack_pulls", name: "Rack Pulls (Optional)", sets: "2 sets x 5 reps", note: "Do only if feeling recovered" },
            { name: "Finisher Cardio", sets: "8 mins", note: "Bike sprints: 20s sprint / 40s slow (8 rounds)", cardio: true }
        ]
    },
    wednesday: {
        title: "WEDNESDAY - Walk/Run",
        exercises: [
            { name: "Active Recovery", sets: "20–30 mins min", note: "Walk/Run", cardio: true }
        ]
    },
    thursday: {
        title: "THURSDAY - Legs",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Bike warm-up, light pace", cardio: true },
            { id: "squats", name: "Back Squats", sets: "4 sets x 6–8 reps", note: "" },
            { id: "rdl", name: "Romanian Deadlifts", sets: "3 sets x 8–10 reps", note: "" },
            { id: "lunges", name: "Walking Lunges", sets: "3 sets x 12 reps each leg", note: "" },
            { id: "leg_press", name: "Leg Press", sets: "3 sets x 10–12 reps", note: "" },
            { id: "calf_raises", name: "Standing Calf Raises", sets: "4 sets x 15–20 reps", note: "" },
            { name: "Finisher Cardio", sets: "10 mins", note: "5x 30s bike sprints / 90s rest", cardio: true }
        ]
    },
    friday: {
        title: "FRIDAY - Push & Pull (Upper Body Blend)",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Incline treadmill walk", cardio: true },
            { id: "inc_bb_press", name: "Incline Barbell Press", sets: "3 sets x 6–8 reps", note: "" },
            { id: "pullups", name: "Weighted Pull-Ups", sets: "3 sets x 8–10 reps", note: "" },
            { id: "arnold_press", name: "Arnold Press", sets: "3 sets x 8–10 reps", note: "" },
            { id: "db_rows", name: "Dumbbell Rows", sets: "3 sets x 10 reps each side", note: "" },
            { id: "superset_lat_curls", name: "Superset: Lateral Raises + Bicep Curls", sets: "3 sets x 12–15 reps each", note: "" },
            { id: "superset_dips_facepulls", name: "Superset: Dips + Face Pulls", sets: "3 sets (dips to failure, face pulls 15 reps)", note: "" },
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Incline treadmill walk, 8–10% incline, walking pace", cardio: true },
        ]
    },
    saturday: {
        title: "SATURDAY - Full Body + Cardio Supersets",
        exercises: [
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Incline treadmill walk, 8–10% incline, walking pace", cardio: true },
            { id: "superset_chest_back", name: "Superset: Bench Press + Barbell Rows", sets: "3 rounds (8–10 reps each)", note: "" },
            { id: "superset_shoulders_arms", name: "Superset: DB Shoulder Press + Barbell Curls", sets: "3 rounds (10–12 reps each)", note: "" },
            { id: "superset_legs_core", name: "Superset: Walking Lunges + Hanging Leg Raises", sets: "3 rounds (12 reps per leg / 15 reps)", note: "" },
            { id: "finisher_circuit", name: "Finisher Circuit", sets: "3 rounds", note: "Burpees (15), Kettlebell Swings (20), Mountain Climbers (30s), Plank (1 min)" },
            { name: "Pre-Workout Cardio", sets: "5 mins", note: "Incline treadmill walk, 8–10% incline, walking pace", cardio: true },
        ]
    },
    sunday: {
        title: "SUNDAY - Rest",
        exercises: [
            { name: "REST DAY", sets: "", note: "REST or LIGHT WALK", cardio: true }
        ]
    },
};

export default workouts;