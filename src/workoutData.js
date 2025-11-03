const workouts = {
    Day1: {
        title: "Day 1 - Push (Chest, Shoulders, Triceps)",
        exercises: [
            { name: "Cardio", sets: "30 mins", note: "Walk - Inside/Outside/StairMaster", cardio: true },
            { id: "Incline Dumbbell Press", name: "Incline Dumbbell Press", sets: "4 x 8–10", note: "Last set drop set (–30% weight, to failure), 3-sec eccentric" },
            { id: "Flat Barbell Bench Press", name: "Flat Barbell Bench Press", sets: "4 x 6–8", note: "Focus on progressive overload, full range" },
            { id: "seated_oh_press", name: "Seated Overhead Press", sets: "3 x 8–10", note: "Controlled tempo (2-sec down, explosive up)" },
            { id: "Superset: Lateral Raises + Front Plate Raises", name: "Lateral Raises", sets: "3 x 15–20 / 12", note: "Minimal rest between movements" },
            { id: "Viking Press", name: "Viking Press", sets: "3 x 10–12", note: "" },
            { id: "Cable Tricep Pushdowns", name: "Cable Tricep Pushdowns", sets: "3 x 10–12", note: "Add 1 drop set on final round" },
            { id: "", name: "Overhead Dumbbell Extension", sets: "3 x 10–12", note: "" },
            { id: "Push-Up Burnout (Optional)", name: "Push-Up Burnout (Optional)", sets: "2 x To Failure", note: "" },
        ]
    },
    Day2: {
        title: "Day 2 - Pull (Back, Biceps)",
        exercises: [
            { name: "Cardio", sets: "30 mins", note: "Walk - Inside/Outside/StairMaster", cardio: true },
            { id: "Pull-Ups", name: "Pull-Ups", sets: "4 x 6–8", note: "Control tempo, full stretch" },
            { id: "Barbell Rows", name: "Barbell Rows", sets: "3 x 8–10", note: "" },
            { id: "Single-Arm Dumbbell Row", name: "Single-Arm Dumbbell Row", sets: "3 x 10–12", note: "" },
            { id: "Lat Pulldown", name: "Lat Pulldown", sets: "3 x 8–10", note: "Last set drop to failure" },
            { id: "Dumbbell Bicep Curls", name: "Dumbbell Bicep Curls", sets: "3 x 8–10", note: "Slow negatives, twist wrist at top for full peak" },
            { id: "Superset: Hammer Curls + Reverse Curls", name: "Rack Pulls (Optional)", sets: "2 sets x 5 reps3 x 10–12 / 12–15", note: "Builds forearms & overall arm density" },
            { id: "Optional Burnout", name: "Optional Burnout", sets: "2 x To Failure", note: "21s curls (7 bottom, 7 top, 7 full range) / Pass the Parcel" }
        ]
    },
    Day3: {
        title: "Day 3 - Walk/Run",
        exercises: [
            { name: "Active Recovery", sets: "20–30 mins min", note: "Walk/Run", cardio: true }
        ]
    },
    Day4: {
        title: "Day 4 - Legs",
        exercises: [
            { name: "Cardio", sets: "30 mins", note: "Walk - Inside/Outside/StairMaster", cardio: true },
            { id: "squats", name: "Back Squats", sets: "4 sets x 6–8 reps", note: "" },
            { id: "rdl", name: "Romanian Deadlifts", sets: "3 sets x 8–10 reps", note: "" },
            { id: "lunges", name: "Walking Lunges", sets: "3 sets x 12 reps each leg", note: "" },
            { id: "leg_press", name: "Leg Press", sets: "3 sets x 10–12 reps", note: "" },
            { id: "calf_raises", name: "Standing Calf Raises", sets: "4 sets x 15–20 reps", note: "" },
        ]
    },
    Day5: {
        title: "Day 5 - Push & Pull (Upper Body Mix)",
        exercises: [
            { name: "Cardio", sets: "30 mins", note: "Walk - Inside/Outside/StairMaster", cardio: true },
            { id: "inc_bb_press", name: "Incline Barbell Press", sets: "3 x 6–8", note: "" },
            { id: "pullups", name: "Pull-Ups", sets: "3 x 8–10", note: "" },
            { id: "arnold_press", name: "Arnold Press", sets: "3 x 8–10", note: "" },
            { id: "db_rows", name: "Dumbbell Rows", sets: "3 x 12–15 each", note: "" },
            { id: "superset_lat_curls", name: "Superset: Lateral Raises + Bicep Curls", sets: "3 sets x 12–15 reps each", note: "" },
            { id: "superset_dips_facepulls", name: "Push-Up to Pull-Up Combo", sets: "2 x To Failure", note: "Push-ups (10-20 reps) → Pull-ups (to failure)" },
        ]
    },
    Day6: {
        title: "Day 6 - Full Body + Cardio Supersets",
        exercises: [
            { name: "Cardio", sets: "30 mins", note: "Walk - Inside/Outside/StairMaster", cardio: true },
            { id: "superset_chest_back", name: "Superset: Bench Press + Barbell Rows", sets: "3 rounds (8–10 reps each)", note: "" },
            { id: "superset_shoulders_arms", name: "Superset: DB Shoulder Press + Barbell Curls", sets: "3 rounds (10–12 reps each)", note: "" },
            { id: "superset_legs_core", name: "Superset: Walking Lunges + Hanging Leg Raises", sets: "3 rounds (12 reps per leg / 15 reps)", note: "" },
            { id: "finisher_circuit", name: "Finisher Circuit", sets: "3 rounds", note: "Burpees (15), Kettlebell Swings (20), Mountain Climbers (30s), Plank (1 min)" },
        ]
    },
    Day7: {
        title: "Day 7 - Rest",
        exercises: [
            { name: "REST DAY", sets: "", note: "REST or LIGHT WALK", cardio: true }
        ]
    },
};

export default workouts;