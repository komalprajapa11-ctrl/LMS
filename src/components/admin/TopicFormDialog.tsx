'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Stack, TextField, MenuItem, IconButton,
  Dialog, DialogContent, DialogActions, Chip, Paper, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TitleIcon from '@mui/icons-material/TitleRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Section {
  type: 'HEADING' | 'TEXT' | 'BULLETS' | 'CODE' | 'NOTE';
  content: string;
  language?: string;
  order: number;
}

interface TopicFormDialogProps {
  open: boolean;
  mode: 'add' | 'edit';
  loading: boolean;
  parentId?: string | null;
  initialData?: { title: string; sections: Section[] };
  onClose: () => void;
  onSave: (data: { title: string; sections: Section[]; parentId?: string | null }) => void;
}

const SECTION_TYPES = [
  { value: 'HEADING', label: 'Sub Heading', icon: <TitleIcon sx={{ fontSize: 18 }} />, color: '#7c3aed', bg: '#f3f0ff' },
  { value: 'TEXT', label: 'Text / Details', icon: <TextFieldsIcon sx={{ fontSize: 18 }} />, color: '#059669', bg: '#ecfdf5' },
  { value: 'BULLETS', label: 'Bullet Points', icon: <FormatListBulletedIcon sx={{ fontSize: 18 }} />, color: '#d97706', bg: '#fffbeb' },
  { value: 'CODE', label: 'Code Example', icon: <CodeIcon sx={{ fontSize: 18 }} />, color: '#2563eb', bg: '#eff6ff' },
  { value: 'NOTE', label: 'Note / Tip', icon: <InfoOutlinedIcon sx={{ fontSize: 18 }} />, color: '#dc2626', bg: '#fef2f2' },
];

const CODE_LANGUAGES = [
  'html', 'css', 'javascript', 'typescript', 'jsx', 'tsx',
  'python', 'java', 'csharp', 'php', 'sql', 'json', 'bash', 'xml', 'other',
];

function getSectionMeta(type: string) {
  return SECTION_TYPES.find(s => s.value === type) || SECTION_TYPES[0];
}

export default function TopicFormDialog({ open, mode, loading, initialData, onClose, onSave }: TopicFormDialogProps) {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || '');
      setSections(initialData?.sections?.map((s, i) => ({ ...s, order: i })) || []);
      setTitleError('');
    }
  }, [open, initialData]);

  const addSection = (type: Section['type']) => {
    setSections(prev => [...prev, { type, content: '', language: type === 'CODE' ? 'javascript' : '', order: prev.length }]);
  };

  const updateSection = (index: number, field: string, value: string) => {
    setSections(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const updated = [...sections];
    [updated[index], updated[newIdx]] = [updated[newIdx], updated[index]];
    setSections(updated.map((s, i) => ({ ...s, order: i })));
  };

  const handleSubmit = () => {
    if (!title.trim()) { setTitleError('Topic title is required'); return; }
    onSave({ title: title.trim(), sections, parentId });
  };

  const getPlaceholder = (type: string) => {
    switch (type) {
      case 'HEADING': return 'Enter sub-heading text...';
      case 'TEXT': return 'Enter detailed explanation text...';
      case 'BULLETS': return 'Enter each point on a new line:\n- First point\n- Second point\n- Third point';
      case 'CODE': return 'Paste your code example here...';
      case 'NOTE': return 'Enter a note or tip for the learner...';
      default: return '';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', maxHeight: '90vh' } }}>
      {/* Dialog Header */}
      <Box sx={{
        px: 3, py: 2.5,
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-main) 100%)',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <MenuBookIcon sx={{ fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {mode === 'add' ? 'Add New Topic' : 'Edit Topic'}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, py: 3 }}>
        {/* Topic Title */}
        <TextField label="Topic Title (Main Heading)" placeholder="e.g. What is HTML?" fullWidth required
          autoFocus value={title} error={!!titleError} helperText={titleError}
          onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(''); }}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 3 }}
        />

        {/* Section Type Buttons */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'var(--text-primary)' }}>
          Add Content Sections
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {SECTION_TYPES.map(st => (
            <Button key={st.value} size="small" variant="outlined" startIcon={st.icon}
              onClick={() => addSection(st.value as Section['type'])}
              sx={{
                borderColor: st.color, color: st.color, backgroundColor: st.bg,
                fontWeight: 600, fontSize: '0.75rem', borderRadius: 2, textTransform: 'none',
                '&:hover': { borderColor: st.color, backgroundColor: st.bg, opacity: 0.85 },
              }}>
              + {st.label}
            </Button>
          ))}
        </Stack>

        {/* Sections List */}
        {sections.length === 0 && (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed', borderRadius: 2, borderColor: '#cbd5e1' }}>
            <Typography variant="body2" color="text.secondary">
              Click the buttons above to add content sections (headings, text, code, etc.)
            </Typography>
          </Paper>
        )}

        <Stack spacing={2}>
          {sections.map((section, idx) => {
            const meta = getSectionMeta(section.type);
            return (
              <Paper key={idx} variant="outlined" sx={{
                borderRadius: 2, overflow: 'hidden',
                borderColor: meta.color, borderLeftWidth: 3,
              }}>
                {/* Section Header */}
                <Box sx={{
                  px: 2, py: 1, backgroundColor: meta.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {meta.icon}
                    <Typography variant="caption" sx={{ fontWeight: 700, color: meta.color, textTransform: 'uppercase' }}>
                      {meta.label}
                    </Typography>
                    <Chip label={`#${idx + 1}`} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Move up" arrow>
                      <span>
                        <IconButton size="small" disabled={idx === 0} onClick={() => moveSection(idx, 'up')}>
                          <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Move down" arrow>
                      <span>
                        <IconButton size="small" disabled={idx === sections.length - 1} onClick={() => moveSection(idx, 'down')}>
                          <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Remove" arrow>
                      <IconButton size="small" onClick={() => removeSection(idx)} sx={{ color: 'var(--error-main)' }}>
                        <RemoveIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                {/* Section Content */}
                <Box sx={{ p: 2 }}>
                  {section.type === 'CODE' && (
                    <TextField select label="Language" size="small" value={section.language || 'javascript'}
                      onChange={(e) => updateSection(idx, 'language', e.target.value)}
                      sx={{ mb: 1.5, minWidth: 150 }}
                      slotProps={{ inputLabel: { shrink: true } }}>
                      {CODE_LANGUAGES.map(lang => (
                        <MenuItem key={lang} value={lang}>{lang.toUpperCase()}</MenuItem>
                      ))}
                    </TextField>
                  )}
                  <TextField fullWidth multiline
                    rows={section.type === 'CODE' ? 6 : section.type === 'HEADING' ? 1 : 3}
                    placeholder={getPlaceholder(section.type)}
                    value={section.content}
                    onChange={(e) => updateSection(idx, 'content', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: section.type === 'CODE' ? '"Fira Code", "Consolas", monospace' : 'inherit',
                        fontSize: section.type === 'CODE' ? '0.85rem' : '0.9rem',
                        backgroundColor: section.type === 'CODE' ? '#fafafa' : 'transparent',
                      },
                    }}
                  />
                </Box>
              </Paper>
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading} sx={{ px: 3 }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} sx={{ px: 4 }}>
          {loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Topic' : 'Save Changes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
