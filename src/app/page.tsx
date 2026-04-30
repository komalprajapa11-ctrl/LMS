'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Skeleton,
  TextField,
  Avatar,
  Paper,
  alpha
} from '@mui/material';
import Header from '@/components/layout/Header';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ComputerIcon from '@mui/icons-material/Computer';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SendIcon from '@mui/icons-material/Send';
import Footer from '@/components/layout/Footer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Subject {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

function HomeContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? searchParams.get('search') : null;
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch('/api/subjects');
        const data = await res.json();
        if (res.ok) setSubjects(data.subjects);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(subject => 
    !searchQuery || 
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header />
      
      {/* Hero Section - Elite Look */}
      <Box sx={{ 
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 8, md: 15 },
        background: 'radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.05) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(37, 99, 235, 0.03) 0%, transparent 50%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box>
                <Chip 
                  label="Join 15k+ Students learning today" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: alpha('#2563eb', 0.08), 
                    color: '#2563eb', 
                    fontWeight: 700, 
                    px: 1,
                    py: 2.5,
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: alpha('#2563eb', 0.1)
                  }} 
                />
                <Typography variant="h1" sx={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 900, 
                  mb: 3, 
                  fontSize: { xs: '2.8rem', md: '5rem' }, 
                  letterSpacing: '-2.5px',
                  lineHeight: 1,
                  color: '#0f172a'
                }}>
                  Future-Proof Your <br />
                  <span style={{ color: '#2563eb' }}>Coding Career</span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', mb: 5, fontWeight: 400, maxWidth: 600, lineHeight: 1.8 }}>
                  Unlock world-class curriculum, interactive labs, and expert mentorship. Built by engineers, for the next generation of creators.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      px: 5, py: 2.2, borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', textTransform: 'none',
                      background: 'var(--grad-primary)',
                      boxShadow: '0 20px 40px -12px rgba(37, 99, 235, 0.35)',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.45)' }
                    }}
                  >
                    Start Learning Free
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    sx={{ 
                      px: 5, py: 2.2, borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', textTransform: 'none',
                      borderColor: '#e2e8f0', color: '#0f172a',
                      '&:hover': { borderColor: '#2563eb', backgroundColor: alpha('#2563eb', 0.02) }
                    }}
                  >
                    Explore Subjects
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative' }}>
                <Paper sx={{ 
                  p: 2, borderRadius: '24px', 
                  boxShadow: '0 40px 80px -15px rgba(0,0,0,0.1)',
                  position: 'relative', zIndex: 2
                }}>
                  <Box sx={{ 
                    height: 400, borderRadius: '18px', 
                    background: 'var(--grad-primary)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                  }}>
                    <ComputerIcon sx={{ fontSize: 120, opacity: 0.9 }} />
                  </Box>
                </Paper>
                <Box sx={{ 
                  position: 'absolute', top: -30, right: -30, width: 200, height: 200, 
                  background: 'var(--grad-primary)', borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)'
                }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats - Modern Bar */}
      <Container maxWidth="xl">
        <Paper elevation={0} sx={{ 
          p: 4, mt: -8, mb: 12, borderRadius: '24px', 
          border: '1px solid #f1f5f9', 
          backgroundColor: 'white',
          boxShadow: '0 20px 50px -12px rgba(0,0,0,0.08)',
          position: 'relative', zIndex: 10
        }}>
          <Grid container spacing={4}>
            {[
              { label: 'Active Students', value: '15k+', color: '#3b82f6' },
              { label: 'Courses Published', value: '120+', color: '#8b5cf6' },
              { label: 'Average Rating', value: '4.9/5', color: '#f59e0b' },
              { label: 'Career Hires', value: '5k+', color: '#10b981' }
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mb: 0.5 }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Subjects Section - Premium Grid */}
      <Container maxWidth="xl" sx={{ mb: 15 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-1.5px', color: '#0f172a' }}>
              {searchQuery ? `Search Results` : 'Top Subjects'}
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
              {searchQuery ? `Found ${filteredSubjects.length} relevant paths for you` : 'Start your journey with our highly recommended subjects'}
            </Typography>
          </Box>
          {!searchQuery && <Button variant="text" sx={{ fontWeight: 800, color: '#2563eb', fontSize: '1rem', textTransform: 'none' }}>View All Courses →</Button>}
        </Box>

        <Grid container spacing={4}>
          {loading ? (
            [1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton variant="rounded" height={420} sx={{ borderRadius: '24px' }} />
              </Grid>
            ))
          ) : filteredSubjects.map((subject) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={subject._id}>
              <Card sx={{ 
                borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-12px)', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', borderColor: '#2563eb' }
              }}>
                <Box sx={{ 
                  height: 220, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', position: 'relative'
                }}>
                  <MenuBookIcon sx={{ fontSize: 70, opacity: 0.8 }} />
                  <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                    <Chip label="Popular" size="small" sx={{ fontWeight: 800, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }} />
                  </Box>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#0f172a' }}>{subject.name}</Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, height: 50, overflow: 'hidden' }}>
                    {subject.description || `Master the fundamentals and advanced concepts of ${subject.name} with our step-by-step guide.`}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563eb' }}>Free</Typography>
                    <Button 
                      component={Link} href={`/learn/${subject._id}`}
                      variant="contained" sx={{ 
                        borderRadius: '12px', fontWeight: 800, textTransform: 'none',
                        px: 3, py: 1.2, boxShadow: 'none', backgroundColor: '#0f172a',
                        '&:hover': { backgroundColor: '#1e293b' }
                      }}
                    >
                      Learn Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Motivation Section - Elite CTA */}
      <Box sx={{ 
        py: 15, mb: 15, background: '#0f172a', color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <VerifiedIcon sx={{ fontSize: 60, color: '#3b82f6', mb: 4 }} />
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 4, letterSpacing: '-2px', lineHeight: 1.1 }}>
            "The capacity to learn is a gift; the ability to learn is a skill."
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, mb: 6, fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            Ready to change your life? Join thousands of professionals who have already accelerated their careers with us.
          </Typography>
          <Button 
            variant="contained" size="large"
            sx={{ 
              px: 6, py: 2.2, borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', textTransform: 'none',
              backgroundColor: '#3b82f6', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.5)',
              '&:hover': { backgroundColor: '#2563eb', transform: 'translateY(-2px)' }
            }}
          >
            Create Your Free Account
          </Button>
        </Container>
      </Box>

      {/* Contact Section - Clean & Modern */}
      <Container maxWidth="xl" sx={{ mb: 15 }}>
        <Grid container spacing={10}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-1.5px' }}>Let's Build Something <br /> <span style={{ color: '#2563eb' }}>Together</span></Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 6, fontSize: '1.1rem', lineHeight: 1.8 }}>
                Have a question or feedback? We'd love to hear from you. Our team typically responds within 24 hours.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { label: 'General Inquiries', value: 'hello@technotoil.com' },
                  { label: 'Visit Our Lab', value: 'Tech Valley, Innovation Park, CA' }
                ].map((item, i) => (
                  <Box key={i}>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', mb: 1, display: 'block' }}>{item.label}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: '32px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
              <form>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Name" variant="filled" sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', backgroundColor: 'white' } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email" variant="filled" sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', backgroundColor: 'white' } }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth multiline rows={4} label="How can we help?" variant="filled" sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', backgroundColor: 'white' } }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button 
                      variant="contained" size="large" fullWidth 
                      sx={{ 
                        py: 2.2, borderRadius: '14px', fontWeight: 800, textTransform: 'none',
                        backgroundColor: '#0f172a', fontSize: '1.1rem',
                        '&:hover': { backgroundColor: '#1e293b' }
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><Typography>Loading Dashboard...</Typography></Box>}>
      <HomeContent />
    </Suspense>
  );
}
