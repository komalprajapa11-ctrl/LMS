'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Skeleton,
  Fade,
} from '@mui/material';
import Header from '@/components/layout/Header';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import QuizIcon from '@mui/icons-material/Quiz';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Link from 'next/link';

/* ─── Types ─── */
interface Subject {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

/* ─── Styles ─── */
const styles = {
  pageRoot: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-default)',
  },
  sidebar: {
    p: 0,
    borderRadius: 3,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  sidebarHeader: {
    px: 2.5,
    py: 2,
    fontWeight: 800,
    fontFamily: 'var(--font-heading)',
    fontSize: '1.1rem',
    background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-main) 100%)',
    color: 'white',
  },
  sidebarItem: (active: boolean) => ({
    py: 1.5,
    px: 2.5,
    borderLeft: active ? '3px solid var(--primary-main)' : '3px solid transparent',
    backgroundColor: active ? 'rgba(25, 118, 210, 0.06)' : 'transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  }),
  mainPaper: {
    p: 0,
    borderRadius: 3,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  mainHeader: {
    px: 4,
    py: 3,
    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(25, 118, 210, 0.08) 100%)',
    borderBottom: '1px solid #e2e8f0',
  },
  subjectRow: {
    px: 3,
    py: 2,
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.02)',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  dialogTitle: {
    px: 3,
    py: 2.5,
    background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-main) 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionBtn: (color: string) => ({
    width: 36,
    height: 36,
    borderRadius: 2,
    border: `1px solid ${color === 'primary' ? '#dbeafe' : '#fee2e2'}`,
    color: color === 'primary' ? 'var(--primary-main)' : 'var(--error-main)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: color === 'primary' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(211, 47, 47, 0.08)',
      transform: 'scale(1.05)',
    },
  }),
  emptyState: {
    py: 8,
    textAlign: 'center',
  },
  indexChip: {
    minWidth: 32,
    height: 32,
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '0.8rem',
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    color: 'var(--primary-main)',
  },
};

