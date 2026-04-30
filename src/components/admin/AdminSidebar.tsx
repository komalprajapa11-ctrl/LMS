'use client';

import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box 
} from '@mui/material';
import SubjectIcon from '@mui/icons-material/Subject';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const styles = {
  sidebar: {
    p: 0,
    borderRadius: 3,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    height: 'fit-content',
    position: 'sticky',
    top: 100
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
    borderLeft: active ? '4px solid var(--primary-main)' : '4px solid transparent',
    backgroundColor: active ? 'rgba(25, 118, 210, 0.06)' : 'transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
  }),
};

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Subjects',             icon: <SubjectIcon />,      href: '/admin' },
    { label: 'Manage Topics',        icon: <MenuBookIcon />,     href: '/admin/curriculum' },
    { label: 'Quizzes',              icon: <QuizIcon />,         href: '/admin/quizzes' },
    { label: 'Interview Questions',  icon: <ContactSupportIcon />,  href: '/admin/interview-questions' },
  ];

  return (
    <Box sx={{ width: 260, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
      <Paper elevation={0} sx={styles.sidebar}>
        <Typography sx={styles.sidebarHeader}>
          Admin Control
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={isActive}
                sx={styles.sidebarItem(isActive)}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'var(--primary-main)' : 'var(--text-secondary)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: isActive ? 700 : 600,
                        fontSize: '0.92rem',
                        color: isActive ? 'var(--primary-main)' : 'var(--text-primary)',
                      }
                    }
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}
