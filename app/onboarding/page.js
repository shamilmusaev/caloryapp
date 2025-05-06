'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeScreen from './components/WelcomeScreen';
import ValuePropScreen from './components/ValuePropScreen';
import HeightWeightScreen from './components/HeightWeightScreen';
import WorkoutFrequencyScreen from './components/WorkoutFrequencyScreen';
import GoalSelectionScreen from './components/GoalSelectionScreen';
import GenderSelectionScreen from './components/GenderSelectionScreen';
import BirthdateScreen from './components/BirthdateScreen';
import PlanSummaryScreen from './components/PlanSummaryScreen';

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('welcome');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [workoutFreq, setWorkoutFreq] = useState(null);
  const [goal, setGoal] = useState(null);
  const [gender, setGender] = useState(null);
  const [birthdate, setBirthdate] = useState({
    month: '',
    day: '',
    year: ''
  });

  const handleGetStarted = () => setCurrentStep('value-prop');
  const handleContinueValueProp = () => setCurrentStep('height-weight');
  
  const handleSaveMeasurements = () => {
    localStorage.setItem('userHeight', height);
    localStorage.setItem('userWeight', weight);
    setCurrentStep('workout-freq');
  };

  const handleSaveWorkoutFreq = () => {
    localStorage.setItem('workoutFrequency', workoutFreq);
    setCurrentStep('goal-selection');
  };

  const handleSaveGoal = () => {
    localStorage.setItem('userGoal', goal);
    setCurrentStep('gender-selection');
  };

  const handleSaveGender = () => {
    localStorage.setItem('userGender', gender);
    setCurrentStep('birthdate');
  };

  const handleSaveBirthdate = () => {
    localStorage.setItem('userBirthdate', JSON.stringify(birthdate));
    setCurrentStep('plan-summary');
  };

  const handleCompleteOnboarding = () => {
    router.push('/dashboard');
  };

  const handleBack = () => {
    if (currentStep === 'value-prop') setCurrentStep('welcome');
    else if (currentStep === 'height-weight') setCurrentStep('value-prop');
    else if (currentStep === 'workout-freq') setCurrentStep('height-weight');
    else if (currentStep === 'goal-selection') setCurrentStep('workout-freq');
    else if (currentStep === 'gender-selection') setCurrentStep('goal-selection');
    else if (currentStep === 'birthdate') setCurrentStep('gender-selection');
    else if (currentStep === 'plan-summary') setCurrentStep('birthdate');
  };

  switch(currentStep) {
    case 'welcome':
      return <WelcomeScreen onGetStarted={handleGetStarted} />;
    case 'value-prop':
      return <ValuePropScreen onContinue={handleContinueValueProp} onBack={handleBack} />;
    case 'height-weight':
      return (
        <HeightWeightScreen
          onSave={handleSaveMeasurements}
          onBack={handleBack}
          height={height}
          weight={weight}
          setHeight={setHeight}
          setWeight={setWeight}
        />
      );
    case 'workout-freq':
      return (
        <WorkoutFrequencyScreen
          onSave={handleSaveWorkoutFreq}
          onBack={handleBack}
          workoutFreq={workoutFreq}
          setWorkoutFreq={setWorkoutFreq}
        />
      );
    case 'goal-selection':
      return (
        <GoalSelectionScreen
          onSave={handleSaveGoal}
          onBack={handleBack}
          goal={goal}
          setGoal={setGoal}
        />
      );
    case 'gender-selection':
      return (
        <GenderSelectionScreen
          onSave={handleSaveGender}
          onBack={handleBack}
          gender={gender}
          setGender={setGender}
        />
      );
    case 'birthdate':
      return (
        <BirthdateScreen
          onSave={handleSaveBirthdate}
          onBack={handleBack}
          birthdate={birthdate}
          setBirthdate={setBirthdate}
        />
      );
    case 'plan-summary':
      return (
        <PlanSummaryScreen 
          onComplete={handleCompleteOnboarding}
          height={parseFloat(height)}
          weight={parseFloat(weight)}
          workoutFreq={workoutFreq}
          goal={goal}
          gender={gender}
          birthdate={birthdate}
        />
      );
    default:
      return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }
}
