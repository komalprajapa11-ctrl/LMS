'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Paper, Button, Stack, List, ListItem,
  IconButton, Dialog, DialogContent, DialogActions, TextField, MenuItem,
  Chip, Tooltip, Snackbar, Alert, Skeleton, Fade, Divider,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '@/components/layout/Header';
import AdminSidebar from '@/components/admin/AdminSidebar';
import TopicFormDialog from '@/components/admin/TopicFormDialog';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TitleIcon from '@mui/icons-material/TitleRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { use } from 'react';

interface Section {
  _id?: string;
  type: 'HEADING' | 'TEXT' | 'BULLETS' | 'CODE' | 'NOTE';
  content: string;
  language?: string;
  order: number;
}

interface Topic {
  _id: string;
  title: string;
  order: number;
  sections: Section[];
  createdAt: string;
}

interface SubjectInfo {
  _id: string;
  name: string;
  description: string;
}

const sectionIcon: Record<string, React.ReactNode> = {
  HEADING: <TitleIcon sx={{ fontSize: 16, color: '#7c3aed' }} />,
  TEXT: <TextFieldsIcon sx={{ fontSize: 16, color: '#059669' }} />,
  BULLETS: <FormatListBulletedIcon sx={{ fontSize: 16, color: '#d97706' }} />,
  CODE: <CodeIcon sx={{ fontSize: 16, color: '#2563eb' }} />,
  NOTE: <InfoOutlinedIcon sx={{ fontSize: 16, color: '#dc2626' }} />,
};

const sectionColors: Record<string, string> = {
  HEADING: '#f3f0ff', TEXT: '#ecfdf5', BULLETS: '#fffbeb', CODE: '#eff6ff', NOTE: '#fef2f2',
};

/* ─── Styles ─── */
const styles = {
  pageRoot: { minHeight: '100vh', backgroundColor: 'var(--bg-default)' },
  header: {
    px: 4, py: 3,
    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(25, 118, 210, 0.08) 100%)',
    borderBottom: '1px solid #e2e8f0',
  },
  topicRow: {
    px: 3, py: 2.5, borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.15s ease',
    '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.02)' },
    '&:last-child': { borderBottom: 'none' },
  },
  actionBtn: (color: string) => ({
    width: 34, height: 34, borderRadius: 2,
    border: `1px solid ${color === 'primary' ? '#dbeafe' : color === 'error' ? '#fee2e2' : '#e2e8f0'}`,
    color: color === 'primary' ? 'var(--primary-main)' : color === 'error' ? 'var(--error-main)' : 'var(--text-secondary)',
    '&:hover': {
      backgroundColor: color === 'primary' ? 'rgba(25,118,210,0.08)' : color === 'error' ? 'rgba(211,47,47,0.08)' : '#f8fafc',
      transform: 'scale(1.05)',
    },
    transition: 'all 0.2s ease',
  }),
};

