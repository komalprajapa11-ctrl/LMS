'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Paper, Button, Stack, List, ListItem,
  IconButton, Chip, Tooltip, Snackbar, Alert, Skeleton, Fade, Divider,
  Accordion, AccordionSummary, AccordionDetails, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '@/components/layout/Header';
import AdminSidebar from '@/components/admin/AdminSidebar';
import TopicFormDialog from '@/components/admin/TopicFormDialog';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SubtitlesIcon from '@mui/icons-material/Subtitles';

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
  parentId: string | null;
  sections: Section[];
}

interface Subject {
  _id: string;
  name: string;
}

export default function CurriculumManagementPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/admin/subjects');
      const data = await res.json();
      if (res.ok) {
        setSubjects(data.subjects);
        if (data.subjects.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(data.subjects[0]._id);
        }
      }
    } catch (err) { console.error(err); }
  };

  const fetchTopics = useCallback(async () => {
    if (!selectedSubjectId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/topics?subjectId=${selectedSubjectId}`);
      const data = await res.json();
      if (res.ok) setTopics(data.topics);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [selectedSubjectId]);

  useEffect(() => { fetchSubjects(); }, []);
  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  const handleSave = async (data: { title: string; sections: Section[]; parentId?: string | null }) => {
    setSaving(true);
    try {
      const url = dialogMode === 'add' ? '/api/admin/topics' : `/api/admin/topics/${editingTopic?._id}`;
      const method = dialogMode === 'add' ? 'POST' : 'PUT';
      const body = dialogMode === 'add' ? { ...data, subjectId: selectedSubjectId } : data;

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

  const deleteTopic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic and all its sub-topics?')) return;
    try {
      const res = await fetch(`/api/admin/topics/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Topic deleted successfully', severity: 'success' });
        fetchTopics();
      }
    } catch (err) { console.error(err); }
  };

  const parentTopics = topics.filter(t => !t.parentId);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" spacing={4}>
          <AdminSidebar />
          
          <Box sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>Curriculum Management</Typography>
                  <Typography variant="body2" color="text.secondary">Design and organize your course topics and lessons</Typography>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<AddCircleOutlinedIcon />}
                  onClick={() => {
                    setDialogMode('add');
                    setEditingTopic(null);
                    setParentId(null);
                    setDialogOpen(true);
                  }}
                  sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}
                >
                  Add Main Topic
                </Button>
              </Stack>

              <Box sx={{ mb: 4, maxWidth: 400 }}>
                <FormControl fullWidth>
                  <InputLabel shrink>Select Subject</InputLabel>
                  <Select
                    value={selectedSubjectId}
                    label="Select Subject"
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    sx={{ borderRadius: 2, backgroundColor: 'white' }}
                  >
                    {subjects.map(s => (
                      <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {loading ? (
                <Stack spacing={2}>
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                </Stack>
              ) : parentTopics.length === 0 ? (
                <Box sx={{ py: 10, textAlign: 'center', backgroundColor: '#f1f5f9', borderRadius: 3, border: '2px dashed #cbd5e1' }}>
                  <MenuBookIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">No topics found for this subject.</Typography>
                  <Button variant="text" sx={{ mt: 1, fontWeight: 700 }} onClick={() => setDialogOpen(true)}>Add your first topic</Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {parentTopics.map((topic, idx) => {
                    const children = topics.filter(t => t.parentId === topic._id);
                    return (
                      <Accordion key={topic._id} elevation={0} sx={{ 
                        border: '1px solid #e2e8f0', borderRadius: '12px !important',
                        '&:before': { display: 'none' },
                        backgroundColor: 'white'
                      }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', pr: 2 }}>
                            <Chip label={idx + 1} size="small" sx={{ fontWeight: 800, backgroundColor: '#f1f5f9' }} />
                            <Typography sx={{ fontWeight: 700, flex: 1 }}>{topic.title}</Typography>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Add Sub-topic">
                                <IconButton size="small" onClick={(e) => {
                                  e.stopPropagation();
                                  setDialogMode('add');
                                  setEditingTopic(null);
                                  setParentId(topic._id);
                                  setDialogOpen(true);
                                }} sx={{ color: '#2563eb' }}>
                                  <AddCircleOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <IconButton size="small" onClick={(e) => {
                                e.stopPropagation();
                                setDialogMode('edit');
                                setEditingTopic(topic);
                                setParentId(null);
                                setDialogOpen(true);
                              }}><EditOutlinedIcon fontSize="small" /></IconButton>
                              <IconButton size="small" color="error" onClick={(e) => {
                                e.stopPropagation();
                                deleteTopic(topic._id);
                              }}><DeleteOutlinedIcon fontSize="small" /></IconButton>
                            </Stack>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Divider sx={{ mb: 2 }} />
                          {children.length === 0 ? (
                            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', pl: 2 }}>
                              No sub-topics added.
                            </Typography>
                          ) : (
                            <List disablePadding>
                              {children.map((child, cIdx) => (
                                <ListItem key={child._id} sx={{ 
                                  px: 2, py: 1.5, mb: 1, 
                                  backgroundColor: '#f8fafc', 
                                  borderRadius: 2,
                                  borderLeft: '4px solid #2563eb'
                                }}>
                                  <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                                    <SubtitlesIcon sx={{ color: '#64748b', fontSize: 18 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>{child.title}</Typography>
                                    <Stack direction="row" spacing={1}>
                                      <IconButton size="small" onClick={() => {
                                        setDialogMode('edit');
                                        setEditingTopic(child);
                                        setParentId(topic._id);
                                        setDialogOpen(true);
                                      }}><EditOutlinedIcon fontSize="small" /></IconButton>
                                      <IconButton size="small" color="error" onClick={() => deleteTopic(child._id)}><DeleteOutlinedIcon fontSize="small" /></IconButton>
                                    </Stack>
                                  </Stack>
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          </Box>
        </Stack>
      </Container>

      <TopicFormDialog 
        open={dialogOpen} 
        mode={dialogMode} 
        loading={saving}
        parentId={parentId}
        initialData={editingTopic ? { title: editingTopic.title, sections: editingTopic.sections } : undefined}
        onClose={() => setDialogOpen(false)} 
        onSave={handleSave} 
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
