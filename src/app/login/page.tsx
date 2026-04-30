'use client';

import React, { useState, Suspense } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Alert,
  Divider,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Link from 'next/link';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams ? searchParams.get('registered') : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
      {/* Left Side - Brand & Features */}
      <Box sx={{ 
        flex: 1, 
        background: 'var(--grad-primary)', 
        color: 'white',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        p: 8,
        position: 'relative'
      }}>
        {/* Subtle Background Pattern */}
        <Box sx={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <SchoolIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: 1 }}>
              VP LEARNING LMS
            </Typography>
          </Box>

          <Box>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
              Unlock Your <br />
              <span style={{ color: '#93c5fd' }}>Full Potential</span>
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, maxWidth: 450 }}>
              Join the world's most advanced learning platform designed for modern professionals and students.
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {[
              'Interactive W3Schools-style Lessons',
              'Real-time Code Playground',
              'Progress Tracking & Achievements',
              'Expert-curated Course Content'
            ].map((text, i) => (
              <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <CheckCircleOutlinedIcon sx={{ color: '#93c5fd' }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Box sx={{ position: 'absolute', bottom: 40, left: 64, opacity: 0.6 }}>
          <Typography variant="caption">© 2026 VP Learning Solutions. All rights reserved.</Typography>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        backgroundColor: '#f1f5f9', // Soft background to make the card pop
        position: 'relative'
      }}>
        {/* Background Decorative Element */}
        <Box sx={{ 
          position: 'absolute', top: '10%', right: '10%', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
          zIndex: 0
        }} />

        <Paper elevation={0} sx={{ 
          width: '100%', 
          maxWidth: '460px', 
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'var(--text-primary)', letterSpacing: -0.5 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Please enter your details to sign in
            </Typography>
          </Box>

          {error && <Alert severity="error" variant="standard" sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}>{error}</Alert>}
          {registered && (
            <Alert severity="success" variant="standard" sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}>
              Account created! Please login.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@company.com"
                  variant="filled"
                  slotProps={{ inputLabel: { sx: { fontWeight: 600, color: '#64748b' } } }}
                  sx={{ 
                    '& .MuiFilledInput-root': { 
                      borderRadius: '14px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      transition: 'all 0.2s',
                      '&:hover': { backgroundColor: 'white', borderColor: '#cbd5e1' },
                      '&:focus-within': { backgroundColor: 'white', borderColor: 'var(--primary-main)', boxShadow: '0 0 0 4px rgba(37,99,235,0.1)' },
                      '&:before': { display: 'none' }, 
                      '&:after': { display: 'none' }
                    } 
                  }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  required
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  variant="filled"
                  sx={{ 
                    '& .MuiFilledInput-root': { 
                      borderRadius: '14px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      transition: 'all 0.2s',
                      '&:hover': { backgroundColor: 'white', borderColor: '#cbd5e1' },
                      '&:focus-within': { backgroundColor: 'white', borderColor: 'var(--primary-main)', boxShadow: '0 0 0 4px rgba(37,99,235,0.1)' },
                      '&:before': { display: 'none' }, 
                      '&:after': { display: 'none' }
                    } 
                  }}
                  slotProps={{
                    inputLabel: { sx: { fontWeight: 600, color: '#64748b' } },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#94a3b8' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                />
               
              </Box>

              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth 
                disabled={loading}
                sx={{ 
                  height: 56, 
                  fontWeight: 800, 
                  borderRadius: 3,
                  fontSize: '1.05rem',
                  textTransform: 'none',
                  background: 'var(--grad-primary)',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                  '&:hover': {
                    boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              Don't have an account? 
              <Button component={Link} href="/register" variant="text" sx={{ ml: 1, fontWeight: 800, textTransform: 'none', color: 'var(--primary-main)' }}>
                Create Account
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><Typography>Loading login...</Typography></Box>}>
      <LoginContent />
    </Suspense>
  );
}