export default function TopicManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: subjectId } = use(params);

  const [subject, setSubject] = useState<SubjectInfo | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [saving, setSaving] = useState(false);

  // Preview
  const [previewTopic, setPreviewTopic] = useState<Topic | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchSubject = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/subjects');
      const data = await res.json();
      const found = data.subjects?.find((s: SubjectInfo) => s._id === subjectId);
      if (found) setSubject(found);
    } catch (err) { console.error(err); }
  }, [subjectId]);

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/topics?subjectId=${subjectId}`);
      const data = await res.json();
      if (res.ok) setTopics(data.topics);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [subjectId]);

  useEffect(() => { fetchSubject(); fetchTopics(); }, [fetchSubject, fetchTopics]);

  const handleSave = async (data: { title: string; sections: Section[] }) => {
    setSaving(true);
    try {
      const url = dialogMode === 'add' ? '/api/admin/topics' : `/api/admin/topics/${editingTopic?._id}`;
      const method = dialogMode === 'add' ? 'POST' : 'PUT';
      const body = dialogMode === 'add' ? { ...data, subjectId } : data;

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await res.json();

      if (res.ok) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        setDialogOpen(false);
        fetchTopics();
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch { setSnackbar({ open: true, message: 'Network error', severity: 'error' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingTopic) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/topics/${deletingTopic._id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        setDeleteOpen(false);
        fetchTopics();
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch { setSnackbar({ open: true, message: 'Network error', severity: 'error' }); }
    finally { setDeleting(false); }
  };

  return (
    <Box sx={styles.pageRoot}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" spacing={4}>
          <AdminSidebar />
          
          <Box sx={{ flex: 1 }}>
            {/* Back button */}
            <Button component={Link} href="/admin" startIcon={<ArrowBackIcon />}
              sx={{ mb: 3, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Back to Subjects
            </Button>

        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={styles.header}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ mb: 0.5, alignItems: 'center' }}>
                  <MenuBookIcon sx={{ color: 'var(--primary-main)' }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    {subject?.name || 'Loading...'}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Manage topics & content — {topics.length} topic{topics.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<AddCircleOutlinedIcon />}
                onClick={() => { setDialogMode('add'); setEditingTopic(null); setDialogOpen(true); }}
                sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700, boxShadow: '0 4px 14px rgba(25,118,210,0.3)' }}>
                Add Topic
              </Button>
            </Stack>
          </Box>

          {/* Topic List */}
          <Box>
            {loading ? (
              <Box sx={{ p: 3 }}>
                {[1, 2, 3].map(i => (
                  <Box key={i} sx={{ py: 2, borderBottom: '1px solid #f1f5f9' }}>
                    <Skeleton variant="text" width="35%" height={28} />
                    <Skeleton variant="text" width="55%" height={18} sx={{ mt: 0.5 }} />
                  </Box>
                ))}
              </Box>
            ) : topics.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Box sx={{ width: 72, height: 72, borderRadius: '50%', mx: 'auto', mb: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(25,118,210,0.06), rgba(25,118,210,0.15))' }}>
                  <MenuBookIcon sx={{ fontSize: 36, color: 'var(--primary-main)', opacity: 0.6 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No topics yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start building content for {subject?.name} by adding your first topic.
                </Typography>
                <Button variant="contained" startIcon={<AddCircleOutlinedIcon />}
                  onClick={() => { setDialogMode('add'); setEditingTopic(null); setDialogOpen(true); }}>
                  Add First Topic
                </Button>
              </Box>
            ) : (
              <Box sx={{ p: 2 }}>
                {topics.map((topic, idx) => (
                  <Accordion key={topic._id} elevation={0} sx={{ 
                    mb: 2, border: '1px solid #e2e8f0', borderRadius: '12px !important',
                    '&:before': { display: 'none' },
                    overflow: 'hidden'
                  }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f8fafc', py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                        <Chip label={idx + 1} size="small" sx={{ 
                          fontWeight: 700, backgroundColor: 'rgba(25,118,210,0.08)', color: 'var(--primary-main)' 
                        }} />
                        <Typography sx={{ fontWeight: 700, flex: 1 }}>{topic.title}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mr: 1 }}>
                          <Tooltip title="Edit Topic" arrow>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDialogMode('edit'); setEditingTopic(topic); setDialogOpen(true); }}
                              sx={styles.actionBtn('primary')}><EditOutlinedIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Topic" arrow>
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDeletingTopic(topic); setDeleteOpen(true); }}
                              sx={styles.actionBtn('error')}><DeleteOutlinedIcon fontSize="small" /></IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3, backgroundColor: 'white' }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                        Topic Content ({topic.sections.length} Sections)
                      </Typography>
                      <Stack spacing={2}>
                        {topic.sections.map((s, i) => (
                          <Box key={i} sx={{ 
                            p: 2, borderRadius: 2, border: '1px solid #f1f5f9',
                            borderLeft: `4px solid ${sectionColors[s.type] === '#f3f0ff' ? '#7c3aed' : sectionColors[s.type] === '#ecfdf5' ? '#059669' : '#2563eb'}` 
                          }}>
                            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                              {sectionIcon[s.type]}
                              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>{s.type}</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ 
                              whiteSpace: 'pre-wrap', 
                              fontFamily: s.type === 'CODE' ? '"Fira Code", monospace' : 'inherit',
                              fontSize: s.type === 'CODE' ? '0.75rem' : '0.85rem'
                            }}>
                              {s.content.length > 200 ? s.content.substring(0, 200) + '...' : s.content}
                            </Typography>
                          </Box>
                        ))}
                        {topic.sections.length === 0 && (
                          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>No content added to this topic yet.</Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
          </Box>
        </Stack>
      </Container>

      {/* Add/Edit Dialog */}
      <TopicFormDialog open={dialogOpen} mode={dialogMode} loading={saving}
        initialData={editingTopic ? { title: editingTopic.title, sections: editingTopic.sections } : undefined}
        onClose={() => setDialogOpen(false)} onSave={handleSave} />

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}>
        <Box sx={{ px: 3, py: 2, background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-main))',
          color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Preview: {previewTopic?.title}</Typography>
          <IconButton size="small" onClick={() => setPreviewOpen(false)} sx={{ color: 'rgba(255,255,255,0.8)' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          {previewTopic?.sections.map((s, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              {s.type === 'HEADING' && (
                <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'var(--font-heading)', mb: 1, borderBottom: '2px solid #e2e8f0', pb: 1 }}>
                  {s.content}
                </Typography>
              )}
              {s.type === 'TEXT' && (
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {s.content}
                </Typography>
              )}
              {s.type === 'BULLETS' && (
                <Box component="ul" sx={{ pl: 3, '& li': { mb: 0.5, color: 'var(--text-secondary)' } }}>
                  {s.content.split('\n').filter(Boolean).map((line, li) => (
                    <li key={li}><Typography variant="body2">{line.replace(/^[-•]\s*/, '')}</Typography></li>
                  ))}
                </Box>
              )}
              {s.type === 'CODE' && (
                <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ px: 2, py: 0.8, backgroundColor: '#2d2d2d', borderBottom: '1px solid #404040' }}>
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
                      {s.language || 'code'}
                    </Typography>
                  </Box>
                  <Box component="pre" sx={{ p: 2, m: 0, color: '#d4d4d4', fontFamily: '"Fira Code", "Consolas", monospace',
                    fontSize: '0.85rem', lineHeight: 1.6, overflowX: 'auto', whiteSpace: 'pre' }}>
                    {s.content}
                  </Box>
                </Box>
              )}
              {s.type === 'NOTE' && (
                <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>{s.content}</Alert>
              )}
            </Box>
          ))}
          {(!previewTopic?.sections || previewTopic.sections.length === 0) && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No content sections to preview.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(211,47,47,0.08)' }}>
            <DeleteOutlinedIcon sx={{ fontSize: 28, color: 'var(--error-main)' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Delete Topic?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Delete <strong>"{deletingTopic?.title}"</strong> and all its sections? This cannot be undone.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Stack>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}
          variant="filled" sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
