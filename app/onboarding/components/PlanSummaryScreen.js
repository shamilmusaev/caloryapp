'use client';

export default function PlanSummaryScreen({ 
  onComplete,
  height,
  weight,
  workoutFreq,
  goal,
  gender,
  birthdate
}) {
  // Calculate target date (7 days from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);
  const formattedDate = targetDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate.year || !birthdate.month || !birthdate.day) return 30;
    const birthDate = new Date(`${birthdate.month} ${birthdate.day}, ${birthdate.year}`);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  // Calculate BMR (Basal Metabolic Rate)
  const calculateBMR = (weight, height, age, gender) => {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'Male' ? base + 5 : base - 161;
  };

  // Get activity factor based on workout frequency
  const getActivityFactor = (workoutFreq) => {
    if (workoutFreq === '0–2') return 1.2;
    if (workoutFreq === '3–5') return 1.375;
    return 1.55; // 6+
  };

  // Calculate target calories based on goal
  const calculateTargetCalories = (tdee, goal, weight) => {
    if (goal === 'Lose weight') return Math.round(tdee - (0.5 * 7700 / 7));
    if (goal === 'Gain weight') return Math.round(tdee * 1.15);
    return Math.round(tdee);
  };

  // Calculate macronutrients
  const calculateMacros = (targetCalories, weight) => {
    const proteinG = Math.round(2.2 * weight);
    const proteinCal = proteinG * 4;
    
    const fatG = Math.round(0.88 * weight);
    const fatCal = fatG * 9;
    
    const carbsCal = targetCalories - (proteinCal + fatCal);
    const carbsG = Math.round(carbsCal / 4);
    
    return {
      protein: proteinG,
      fat: fatG,
      carbs: carbsG,
      calories: targetCalories
    };
  };

  // Calculate nutrition data from user inputs
  const getNutritionData = () => {
    const age = calculateAge(birthdate);
    const bmr = calculateBMR(weight, height, age, gender);
    const activityFactor = getActivityFactor(workoutFreq);
    const tdee = bmr * activityFactor;
    const targetCalories = calculateTargetCalories(tdee, goal, weight);
    const macros = calculateMacros(targetCalories, weight);

    return [
      { name: 'Calories', value: `${macros.calories.toLocaleString()}`, icon: '🔥', color: '#FFCC00' },
      { name: 'Carbs', value: `${macros.carbs}g`, icon: '🌾', color: '#FF9500' },
      { name: 'Protein', value: `${macros.protein}g`, icon: '🍗', color: '#FF3B30' },
      { name: 'Fats', value: `${macros.fat}g`, icon: '💧', color: '#007AFF' }
    ];
  };

  const nutritionData = getNutritionData();

  const handleComplete = () => {
    // Save the calculated nutrition data to localStorage
    const age = calculateAge(birthdate);
    const bmr = calculateBMR(weight, height, age, gender);
    const activityFactor = getActivityFactor(workoutFreq);
    const tdee = bmr * activityFactor;
    const targetCalories = calculateTargetCalories(tdee, goal, weight);
    const macros = calculateMacros(targetCalories, weight);
    
    localStorage.setItem('nutritionData', JSON.stringify({
      calories: targetCalories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat
    }));
    
    onComplete();
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'white',
      height: '100vh',
      fontFamily: "'Manrope', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          fontSize: '64px',
          color: '#4CD964',
          marginBottom: '24px'
        }}>
          ✔
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: '0',
          marginBottom: '8px',
          color: 'black',
        }}>
          Congratulations, your custom plan is ready!
        </h1>
        <p style={{
          fontSize: '16px',
          margin: '0',
          color: '#555',
          marginBottom: '40px',
        }}>
          You should lose: 0.5 kg by {formattedDate}
        </p>

        <div style={{ width: '100%' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0',
            marginBottom: '8px',
            color: 'black',
            textAlign: 'left'
          }}>
            Daily recommendation
          </h2>
          <p style={{
            fontSize: '14px',
            margin: '0',
            color: '#555',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            You can edit this anytime
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '40px'
          }}>
            {nutritionData.map((item) => (
              <div key={item.name} style={{
                backgroundColor: '#f5f5f5',
                borderRadius: '1rem',
                padding: '16px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  fontSize: '16px',
                  color: '#555'
                }}>
                  ✏️
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'black'
                  }}>{item.name}</span>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: item.color,
                  marginBottom: '8px'
                }}>
                  {item.value}
                </div>
                <div style={{
                  height: '4px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: '75%',
                    backgroundColor: item.color,
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleComplete}
        style={{
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '1rem',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          width: '100%',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        Let's get started!
      </button>
    </div>
  );
}
