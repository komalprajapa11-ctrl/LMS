'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  Stack, 
  Button, 
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip
} from '@mui/material';
import Header from '@/components/layout/Header';
import QuizSection from '@/components/courses/QuizSection';
import { useSession } from 'next-auth/react';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, text: "React hooks are essential for functional components.", date: "2024-04-20" },
    { id: 2, text: "MongoDB is a NoSQL document database.", date: "2024-04-21" }
  ]);

  const handleAddNote = () => {
    if (note.trim()) {
      setNotes([{ id: Date.now(), text: note, date: new Date().toISOString().split('T')[0] }, ...notes]);
      setNote('');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--bg-default)' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Main Content Area */}
          <Grid xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', mb: 4 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                <Chip label="MERN Stack" color="primary" size="small" />
                <Typography variant="caption" color="text.secondary">Updated 2 days ago</Typography>
              </Stack>
              
              <Typography variant="h3" sx={{ mb: 3, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Mastering the MERN Stack: A Complete Guide
              </Typography>
              
              <Box sx={{ position: 'relative', pt: '56.25%', backgroundColor: '#000', borderRadius: 2, mb: 4, overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <PlayLessonIcon sx={{ fontSize: 80, color: 'white', opacity: 0.5 }} />
                   <Typography sx={{ color: 'white', position: 'absolute', bottom: 20 }}>Video Placeholder (MERN Course)</Typography>
                </Box>
              </Box>

              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Course Overview</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                In this course, we will build a full-stack application from scratch using MongoDB, Express.js, React, and Node.js. 
                You will learn how to handle authentication, manage state with Redux, and deploy your application to the cloud.
              </Typography>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Test Your Knowledge</Typography>
              <QuizSection />
            </Paper>
          </Grid>

          {/* Sidebar Area */}
          <Grid xs={12} md={4}>
            {/* Notes Section - Only for Logged In Users */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <NoteAddIcon color="primary" /> My Private Notes
              </Typography>
              
              {!session ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Login to save your personal notes for this course.
                  </Typography>
                  <Button variant="outlined" component="a" href="/login" size="small">Login to Note</Button>
                </Box>
              ) : (
                <Stack spacing={2}>
                  <TextField 
                    placeholder="Write a quick note..." 
                    multiline 
                    rows={2} 
                    fullWidth 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <Button variant="contained" size="small" onClick={handleAddNote}>Save Note</Button>
                  
                  <Divider />
                  
                  <List dense>
                    {notes.map((n) => (
                      <ListItem key={n.id} sx={{ px: 0 }}>
                        <ListItemText 
                          primary={n.text} 
                          secondary={n.date}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              )}
            </Paper>

            {/* Course Curriculum */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Curriculum</Typography>
              <List>
                <ListItemButton>
                  <ListItemText primary="1. Introduction to MERN" secondary="10:00" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="2. Setting up MongoDB" secondary="15:30" />
                </ListItemButton>
                <ListItemButton selected>
                  <ListItemText primary="3. React Fundamentals" secondary="25:00" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="4. Express & Node.js" secondary="20:00" />
                </ListItemButton>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
