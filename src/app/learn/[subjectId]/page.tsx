'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Stack, List, ListItem, ListItemButton,
  ListItemText, Divider, Button, IconButton, Drawer, useMediaQuery,
  useTheme, Alert, Skeleton, Fade, Chip,
} from '@mui/material';
import Header from '@/components/layout/Header';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeEditorDialog from '@/components/learn/CodeEditorDialog';
import QuizIcon from '@mui/icons-material/Quiz';
import Link from 'next/link';
import { use } from 'react';

interface Section {
  type: 'HEADING' | 'TEXT' | 'BULLETS' | 'CODE' | 'NOTE';
  content: string;
  language?: string;
  order: number;
}

interface Topic {
  _id: string;
  parentId: string | null;
  title: string;
  sections: Section[];
}

interface Subject {
  _id: string;
  name: string;
}

const SIDEBAR_WIDTH = 300;

export default function LearnPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Editor Dialog State
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedLang, setSelectedLang] = useState('');

  const activeTopic = topics[activeTopicIndex];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch subject info
        const sRes = await fetch('/api/subjects');
        const sData = await sRes.json();
        const foundSubject = sData.subjects?.find((s: any) => s._id === subjectId);
        if (foundSubject) setSubject(foundSubject);

        // Fetch topics
        const tRes = await fetch(`/api/topics?subjectId=${subjectId}`);
        const tData = await tRes.json();
        if (tRes.ok) setTopics(tData.topics);
      } catch (err) {
        console.error('Error fetching learning data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  const handleNext = () => {
    if (activeTopicIndex < topics.length - 1) {
      setActiveTopicIndex(activeTopicIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (activeTopicIndex > 0) {
      setActiveTopicIndex(activeTopicIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const SidebarContent = (
    <Box sx={{ height: '100%', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
      <Box sx={{ p: 2.5, backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
          {subject?.name} Course
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
          {topics.length} LESSONS TOTAL
        </Typography>
      </Box>
      <List sx={{ pt: 1, pb: 10 }}>
        {topics.filter(t => !t.parentId).map((parent) => {
          const children = topics.filter(t => t.parentId === parent._id);
          const isParentActive = topics[activeTopicIndex]?._id === parent._id || children.some((c, i) => topics.findIndex(t => t._id === c._id) === activeTopicIndex);

          return (
            <React.Fragment key={parent._id}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={topics[activeTopicIndex]?._id === parent._id}
                  onClick={() => {
                    const idx = topics.findIndex(t => t._id === parent._id);
                    if (idx !== -1) setActiveTopicIndex(idx);
                    if (isMobile && children.length === 0) setSidebarOpen(false);
                  }}
                  sx={{
                    py: 1.5,
                    px: 3,
                    borderLeft: topics[activeTopicIndex]?._id === parent._id ? '4px solid #2563eb' : '4px solid transparent',
                    backgroundColor: isParentActive ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.06)' },
                  }}
                >
                  <ListItemText
                    primary={parent.title}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: isParentActive ? 800 : 600,
                        fontSize: '0.95rem',
                        color: isParentActive ? '#0f172a' : '#475569',
                      }
                    }}
                  />
                  {children.length > 0 && (
                    <Box sx={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      backgroundColor: '#e2e8f0', 
                      px: 1, 
                      py: 0.2, 
                      borderRadius: '4px',
                      color: '#475569'
                    }}>
                      {children.length}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
              
              {children.length > 0 && (
                <Box sx={{ pl: 2, backgroundColor: 'rgba(248, 250, 252, 0.5)' }}>
                  {children.map((child) => {
                    const childIdx = topics.findIndex(t => t._id === child._id);
                    const isChildActive = activeTopicIndex === childIdx;
                    
                    return (
                      <ListItem key={child._id} disablePadding>
                        <ListItemButton
                          selected={isChildActive}
                          onClick={() => {
                            setActiveTopicIndex(childIdx);
                            if (isMobile) setSidebarOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          sx={{
                            py: 1,
                            px: 3,
                            borderLeft: isChildActive ? '4px solid #2563eb' : '4px solid transparent',
                            '&.Mui-selected': {
                              backgroundColor: 'white',
                              '&:hover': { backgroundColor: 'white' },
                            }
                          }}
                        >
                          <ListItemText
                            primary={child.title}
                            primaryTypographyProps={{
                              sx: {
                                fontWeight: isChildActive ? 700 : 500,
                                fontSize: '0.88rem',
                                color: isChildActive ? '#2563eb' : '#64748b',
                              }
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          component={Link}
          href={`/learn/${subjectId}/quiz`}
          startIcon={<QuizIcon />}
          sx={{ 
            py: 1.5, 
            borderRadius: 2, 
            fontWeight: 800, 
            backgroundColor: '#2563eb',
            '&:hover': { backgroundColor: '#1d4ed8' }
          }}
        >
          Take Quiz
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header />
      
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Box sx={{
          width: SIDEBAR_WIDTH,
          position: 'fixed',
          top: 64,
          bottom: 0,
          left: 0,
          overflowY: 'auto',
          zIndex: 10,
        }}>
          {SidebarContent}
        </Box>
      )}

      {/* Drawer for Mobile */}
      <Drawer
        open={isMobile && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH } }}
      >
        {SidebarContent}
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{
        ml: !isMobile ? `${SIDEBAR_WIDTH}px` : 0,
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#fff',
        transition: 'margin-left 0.2s ease',
      }}>
        <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
          {loading ? (
            <Box>
              <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 4, borderRadius: 2 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="95%" height={20} />
            </Box>
          ) : !activeTopic ? (
            <Alert severity="info">No content found for this subject.</Alert>
          ) : (
            <Fade in timeout={400}>
              <Box>
                {/* Topic Header */}
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    {isMobile && (
                      <IconButton onClick={() => setSidebarOpen(true)} sx={{ ml: -1 }}>
                        <MenuIcon />
                      </IconButton>
                    )}
                    <Typography variant="overline" sx={{ color: 'var(--primary-main)', fontWeight: 700, letterSpacing: 1 }}>
                      {subject?.name} LESSON {activeTopicIndex + 1}
                    </Typography>
                  </Stack>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    fontFamily: 'var(--font-heading)', 
                    color: '#1a202c',
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}>
                    {activeTopic.title}
                  </Typography>
                </Box>

                {/* Topic Sections */}
                <Box sx={{ mb: 10 }}>
                  {activeTopic.sections.map((section, idx) => (
                    <Box key={idx} sx={{ mb: 5 }}>
                      {section.type === 'HEADING' && (
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#2d3748', borderBottom: '2px solid #edf2f7', pb: 1 }}>
                          {section.content}
                        </Typography>
                      )}

                      {section.type === 'TEXT' && (
                        <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                          {section.content}
                        </Typography>
                      )}

                      {section.type === 'BULLETS' && (
                        <Box component="ul" sx={{ pl: 4, '& li': { mb: 1.5, color: '#4a5568', fontSize: '1.05rem' } }}>
                          {section.content.split('\n').filter(Boolean).map((line, li) => (
                            <li key={li}>{line.replace(/^[-•]\s*/, '')}</li>
                          ))}
                        </Box>
                      )}

                      {section.type === 'CODE' && (
                        <Box sx={{ my: 3, backgroundColor: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                          <Box sx={{ px: 2, py: 1, backgroundColor: '#2d2d2d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #404040' }}>
                            <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
                              {section.language || 'Code'} Example
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <IconButton size="small" onClick={() => navigator.clipboard.writeText(section.content)} sx={{ color: '#9ca3af', '&:hover': { color: 'white' } }}>
                                <ContentCopyIcon fontSize="inherit" sx={{ fontSize: 16 }} />
                              </IconButton>
                              <Chip 
                                label="Try it Yourself" 
                                size="small" 
                                onClick={() => {
                                  setSelectedCode(section.content);
                                  setSelectedLang(section.language || 'html');
                                  setEditorOpen(true);
                                }}
                                sx={{ 
                                  height: 24, fontSize: '0.7rem', fontWeight: 700, 
                                  backgroundColor: '#059669', color: 'white', 
                                  '&:hover': { backgroundColor: '#047857' }, cursor: 'pointer' 
                                }} 
                              />
                            </Stack>
                          </Box>
                          <Box component="pre" sx={{ 
                            p: 3, m: 0, 
                            color: '#d4d4d4', 
                            fontFamily: '"Fira Code", "Consolas", monospace', 
                            fontSize: '0.9rem', 
                            lineHeight: 1.6, 
                            overflowX: 'auto',
                            backgroundColor: '#1e1e1e'
                          }}>
                            <code>{section.content}</code>
                          </Box>
                        </Box>
                      )}

                      {section.type === 'NOTE' && (
                        <Alert 
                          severity="info" 
                          icon={<PlayCircleOutlinedIcon fontSize="inherit" />}
                          sx={{ 
                            borderRadius: '12px', 
                            backgroundColor: '#eff6ff', 
                            border: '1px solid #dbeafe',
                            '& .MuiAlert-message': { color: '#1e40af', fontWeight: 500 }
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Note:</Typography>
                          {section.content}
                        </Alert>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Navigation Buttons */}
                <Divider sx={{ mb: 4 }} />
                <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 6 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ChevronLeftIcon />}
                    onClick={handlePrev}
                    disabled={activeTopicIndex === 0}
                    sx={{ px: 3, py: 1.2, borderRadius: '8px', fontWeight: 700 }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightIcon />}
                    onClick={handleNext}
                    disabled={activeTopicIndex === topics.length - 1}
                    sx={{ px: 4, py: 1.2, borderRadius: '8px', fontWeight: 700, boxShadow: '0 4px 14px rgba(25,118,210,0.3)' }}
                  >
                    Next Lesson
                  </Button>
                </Stack>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Code Editor Playground */}
      <CodeEditorDialog 
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        initialCode={selectedCode}
        language={selectedLang}
      />
    </Box>
  );
}
