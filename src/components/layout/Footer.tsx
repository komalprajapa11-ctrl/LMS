'use client';

import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Divider, Link as MuiLink, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box sx={{ 
      backgroundColor: '#0f172a', 
      color: 'white', 
      pt: 12, 
      pb: 6,
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1.2, 
                  borderRadius: '12px', 
                  background: 'var(--grad-primary)', 
                  display: 'flex',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                }}>
                  <SchoolIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>
                  VP Learning
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.8, maxWidth: 340, fontSize: '1.05rem' }}>
                Join our elite community of creators. We provide the tools and knowledge to build the future of technology.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, i) => (
                  <IconButton key={i} sx={{ 
                    color: '#94a3b8', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    '&:hover': { color: 'white', borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.05)' } 
                  }}>
                    <Icon sx={{ fontSize: 20 }} />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 4, color: 'white', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.8rem' }}>Platform</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Browse Courses', 'Certificates', 'Career Paths', 'For Teams'].map((item) => (
                <MuiLink 
                  key={item} 
                  component={Link} 
                  href="#" 
                  sx={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'white' } }}
                >
                  {item}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 4, color: 'white', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.8rem' }}>Community</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Help Center', 'Discussion Forum', 'Student Stories', 'Events'].map((item) => (
                <MuiLink 
                  key={item} 
                  component={Link} 
                  href="#" 
                  sx={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: 'white' } }}
                >
                  {item}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 4, color: 'white', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.8rem' }}>Subscribe to News</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.6 }}>
              Get the latest course releases and technology insights delivered to your inbox every week.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              p: 0.5, 
              backgroundColor: 'rgba(255,255,255,0.03)', 
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <Box sx={{ 
                flexGrow: 1, 
                px: 2, 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '0.9rem',
                color: '#64748b'
              }}>
                you@email.com
              </Box>
              <Button sx={{ 
                px: 3, 
                py: 1.2, 
                borderRadius: '10px', 
                background: '#2563eb', 
                color: 'white',
                fontWeight: 800,
                textTransform: 'none',
                '&:hover': { background: '#1d4ed8' }
              }}>
                Join
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 8, borderColor: 'rgba(255,255,255,0.05)' }} />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 3
        }}>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            © 2026 VP Learning Solutions. Made with ♥ for developers.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
            <MuiLink href="#" sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'white' } }}>Privacy</MuiLink>
            <MuiLink href="#" sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'white' } }}>Terms</MuiLink>
            <MuiLink href="#" sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: 'white' } }}>Cookies</MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
