'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Alert,
  IconButton,
  InputAdornment,
  Paper
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        router.push('/login?registered=true');
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
              TECHNOTOIL LMS
            </Typography>
          </Box>

          <Box>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
              Start Your <br />
              <span style={{ color: '#93c5fd' }}>Learning Journey</span>
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, maxWidth: 450 }}>
              Create your free account today and get access to interactive lessons and real-time coding playgrounds.
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {[
              'Unlimited access to all subjects',
              'Personalized learning dashboard',
              'Certificate of completion',
              '24/7 Community support'
            ].map((text, i) => (
              <Stack key={i} direction="row" spacing={2} alignItems="center">
                <CheckCircleOutlinedIcon sx={{ color: '#93c5fd' }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Box sx={{ position: 'absolute', bottom: 40, left: 64, opacity: 0.6 }}>
          <Typography variant="caption">© 2026 Technotoil Solutions. All rights reserved.</Typography>
        </Box>
      </Box>

      {/* Right Side - Register Form */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        backgroundColor: '#f1f5f9',
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
          maxWidth: '500px', 
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
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Join thousands of students learning today
            </Typography>
          </Box>

          {error && <Alert severity="error" variant="standard" sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <Box>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  variant="outlined"
                  InputLabelProps={{ sx: { fontWeight: 600, color: '#64748b' } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      backgroundColor: 'white',
                      '&:hover fieldset': { borderColor: 'var(--primary-main)' }
                    } 
                  }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  required
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  type="email"
                  placeholder="name@company.com"
                  variant="outlined"
                  InputLabelProps={{ sx: { fontWeight: 600, color: '#64748b' } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      backgroundColor: 'white',
                      '&:hover fieldset': { borderColor: 'var(--primary-main)' }
                    } 
                  }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  required
                  label="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  variant="outlined"
                  InputLabelProps={{ sx: { fontWeight: 600, color: '#64748b' } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      backgroundColor: 'white',
                      '&:hover fieldset': { borderColor: 'var(--primary-main)' }
                    } 
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#94a3b8' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  required
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  variant="outlined"
                  InputLabelProps={{ sx: { fontWeight: 600, color: '#64748b' } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      backgroundColor: 'white',
                      '&:hover fieldset': { borderColor: 'var(--primary-main)' }
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
                  transition: 'all 0.2s ease',
                  mt: 1
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              Already have an account? 
              <Button component={Link} href="/login" variant="text" sx={{ ml: 1, fontWeight: 800, textTransform: 'none', color: 'var(--primary-main)' }}>
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
