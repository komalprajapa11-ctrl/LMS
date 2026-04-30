'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Paper, Button, Stack, Chip,
  Tooltip, Snackbar, Alert, Skeleton, Fade,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, FormControl, InputLabel, Select,
  IconButton, Divider, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import Header from '@/components/layout/Header';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

interface IQ {
  _id: string;
  subjectId: string;
  question: string;
  answer: string;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  tags: string[];
  createdAt: string;
}

interface Subject { _id: string; name: string; }

const DIFFICULTIES = ['BASIC', 'INTERMEDIATE', 'ADVANCED'] as const;
const CATEGORIES   = ['Conceptual', 'Coding', 'Behavioral', 'System Design', 'Other'];
const DIFF_COLOR: Record<string, 'success' | 'warning' | 'error'> = {
  BASIC: 'success', INTERMEDIATE: 'warning', ADVANCED: 'error',
};

const EMPTY_FORM = {
  subjectId: '', question: '', answer: '',
  difficulty: 'BASIC' as const, category: 'Conceptual', tags: '',
};

export default function AdminInterviewQuestionsPage() {
  const [subjects,   setSubjects]   = useState<Subject[]>([]);
  const [questions,  setQuestions]  = useState<IQ[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filterDiff, setFilterDiff] = useState('ALL');
  const [filterSub,  setFilterSub]  = useState('ALL');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode,       setMode]       = useState<'add' | 'edit'>('add');
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [form,       setForm]       = useState({ ...EMPTY_FORM });

  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [deleting,   setDeleting]   = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const showSnack = (message: string, severity: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, message, severity });

  /* ── Fetchers ── */
  const fetchSubjects = async () => {
    const res = await fetch('/api/admin/subjects');
    const data = await res.json();
    if (res.ok) setSubjects(data.subjects);
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/interview-questions');
      const data = await res.json();
      if (res.ok) setQuestions(data.questions);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSubjects(); fetchQuestions(); }, [fetchQuestions]);

  /* ── Dialog helpers ── */
  const openAdd = () => {
    setMode('add');
    setEditingId(null);
    setForm({ ...EMPTY_FORM, subjectId: subjects[0]?._id || '' });
    setDialogOpen(true);
  };

  const openEdit = (q: IQ) => {
    setMode('edit');
    setEditingId(q._id);
    setForm({
      subjectId: q.subjectId,
      question: q.question,
      answer: q.answer,
      difficulty: q.difficulty,
      category: q.category,
      tags: q.tags.join(', '),
    });
    setDialogOpen(true);
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim() || !form.subjectId) {
      showSnack('Subject, question and answer are required', 'error'); return;
    }
    setSaving(true);
    try {
      const url    = mode === 'add' ? '/api/admin/interview-questions' : `/api/admin/interview-questions/${editingId}`;
      const method = mode === 'add' ? 'POST' : 'PUT';
      const body   = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await res.json();
      if (res.ok) {
        showSnack(result.message);
        setDialogOpen(false);
        fetchQuestions();
      } else {
        showSnack(result.message, 'error');
      }
    } catch { showSnack('Network error', 'error'); }
    finally { setSaving(false); }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/interview-questions/${deleteId}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok) { showSnack(result.message); fetchQuestions(); }
      else showSnack(result.message, 'error');
    } finally { setDeleting(false); setDeleteId(null); }
  };

  /* ── Filtered list ── */
  const filtered = questions.filter((q) => {
    const matchSearch = !search ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.answer.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = filterDiff === 'ALL' || q.difficulty === filterDiff;
    const matchSub  = filterSub  === 'ALL' || q.subjectId  === filterSub;
    return matchSearch && matchDiff && matchSub;
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" spacing={4}>
          <AdminSidebar />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>

              {/* Header */}
              <Box sx={{ px: 4, py: 3, background: 'linear-gradient(135deg, rgba(25,118,210,0.03), rgba(25,118,210,0.08))', borderBottom: '1px solid #e2e8f0' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Interview Questions</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage Q&amp;A prep material — {questions.length} total
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlinedIcon />}
                    onClick={openAdd}
                    sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, boxShadow: '0 4px 14px rgba(25,118,210,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(25,118,210,0.4)', transform: 'translateY(-1px)' }, transition: 'all 0.2s' }}
                  >
                    Add Question
                  </Button>
                </Stack>
              </Box>

              {/* Filters */}
              <Box sx={{ px: 4, py: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search questions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> } }}
                  sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Subject</InputLabel>
                  <Select value={filterSub} label="Subject" onChange={(e) => setFilterSub(e.target.value)} sx={{ borderRadius: 2 }}>
                    <MenuItem value="ALL">All Subjects</MenuItem>
                    {subjects.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Difficulty</InputLabel>
                  <Select value={filterDiff} label="Difficulty" onChange={(e) => setFilterDiff(e.target.value)} sx={{ borderRadius: 2 }}>
                    <MenuItem value="ALL">All Levels</MenuItem>
                    {DIFFICULTIES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {filtered.length} of {questions.length} shown
                </Typography>
              </Box>

              {/* List */}
              <Box sx={{ p: 3 }}>
                {loading ? (
                  <Stack spacing={2}>
                    {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 2 }} />)}
                  </Stack>
                ) : filtered.length === 0 ? (
                  <Box sx={{ py: 10, textAlign: 'center' }}>
                    <ContactSupportIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No questions found.</Typography>
                    <Button variant="contained" startIcon={<AddCircleOutlinedIcon />} onClick={openAdd} sx={{ mt: 3, borderRadius: 2 }}>
                      Add First Question
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={1.5}>
                    {filtered.map((q, idx) => (
                      <Fade in key={q._id} timeout={150 + idx * 40}>
                        <Accordion
                          elevation={0}
                          sx={{ border: '1px solid #e2e8f0', borderRadius: '12px !important', '&:before': { display: 'none' }, '&.Mui-expanded': { borderColor: '#2563eb' } }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 3, py: 1 }}>
                            <Stack direction="row" spacing={2} sx={{ flex: 1, mr: 2, alignItems: 'center' }}>
                              <Chip label={idx + 1} size="small" sx={{ minWidth: 28, height: 28, borderRadius: '8px', fontWeight: 700, backgroundColor: 'rgba(25,118,210,0.08)', color: 'primary.main' }} />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.93rem', color: 'var(--text-primary)', lineHeight: 1.4 }} noWrap>
                                  {q.question}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                  <Chip label={q.difficulty} size="small" color={DIFF_COLOR[q.difficulty]} variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                                  <Chip label={q.category} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
                                  <Chip label={subjects.find((s) => s._id === q.subjectId)?.name || 'Subject'} size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                                </Stack>
                              </Box>
                              <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
                                <Tooltip title="Edit">
                                  <IconButton size="small" onClick={() => openEdit(q)} sx={{ borderRadius: 1.5, border: '1px solid #dbeafe', color: 'primary.main', '&:hover': { backgroundColor: 'rgba(25,118,210,0.08)' } }}>
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton size="small" onClick={() => setDeleteId(q._id)} sx={{ borderRadius: 1.5, border: '1px solid #fee2e2', color: 'error.main', '&:hover': { backgroundColor: 'rgba(211,47,47,0.06)' } }}>
                                    <DeleteOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </AccordionSummary>
                          <AccordionDetails sx={{ px: 3, pt: 0, pb: 2.5 }}>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', display: 'block', mb: 1 }}>Answer</Typography>
                            <Typography sx={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: 1.85, fontSize: '0.93rem' }}>
                              {q.answer}
                            </Typography>
                            {q.tags.length > 0 && (
                              <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 2 }}>
                                {q.tags.map((t) => <Chip key={t} label={t} size="small" sx={{ fontSize: '0.72rem', height: 22, backgroundColor: '#f1f5f9' }} />)}
                              </Stack>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </Fade>
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}>
        <Box sx={{ px: 3, py: 2.5, background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <ContactSupportIcon sx={{ fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
              {mode === 'add' ? 'Add Interview Question' : 'Edit Interview Question'}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={() => setDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Subject *</InputLabel>
                <Select value={form.subjectId} label="Subject *" onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
                  {subjects.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select value={form.difficulty} label="Difficulty" onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}>
                  {DIFFICULTIES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Question *"
              fullWidth
              multiline
              rows={3}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="e.g. What is the difference between let, const, and var in JavaScript?"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Answer *"
              fullWidth
              multiline
              rows={6}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Write a detailed answer..."
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Tags (comma-separated)"
              fullWidth
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. javascript, es6, variables"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 3, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={saving} sx={{ px: 3 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}>
            {saving ? 'Saving...' : mode === 'add' ? 'Add Question' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(211,47,47,0.08)' }}>
            <DeleteOutlinedIcon sx={{ fontSize: 28, color: 'error.main' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Delete Question?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>This action cannot be undone.</Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => setDeleteId(null)} disabled={deleting} sx={{ px: 3 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting} sx={{ px: 3 }}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
