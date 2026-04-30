'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Paper, Button, Stack, List, ListItem,
  IconButton, Chip, Tooltip, Snackbar, Alert, Skeleton, Fade, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  FormControl, InputLabel, Select
} from '@mui/material';
import Header from '@/components/layout/Header';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import CloseIcon from '@mui/icons-material/Close';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  _id: string;
  subjectId: string;
  title: string;
  description: string;
  questions: Question[];
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
}

interface Subject {
  _id: string;
  name: string;
}

export default function AdminQuizzesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'BASIC' | 'INTERMEDIATE' | 'ADVANCED'>('BASIC');
  const [questions, setQuestions] = useState<Question[]>([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/admin/subjects');
      const data = await res.json();
      if (res.ok) setSubjects(data.subjects);
    } catch (err) { console.error(err); }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/quizzes'); // Need to create this API
      const data = await res.json();
      if (res.ok) setQuizzes(data.quizzes);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSubjects(); fetchQuizzes(); }, []);

  const openAdd = () => {
    setDialogMode('add');
    setEditingQuiz(null);
    setSubjectId(subjects[0]?._id || '');
    setTitle('');
    setDescription('');
    setDifficulty('BASIC');
    setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = dialogMode === 'add' ? '/api/admin/quizzes' : `/api/admin/quizzes/${editingQuiz?._id}`;
      const method = dialogMode === 'add' ? 'POST' : 'PUT';
      const body = { subjectId, title, description, difficulty, questions };

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await res.json();

      if (res.ok) {
        setSnackbar({ open: true, message: 'Quiz saved successfully', severity: 'success' });
        setDialogOpen(false);
        fetchQuizzes();
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch { setSnackbar({ open: true, message: 'Network error', severity: 'error' }); }
    finally { setSaving(false); }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[idx] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" spacing={4}>
          <AdminSidebar />
          
          <Box sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Stack direction="row" spacing={2} sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>Quiz Management</Typography>
                  <Typography variant="body2" color="text.secondary">Create and manage assessments for all subjects</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddCircleOutlinedIcon />} onClick={openAdd} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}>
                  Create New Quiz
                </Button>
              </Stack>

              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : quizzes.length === 0 ? (
                <Box sx={{ py: 10, textAlign: 'center' }}>
                  <QuizIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">No quizzes found.</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {quizzes.map((quiz) => (
                    <Paper key={quiz._id} variant="outlined" sx={{ p: 3, borderRadius: 3, transition: '0.2s', '&:hover': { borderColor: '#2563eb' } }}>
                      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                            <Chip label={subjects.find(s => s._id === quiz.subjectId)?.name || 'Subject'} size="small" color="primary" sx={{ fontWeight: 700 }} />
                            <Chip label={quiz.difficulty} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                          </Stack>
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>{quiz.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{quiz.questions.length} Questions</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <IconButton onClick={() => {
                            setDialogMode('edit');
                            setEditingQuiz(quiz);
                            setSubjectId(quiz.subjectId);
                            setTitle(quiz.title);
                            setDescription(quiz.description);
                            setDifficulty(quiz.difficulty);
                            setQuestions(quiz.questions);
                            setDialogOpen(true);
                          }}><EditOutlinedIcon /></IconButton>
                          <IconButton color="error"><DeleteOutlinedIcon /></IconButton>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* Add/Edit Quiz Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle component="div" sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{dialogMode === 'add' ? 'Create New Quiz' : 'Edit Quiz'}</Typography>
          <IconButton onClick={() => setDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select value={subjectId} label="Subject" onChange={(e) => setSubjectId(e.target.value)}>
                {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Quiz Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Description" fullWidth multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select value={difficulty} label="Difficulty" onChange={(e) => setDifficulty(e.target.value as any)}>
                <MenuItem value="BASIC">BASIC</MenuItem>
                <MenuItem value="INTERMEDIATE">INTERMEDIATE</MenuItem>
                <MenuItem value="ADVANCED">ADVANCED</MenuItem>
              </Select>
            </FormControl>

            <Divider />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Questions ({questions.length})</Typography>
            
            {questions.map((q, qIdx) => (
              <Paper key={qIdx} variant="outlined" sx={{ p: 3, borderRadius: 2, backgroundColor: '#f8fafc' }}>
                <Stack spacing={2}>
                  <TextField label={`Question ${qIdx + 1}`} fullWidth value={q.question} onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)} />
                  <Grid container spacing={2}>
                    {q.options.map((opt, oIdx) => (
                      <Grid item xs={6} key={oIdx}>
                        <TextField 
                          label={`Option ${oIdx + 1}`} 
                          fullWidth size="small" 
                          value={opt} 
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} 
                          color={q.correctAnswer === oIdx ? 'success' : 'primary'}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <FormControl fullWidth size="small">
                    <InputLabel>Correct Answer</InputLabel>
                    <Select value={q.correctAnswer} label="Correct Answer" onChange={(e) => updateQuestion(qIdx, 'correctAnswer', e.target.value)}>
                      {q.options.map((_, i) => <MenuItem key={i} value={i}>Option {i + 1}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>
              </Paper>
            ))}
            <Button startIcon={<AddCircleOutlinedIcon />} onClick={addQuestion}>Add Question</Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}>
            {saving ? 'Saving...' : 'Save Quiz'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

// Helper Grid component
function Grid({ children, container, item, spacing, xs }: any) {
  return (
    <Box sx={{ 
      display: container ? 'flex' : 'block', 
      flexWrap: 'wrap',
      margin: container ? `-${(spacing || 0) * 4}px` : 0,
      width: item ? `${(xs / 12) * 100}%` : 'auto',
      padding: item ? `${(spacing || 0) * 4}px` : 0
    }}>
      {children}
    </Box>
  );
}
