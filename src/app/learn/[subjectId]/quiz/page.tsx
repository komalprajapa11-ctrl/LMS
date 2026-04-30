'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Button, Stack, Radio,
  RadioGroup, FormControlLabel, FormControl, LinearProgress,
  Fade, Alert, Chip, Divider, IconButton
} from '@mui/material';
import Header from '@/components/layout/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TimerIcon from '@mui/icons-material/Timer';
import Link from 'next/link';
import { use } from 'react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  difficulty: string;
}

export default function SubjectQuizPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(`/api/quizzes?subjectId=${subjectId}`);
        const data = await res.json();
        if (res.ok && data.quizzes.length > 0) {
          setQuizzes(data.quizzes);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchQuizzes();
  }, [subjectId]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizStarted(true);
    setCurrentQuestionIdx(0);
    setScore(0);
    setQuizFinished(false);
    setUserAnswers([]);
    setSelectedAnswer(null);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === activeQuiz?.questions[currentQuestionIdx].correctAnswer;
    if (isCorrect) setScore(s => s + 1);

    const nextIdx = currentQuestionIdx + 1;
    setUserAnswers([...userAnswers, selectedAnswer]);

    if (nextIdx < (activeQuiz?.questions.length || 0)) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) return <Box sx={{ py: 10, textAlign: 'center' }}><LinearProgress /></Box>;

  if (!quizStarted) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Button component={Link} href={`/learn/${subjectId}`} startIcon={<ArrowBackIcon />} sx={{ mb: 4, fontWeight: 700 }}>
            Back to Tutorials
          </Button>
          
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>Assessment Center</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>Test your knowledge and earn badges for your profile.</Typography>

          {quizzes.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 3 }}>No quizzes available for this subject yet. Stay tuned!</Alert>
          ) : (
            <Stack spacing={3}>
              {quizzes.map((quiz) => (
                <Paper key={quiz._id} elevation={0} sx={{ 
                  p: 4, borderRadius: 4, border: '1px solid #e2e8f0',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Chip label={quiz.difficulty} size="small" sx={{ 
                      fontWeight: 800, 
                      backgroundColor: quiz.difficulty === 'ADVANCED' ? '#fee2e2' : quiz.difficulty === 'INTERMEDIATE' ? '#fffbeb' : '#ecfdf5',
                      color: quiz.difficulty === 'ADVANCED' ? '#991b1b' : quiz.difficulty === 'INTERMEDIATE' ? '#92400e' : '#065f46'
                    }} />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimerIcon sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>{quiz.questions.length * 2} MINS</Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{quiz.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{quiz.description}</Typography>
                  <Button variant="contained" fullWidth onClick={() => startQuiz(quiz)} sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}>
                    Start Assessment
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}
        </Container>
      </Box>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / (activeQuiz?.questions.length || 1)) * 100);
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Header />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Paper elevation={0} sx={{ p: 6, borderRadius: 5, border: '1px solid #e2e8f0', backgroundColor: 'white' }}>
            <Box sx={{ mb: 4 }}>
              {percentage >= 70 ? (
                <CheckCircleIcon sx={{ fontSize: 80, color: '#059669', mb: 2 }} />
              ) : (
                <ErrorIcon sx={{ fontSize: 80, color: '#dc2626', mb: 2 }} />
              )}
              <Typography variant="h3" sx={{ fontWeight: 900 }}>{percentage}% Score</Typography>
              <Typography variant="h6" color="text.secondary">
                You got {score} out of {activeQuiz?.questions.length} questions correct.
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={() => setQuizStarted(false)} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}>
                Other Quizzes
              </Button>
              <Button variant="contained" component={Link} href={`/learn/${subjectId}`} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}>
                Continue Learning
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  const currentQuestion = activeQuiz?.questions[currentQuestionIdx];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b' }}>
              QUESTION {currentQuestionIdx + 1} OF {activeQuiz?.questions.length}
            </Typography>
            <Chip label={activeQuiz?.title} size="small" sx={{ fontWeight: 700 }} />
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={((currentQuestionIdx) / (activeQuiz?.questions.length || 1)) * 100} 
            sx={{ height: 10, borderRadius: 5, backgroundColor: '#e2e8f0' }}
          />
        </Box>

        <Fade in key={currentQuestionIdx}>
          <Paper elevation={0} sx={{ p: 5, borderRadius: 5, border: '1px solid #e2e8f0' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, lineHeight: 1.4 }}>
              {currentQuestion?.question}
            </Typography>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup value={selectedAnswer} onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}>
                <Stack spacing={2}>
                  {currentQuestion?.options.map((option, idx) => (
                    <Paper key={idx} variant="outlined" sx={{ 
                      p: 1, borderRadius: 3, 
                      borderColor: selectedAnswer === idx ? '#2563eb' : '#e2e8f0',
                      backgroundColor: selectedAnswer === idx ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                      transition: 'all 0.2s'
                    }}>
                      <FormControlLabel 
                        value={idx} 
                        control={<Radio sx={{ ml: 1 }} />} 
                        label={<Typography sx={{ fontWeight: 600, py: 1 }}>{option}</Typography>} 
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 6, textAlign: 'right' }}>
              <Button 
                variant="contained" 
                size="large"
                disabled={selectedAnswer === null}
                onClick={handleNext}
                sx={{ px: 6, py: 1.8, borderRadius: 3, fontWeight: 800, boxShadow: '0 8px 20px rgba(37,99,235,0.2)' }}
              >
                {currentQuestionIdx === (activeQuiz?.questions.length || 0) - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
