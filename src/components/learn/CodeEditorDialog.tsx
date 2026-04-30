'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, Box, Typography, Button, IconButton, Stack, Divider,
  useMediaQuery, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CodeEditorDialogProps {
  open: boolean;
  onClose: () => void;
  initialCode: string;
  language: string;
}

export default function CodeEditorDialog({ open, onClose, initialCode, language }: CodeEditorDialogProps) {
  const [code, setCode] = useState(initialCode);
  const [srcDoc, setSrcDoc] = useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (open) {
      setCode(initialCode);
      runCode(initialCode);
    }
  }, [open, initialCode]);

  const runCode = (codeToRun: string) => {
    // For HTML/CSS/JS, we create a full document
    const isHtml = language.toLowerCase() === 'html' || !language;
    
    if (isHtml) {
      setSrcDoc(codeToRun);
    } else {
      // If just JS or other, wrap it
      setSrcDoc(`
        <html>
          <body>
            <div id="root"></div>
            <script>${codeToRun}</script>
          </body>
        </html>
      `);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Dialog 
      fullScreen={true} 
      maxWidth={false} 
      open={open} 
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { 
            borderRadius: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        px: 3, py: 1.5, 
        background: '#2d2d2d', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            Technotoil Editor v1.0
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ borderColor: '#444' }} />
          <Button 
            variant="contained" 
            startIcon={<PlayArrowIcon />}
            onClick={() => runCode(code)}
            sx={{ 
              backgroundColor: '#059669', 
              '&:hover': { backgroundColor: '#047857' },
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Run
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={handleCopy} sx={{ color: '#9ca3af' }}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: '#9ca3af' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Editor & Preview Split */}
      <Box sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
        {/* Code Input */}
        <Box sx={{ 
          flex: 1, 
          position: 'relative', 
          backgroundColor: '#1e1e1e',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '4px solid #f1f5f9',
          '& ::-webkit-scrollbar': { width: '10px' },
          '& ::-webkit-scrollbar-track': { backgroundColor: '#1e1e1e' },
          '& ::-webkit-scrollbar-thumb': { 
            backgroundColor: '#333', 
            borderRadius: '10px',
            '&:hover': { backgroundColor: '#444' }
          }
        }}>
          <Typography variant="caption" sx={{ 
            position: 'absolute', top: 10, right: 20, 
            color: 'rgba(255,255,255,0.3)', fontWeight: 800, zIndex: 5,
            pointerEvents: 'none'
          }}>
            EDITOR
          </Typography>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: 'transparent',
              color: '#d4d4d4',
              fontFamily: '"Fira Code", "Consolas", monospace',
              fontSize: '17px',
              padding: '30px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              lineHeight: '1.7',
              scrollbarWidth: 'thin',
              scrollbarColor: '#333 #1e1e1e'
            }}
          />
        </Box>

        {/* Result Preview */}
        <Box sx={{ 
          flex: 1, 
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          <Typography variant="caption" sx={{ 
            position: 'absolute', top: 10, right: 20, 
            color: 'rgba(0,0,0,0.1)', fontWeight: 800, zIndex: 5,
            pointerEvents: 'none'
          }}>
            RESULT
          </Typography>
          <iframe
            srcDoc={srcDoc}
            title="output"
            sandbox="allow-scripts"
            frameBorder="0"
            style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: 'white'
            }}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
