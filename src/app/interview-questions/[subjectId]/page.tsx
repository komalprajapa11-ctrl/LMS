'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box, Container, Typography, Paper, Stack, Chip, Button,
  Accordion, AccordionSummary, AccordionDetails, Skeleton,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Divider, Avatar, LinearProgress, Alert,
} from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import InputAdornment from '@mui/material/InputAdornment';

interface IQ {
  _id: string;
  question: string;
  answer: string;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  tags: string[];
}

interface Subject { _id: string; name: string; description: string; }

const DIFF_COLOR: Record<string, 'success' | 'warning' | 'error'> = {
  BASIC: 'success', INTERMEDIATE: 'warning', ADVANCED: 'error',
};

const DIFF_BG: Record<string, string> = {
  BASIC:        'linear-gradient(135deg,#10b981,#059669)',
  INTERMEDIATE: 'linear-gradient(135deg,#f59e0b,#d97706)',
  ADVANCED:     'linear-gradient(135deg,#ef4444,#dc2626)',
};

export default function InterviewQuestionsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const [subject,   setSubject]   = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<IQ[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filterDiff, setFilterDiff] = useState('ALL');
  const [filterCat,  setFilterCat]  = useState('ALL');
  const [revealed,  setRevealed]  = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!subjectId) return;
    (async () => {
      setLoading(true);
      try {
        const [subRes, qRes] = await Promise.all([
          fetch(`/api/subjects`),
          fetch(`/api/interview-questions?subjectId=${subjectId}`),
        ]);
        const subData = await subRes.json();
        const qData   = await qRes.json();
        const found   = subData.subjects?.find((s: Subject) => s._id === subjectId);
        if (found)          setSubject(found);
        if (qRes.ok)        setQuestions(qData.questions || []);
      } finally { setLoading(false); }
    })();
  }, [subjectId]);

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const categories = ['ALL', ...Array.from(new Set(questions.map((q) => q.category)))];

  const filtered = questions.filter((q) => {
    const matchSearch = !search ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = filterDiff === 'ALL' || q.difficulty === filterDiff;
    const matchCat  = filterCat  === 'ALL' || q.category  === filterCat;
    return matchSearch && matchDiff && matchCat;
  });

  const stats = {
    total:        questions.length,
    basic:        questions.filter((q) => q.difficulty === 'BASIC').length,
    intermediate: questions.filter((q) => q.difficulty === 'INTERMEDIATE').length,
    advanced:     questions.filter((q) => q.difficulty === 'ADVANCED').length,
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />

      {/* ── Hero Banner ── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c1a3a 100%)',
        py: { xs: 8, md: 10 }, mb: 0, position: 'relative', overflow: 'hidden',
      }}>
        {/* dot pattern */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <Box sx={{ position: 'absolute', top: '50%', right: -80, transform: 'translateY(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Button component={Link} href="/" startIcon={<ArrowBackIcon />}
            sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontWeight: 600, '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.06)' }, borderRadius: 2 }}>
            Back to Subjects
          </Button>

          <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
            <Box sx={{ width: 50, height: 50, borderRadius: '14px', background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ContactSupportIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Chip label="Interview Prep" sx={{ backgroundColor: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', fontWeight: 700 }} />
          </Stack>

          <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-1px', mb: 1.5, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            {loading ? 'Loading...' : subject?.name} — Interview Questions
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: 600 }}>
            Practice the most frequently asked interview questions. Reveal answers when ready.
          </Typography>

          {/* Stats Row */}
          <Stack direction="row" spacing={3} sx={{ mt: 5, flexWrap: 'wrap', gap: 2 }}>
            {[
              { label: 'Total Questions', value: stats.total,        bg: DIFF_BG.ADVANCED },
              { label: 'Basic',           value: stats.basic,        bg: DIFF_BG.BASIC },
              { label: 'Intermediate',    value: stats.intermediate, bg: DIFF_BG.INTERMEDIATE },
              { label: 'Advanced',        value: stats.advanced,     bg: DIFF_BG.ADVANCED },
            ].map((s) => (
              <Box key={s.label} sx={{ textAlign: 'center', minWidth: 90 }}>
                <Typography sx={{ fontWeight: 900, fontSize: '2rem', color: '#fff', lineHeight: 1 }}>{s.value}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{s.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>

          {/* ── Sidebar Filters ── */}
          <Box sx={{ width: { md: 280 }, flexShrink: 0 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', p: 3, position: 'sticky', top: 90 }}>
              <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: 1, color: '#475569' }}>
                Filters
              </Typography>

              <TextField
                fullWidth size="small" placeholder="Search questions..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> } }}
                sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', display: 'block', mb: 1.5 }}>Difficulty</Typography>
              <Stack spacing={0.75} sx={{ mb: 3 }}>
                {['ALL', 'BASIC', 'INTERMEDIATE', 'ADVANCED'].map((d) => (
                  <Button key={d} onClick={() => setFilterDiff(d)} fullWidth
                    variant={filterDiff === d ? 'contained' : 'text'}
                    sx={{ justifyContent: 'flex-start', fontWeight: 700, borderRadius: 2, textTransform: 'none', py: 0.8,
                      ...(filterDiff === d ? {} : { color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }) }}>
                    {d === 'ALL' ? 'All Levels' : d.charAt(0) + d.slice(1).toLowerCase()}
                  </Button>
                ))}
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', display: 'block', mb: 1.5 }}>Category</Typography>
              <Stack spacing={0.75}>
                {categories.map((c) => (
                  <Button key={c} onClick={() => setFilterCat(c)} fullWidth
                    variant={filterCat === c ? 'contained' : 'text'}
                    sx={{ justifyContent: 'flex-start', fontWeight: 700, borderRadius: 2, textTransform: 'none', py: 0.8,
                      ...(filterCat === c ? {} : { color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }) }}>
                    {c === 'ALL' ? 'All Categories' : c}
                  </Button>
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />
              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#0369a1', mb: 0.5 }}>💡 Pro Tip</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#0369a1', lineHeight: 1.6 }}>
                  Try answering in your head before revealing. It improves retention by 40%!
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* ── Questions List ── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Progress */}
            {!loading && questions.length > 0 && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', mb: 3 }}>
                <Stack direction="row" sx={{ mb: 1.5, justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>
                    Revealed: {revealed.size} / {filtered.length}
                  </Typography>
                  <Button size="small" onClick={() => setRevealed(new Set())} sx={{ fontWeight: 700, textTransform: 'none', color: '#64748b' }}>Reset All</Button>
                </Stack>
                <LinearProgress variant="determinate" value={filtered.length ? (revealed.size / filtered.length) * 100 : 0}
                  sx={{ height: 8, borderRadius: 8, backgroundColor: '#e2e8f0', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#6366f1,#0ea5e9)', borderRadius: 8 } }} />
              </Paper>
            )}

            {loading ? (
              <Stack spacing={2}>
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 3 }} />)}
              </Stack>
            ) : filtered.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                No questions found for the selected filters.
              </Alert>
            ) : (
              <Stack spacing={2}>
                {filtered.map((q, idx) => {
                  const isRevealed = revealed.has(q._id);
                  return (
                    <Paper key={q._id} elevation={0}
                      sx={{ borderRadius: 3, border: '1px solid', borderColor: isRevealed ? '#c7d2fe' : '#e2e8f0', transition: 'border-color 0.2s', overflow: 'hidden' }}>
                      {/* Question Header */}
                      <Box sx={{ px: 3, py: 2.5 }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', fontWeight: 800, background: DIFF_BG[q.difficulty], flexShrink: 0, mt: 0.3 }}>
                            {idx + 1}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                              <Chip label={q.difficulty} size="small" color={DIFF_COLOR[q.difficulty]} sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                              <Chip label={q.category} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
                            </Stack>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', lineHeight: 1.6, mb: 2 }}>
                              {q.question}
                            </Typography>
                            <Button
                              startIcon={<LightbulbOutlinedIcon />}
                              onClick={() => toggleReveal(q._id)}
                              variant={isRevealed ? 'contained' : 'outlined'}
                              size="small"
                              sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', fontSize: '0.82rem',
                                ...(isRevealed
                                  ? { background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', boxShadow: 'none' }
                                  : { borderColor: '#6366f1', color: '#6366f1', '&:hover': { backgroundColor: 'rgba(99,102,241,0.06)' } }) }}>
                              {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                            </Button>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Answer */}
                      {isRevealed && (
                        <Box sx={{ px: 3, pb: 3 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Box sx={{ backgroundColor: '#f8fafc', borderRadius: 2, p: 3, borderLeft: '4px solid #6366f1' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6366f1', display: 'block', mb: 1.5 }}>
                              ✅ Answer
                            </Typography>
                            <Typography sx={{ whiteSpace: 'pre-line', color: '#334155', lineHeight: 1.85, fontSize: '0.94rem' }}>
                              {q.answer}
                            </Typography>
                          </Box>
                          {q.tags.length > 0 && (
                            <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 2 }}>
                              {q.tags.map((t) => (
                                <Chip key={t} label={`#${t}`} size="small" sx={{ fontSize: '0.72rem', height: 22, backgroundColor: '#ede9fe', color: '#7c3aed', fontWeight: 600 }} />
                              ))}
                            </Stack>
                          )}
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
      <Footer />
    </Box>
  );
}