/* ─── Delete Confirmation Dialog ─── */
function DeleteConfirmDialog({
  open,
  subjectName,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  subjectName: string;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{
          width: 56, height: 56, borderRadius: '50%', mx: 'auto', mb: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(211, 47, 47, 0.08)',
        }}>
          <DeleteOutlineIcon sx={{ fontSize: 28, color: 'var(--error-main)' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Delete Subject?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Are you sure you want to delete <strong>"{subjectName}"</strong>? This action cannot be undone.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
          <Button variant="outlined" onClick={onClose} disabled={loading} sx={{ px: 3 }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={onConfirm} disabled={loading} sx={{ px: 3 }}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

/* ─── Add/Edit Subject Dialog ─── */
function SubjectDialog({
  open,
  mode,
  initialData,
  onClose,
  onSave,
  loading,
}: {
  open: boolean;
  mode: 'add' | 'edit';
  initialData: { name: string; description: string };
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
  loading: boolean;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialData.name);
      setDescription(initialData.description);
      setNameError('');
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Subject name is required');
      return;
    }
    setNameError('');
    onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
    >
      <Box sx={styles.dialogTitle}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <MenuBookIcon sx={{ fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {mode === 'add' ? 'Add New Subject' : 'Edit Subject'}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <Stack spacing={3}>
          <TextField
            label="Subject Name"
            placeholder="e.g. MongoDB, React.js, Node.js"
            fullWidth
            required
            autoFocus
            value={name}
            onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
            error={!!nameError}
            helperText={nameError}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Description (Optional)"
            placeholder="Brief description of the subject..."
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading} sx={{ px: 3 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ px: 4 }}>
          {loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Subject' : 'Save Changes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ─── Main Admin Dashboard ─── */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('subjects');

  // Subject state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState('');
  
  // Topic Management State
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedSubjectTopics, setSelectedSubjectTopics] = useState<any[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    const fetchSelectedTopics = async () => {
      if (!selectedSubject) return;
      setLoadingTopics(true);
      try {
        const res = await fetch(`/api/admin/topics?subjectId=${selectedSubject._id}`);
        const data = await res.json();
        if (res.ok) setSelectedSubjectTopics(data.topics);
      } catch (err) { console.error(err); }
      finally { setLoadingTopics(false); }
    };
    fetchSelectedTopics();
  }, [selectedSubject]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  /* ─── Fetch Subjects ─── */
  const fetchSubjects = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await fetch('/api/admin/subjects');
      const data = await res.json();
      if (res.ok) {
        setSubjects(data.subjects);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  /* ─── Add Subject ─── */
  const handleOpenAdd = () => {
    setDialogMode('add');
    setEditingSubject(null);
    setDialogOpen(true);
  };

  /* ─── Edit Subject ─── */
  const handleOpenEdit = (subject: Subject) => {
    setDialogMode('edit');
    setEditingSubject(subject);
    setDialogOpen(true);
  };

  /* ─── Save (Add/Edit) ─── */
  const handleSave = async (data: { name: string; description: string }) => {
    setSaving(true);
    try {
      const url = dialogMode === 'add'
        ? '/api/admin/subjects'
        : `/api/admin/subjects/${editingSubject?._id}`;
      const method = dialogMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        setDialogOpen(false);
        fetchSubjects();
      } else {
        setSnackbar({ open: true, message: result.message || 'Something went wrong', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Network error. Please try again.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete Subject ─── */
  const handleOpenDelete = (subject: Subject) => {
    setDeletingSubject(subject);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSubject) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/subjects/${deletingSubject._id}`, { method: 'DELETE' });
      const result = await res.json();

      if (res.ok) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        setDeleteOpen(false);
        fetchSubjects();
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to delete', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Network error. Please try again.', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Filtered subjects ─── */
  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  /* ─── Sidebar Tabs ─── */
  const sidebarTabs = [
    { key: 'subjects', label: 'Subjects', icon: <SubjectIcon /> },
    { key: 'quizzes', label: 'Quizzes & Qs', icon: <QuizIcon /> },
  ];

  return (
    <Box sx={styles.pageRoot}>
      <Header />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* ─── Sidebar ─── */}
          <AdminSidebar />

          {/* ─── Main Content ─── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={0} sx={styles.mainPaper}>
              {/* Header Bar */}
              <Box sx={styles.mainHeader}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'var(--font-heading)', mb: 0.5 }}>
                      Subjects
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage your course subjects — {subjects.length} total
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlinedIcon />}
                    onClick={handleOpenAdd}
                    sx={{
                      px: 3,
                      py: 1.2,
                      borderRadius: 2,
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Add Subject
                  </Button>
                </Stack>
              </Box>

              {/* Search Bar */}
              <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9' }}>
                <TextField
                  size="small"
                  placeholder="Search subjects..."
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'var(--text-disabled)', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    maxWidth: 400,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                />
              </Box>

              {/* Subject List */}
              <Box>
              {/* Subject List or Topic Manager */}
              <Box>
                {selectedSubject ? (
                  <Box sx={{ p: 0 }}>
                    <Button 
                      startIcon={<ArrowBackIcon />} 
                      onClick={() => setSelectedSubject(null)}
                      sx={{ m: 2, fontWeight: 700 }}
                    >
                      Back to Subjects
                    </Button>
                    <Divider />
                    {/* Inline Topic Manager */}
                    <Box sx={{ p: 0 }}>
                       <Stack direction="row" spacing={2} sx={{ px: 3, py: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                         <Typography variant="h6" sx={{ fontWeight: 800 }}>
                           {selectedSubject.name} Topics
                         </Typography>
                         <Chip 
                           label={`${selectedSubjectTopics.length} Topics`} 
                           size="small" 
                           color="primary" 
                           variant="outlined" 
                           sx={{ fontWeight: 700 }}
                         />
                       </Stack>
                       <Divider />
                       
                       {loadingTopics ? (
                         <Box sx={{ p: 3 }}>
                           <Skeleton variant="text" width="60%" height={30} />
                           <Skeleton variant="text" width="40%" height={20} />
                         </Box>
                       ) : (
                         <List sx={{ px: 2 }}>
                           {selectedSubjectTopics.map((topic, idx) => (
                             <ListItem key={topic._id} sx={{ py: 1, borderBottom: '1px solid #f8fafc' }}>
                               <Chip label={idx + 1} size="small" sx={{ mr: 2, height: 20, minWidth: 20, fontSize: '0.65rem' }} />
                               <Typography variant="body2" sx={{ fontWeight: 600 }}>{topic.title}</Typography>
                             </ListItem>
                           ))}
                           {selectedSubjectTopics.length === 0 && (
                             <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
                               No topics added yet.
                             </Typography>
                           )}
                         </List>
                       )}

                       <Box sx={{ px: 3, pb: 4, mt: 2 }}>
                          <Button 
                            variant="contained" 
                            fullWidth 
                            component={Link} 
                            href={`/admin/subjects/${selectedSubject._id}`}
                            sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                          >
                            Edit Topics & Content
                          </Button>
                       </Box>
                    </Box>
                  </Box>
                ) : (
                  <>
                    {loadingList ? (
                      /* Loading skeleton */
                      <Box sx={{ px: 3, py: 1 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <Box key={i} sx={{ py: 2, borderBottom: '1px solid #f1f5f9' }}>
                            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                              <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: '8px' }} />
                              <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="40%" height={24} />
                                <Skeleton variant="text" width="65%" height={18} />
                              </Box>
                              <Skeleton variant="rounded" width={36} height={36} />
                              <Skeleton variant="rounded" width={36} height={36} />
                            </Stack>
                          </Box>
                        ))}
                      </Box>
                    ) : filteredSubjects.length === 0 ? (
                      /* Empty state */
                      <Box sx={styles.emptyState}>
                        <Box sx={{
                          width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 3,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.06) 0%, rgba(25, 118, 210, 0.15) 100%)',
                        }}>
                          <MenuBookIcon sx={{ fontSize: 40, color: 'var(--primary-main)', opacity: 0.6 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'var(--text-primary)' }}>
                          {search ? 'No subjects found' : 'No subjects yet'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {search
                            ? `No subjects match "${search}". Try a different search term.`
                            : 'Get started by adding your first subject to the LMS.'}
                        </Typography>
                        {!search && (
                          <Button variant="contained" startIcon={<AddCircleOutlinedIcon />} onClick={handleOpenAdd}>
                            Add Your First Subject
                          </Button>
                        )}
                      </Box>
                    ) : (
                      /* Subject list */
                      <List disablePadding>
                        {filteredSubjects.map((subject, index) => (
                          <Fade in key={subject._id} timeout={200 + index * 50}>
                            <ListItem disablePadding sx={styles.subjectRow}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                {/* Index */}
                                <Chip label={index + 1} size="small" sx={styles.indexChip} />

                                {/* Subject Info */}
                                <Box sx={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => setSelectedSubject(subject)}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                                    {subject.name}
                                  </Typography>
                                  {subject.description && (
                                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 500 }}>
                                      {subject.description}
                                    </Typography>
                                  )}
                                </Box>

                                {/* Date */}
                                <Typography variant="caption" color="text.disabled" sx={{ display: { xs: 'none', sm: 'block' }, whiteSpace: 'nowrap' }}>
                                  {new Date(subject.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </Typography>

                                {/* Actions */}
                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="Manage Topics" arrow>
                                    <IconButton size="small" onClick={() => setSelectedSubject(subject)}
                                      sx={{ ...styles.actionBtn('primary'), backgroundColor: 'rgba(25,118,210,0.06)' }}>
                                      <ArticleOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Edit" arrow>
                                    <IconButton size="small" onClick={() => handleOpenEdit(subject)} sx={styles.actionBtn('primary')}>
                                      <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete" arrow>
                                    <IconButton size="small" onClick={() => handleOpenDelete(subject)} sx={styles.actionBtn('error')}>
                                      <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </Box>
                            </ListItem>
                          </Fade>
                        ))}
                      </List>
                    )}
                  </>
                )}
              </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* ─── Add / Edit Dialog ─── */}
      <SubjectDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={{
          name: editingSubject?.name || '',
          description: editingSubject?.description || '',
        }}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        loading={saving}
      />

      {/* ─── Delete Confirmation ─── */}
      <DeleteConfirmDialog
        open={deleteOpen}
        subjectName={deletingSubject?.name || ''}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />

      {/* ─── Snackbar ─── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
