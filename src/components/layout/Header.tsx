'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  InputBase,
  alpha,
  styled
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: alpha('#94a3b8', 0.08),
  '&:hover': {
    backgroundColor: alpha('#94a3b8', 0.12),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: 'all 0.2s ease',
  border: '1px solid transparent',
  '&:focus-within': {
    border: `1px solid var(--primary-main)`,
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64748b'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'var(--text-primary)',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
    fontSize: '0.9rem',
    fontWeight: 500
  },
}));

import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// ... (Search styles remain the same)

export default function Header() {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const NavButton = ({ href, children, admin = false }: { href: string, children: React.ReactNode, admin?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Button
        component={Link}
        href={href}
        sx={{
          px: 2,
          py: 0.8,
          borderRadius: '10px',
          color: isActive ? 'var(--primary-main)' : 'var(--text-secondary)',
          fontWeight: isActive ? 700 : 500,
          backgroundColor: isActive ? alpha('#2563eb', 0.06) : 'transparent',
          '&:hover': {
            backgroundColor: alpha('#2563eb', 0.08),
            color: 'var(--primary-main)'
          },
          textTransform: 'none',
          fontSize: '0.92rem'
        }}
      >
        {children}
      </Button>
    );
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      color: 'var(--text-primary)',
      borderBottom: '1px solid #eef2f6',
      zIndex: 1100
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 80 }}>
          {/* Logo Section */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 6 }}>
              <Box sx={{
                p: 1,
                borderRadius: '12px',
                background: 'var(--grad-primary)',
                color: 'white',
                display: 'flex',
                mr: 1.5,
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.25)'
              }}>
                <SchoolIcon sx={{ fontSize: 26 }} />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.8px',
                  fontSize: '1.4rem'
                }}
              >
                VP Learning
              </Typography>
            </Box>
          </Link>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
            <NavButton href="/">Dashboard</NavButton>

            {(session?.user as any)?.role === 'ADMIN' && (
              <NavButton href="/admin">Admin Panel</NavButton>
            )}
          </Box>

          {/* Search Bar */}
          <Box component="form" onSubmit={handleSearch} sx={{ display: { xs: 'none', sm: 'block' }, mr: 3 }}>
            <Search sx={{ borderRadius: '14px', backgroundColor: '#f3f4f6' }}>
              <SearchIconWrapper>
                <SearchIcon sx={{ fontSize: 20 }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Search>
          </Box>

          {/* Right Section: Actions & User */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{
              color: 'var(--text-secondary)',
              backgroundColor: '#f8fafc',
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}>
              <NotificationsNoneIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {!session ? (
              <Button
                component={Link}
                href="/login"
                variant="contained"
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 800,
                  px: 3.5,
                  py: 1,
                  background: 'var(--grad-primary)',
                  boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)',
                  '&:hover': { boxShadow: '0 12px 25px -5px rgba(37, 99, 235, 0.5)' }
                }}
              >
                Sign In
              </Button>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={handleMenu}
                  sx={{
                    p: 0.5,
                    pl: 1.5,
                    borderRadius: '50px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #eef2f6',
                    textTransform: 'none',
                    color: 'var(--text-primary)',
                    '&:hover': { backgroundColor: '#f1f5f9' }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700, mr: 1, display: { xs: 'none', sm: 'block' } }}>
                    {session.user?.name?.split(' ')[0]}
                  </Typography>
                  <Avatar sx={{
                    width: 32,
                    height: 32,
                    background: 'var(--grad-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
                  }}>
                    {session.user?.name?.charAt(0)}
                  </Avatar>
                  <KeyboardArrowDownIcon sx={{ ml: 0.5, color: '#94a3b8', fontSize: 18 }} />
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 10px 25px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        borderRadius: '16px',
                        minWidth: 240,
                        border: '1px solid #eef2f6',
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1.5,
                          borderRadius: '10px',
                          mx: 1,
                          my: 0.5,
                          gap: 2,
                          '&:hover': { backgroundColor: '#f8fafc' }
                        },
                      },
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2.5, py: 2, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                      {session.user?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                      {session.user?.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ mx: 2, mb: 1, opacity: 0.6 }} />

                  <MenuItem>
                    <PersonOutlinedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Profile Settings</Typography>
                  </MenuItem>

                  <MenuItem>
                    <BadgeOutlinedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>My Certificates</Typography>
                  </MenuItem>

                  <Divider sx={{ mx: 2, my: 1, opacity: 0.6 }} />

                  <MenuItem onClick={() => signOut()} sx={{ color: '#ef4444' }}>
                    <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
