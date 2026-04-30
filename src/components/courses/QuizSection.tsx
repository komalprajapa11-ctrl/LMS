'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  Button, 
  Paper,
  Stack,
  LinearProgress
} from '@mui/material';

const QUESTIONS = [
  {
    id: 1,
    question: "What does 'M' in MERN stack stand for?",
    options: ["MySQL", "MongoDB", "MariaDB", "Microsoft SQL"],
    correct: "MongoDB"
  },
  {
    id: 2,
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useMemo", "useEffect", "useCallback"],
    correct: "useEffect"
  }
];

export default function QuizSection() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (selected === QUESTIONS[currentStep].correct) {
      setScore(score + 1);
    }

    if (currentStep + 1 < QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
      setSelected('');
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Quiz Completed!</Typography>
        <Typography variant="h3" color="primary" sx={{ mb: 3 }}>{score} / {QUESTIONS.length}</Typography>
        <Button variant="contained" onClick={() => { setFinished(false); setCurrentStep(0); setScore(0); }}>Retry</Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" color="text.secondary">Question {currentStep + 1} of {QUESTIONS.length}</Typography>
        <LinearProgress variant="determinate" value={((currentStep + 1) / QUESTIONS.length) * 100} sx={{ mt: 1, height: 8, borderRadius: 4 }} />
      </Box>

      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        {QUESTIONS[currentStep].question}
      </Typography>

      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
          <Stack spacing={2}>
            {QUESTIONS[currentStep].options.map((opt) => (
              <Paper 
                key={opt} 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  pl: 2, 
                  borderRadius: 2,
                  borderColor: selected === opt ? 'var(--primary-main)' : '#e2e8f0',
                  backgroundColor: selected === opt ? 'rgba(25, 118, 210, 0.05)' : 'transparent'
                }}
              >
                <FormControlLabel value={opt} control={<Radio />} label={opt} sx={{ width: '100%', m: 0 }} />
              </Paper>
            ))}
          </Stack>
        </RadioGroup>
      </FormControl>

      <Button 
        variant="contained" 
        fullWidth 
        size="large" 
        disabled={!selected} 
        onClick={handleNext}
        sx={{ mt: 4 }}
      >
        {currentStep + 1 === QUESTIONS.length ? 'Finish Quiz' : 'Next Question'}
      </Button>
    </Paper>
  );
}
