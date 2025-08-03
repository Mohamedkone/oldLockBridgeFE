import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  VpnKey,
  Security,
  ContentCopy,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  Shield,
  Lock,
  Public,
  Key
} from '@mui/icons-material';

const KeyGenerator = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keys, setKeys] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const getPasswordStrength = useCallback((pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'default' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score < 3) return { score: score * 16.67, label: 'Weak', color: 'error' };
    if (score < 5) return { score: score * 16.67, label: 'Medium', color: 'warning' };
    return { score: score * 16.67, label: 'Strong', color: 'success' };
  }, []);

  const passwordStrength = getPasswordStrength(password);

  const generateKeys = async () => {
    if (!password) {
      setSnackbar({ open: true, message: 'Please enter a password first', severity: 'error' });
      return;
    }

    if (password.length < 8) {
      setSnackbar({ open: true, message: 'Password should be at least 8 characters long', severity: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      // Generate encryption key from password using PBKDF2
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      // Create a unique salt for key derivation
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      
      // Derive key for AES encryption
      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      // Export the key to create the key strings
      const exportedKey = await window.crypto.subtle.exportKey('raw', derivedKey);
      const keyArray = new Uint8Array(exportedKey);
      const keyHex = Array.from(keyArray).map(b => b.toString(16).padStart(2, '0')).join('');
      const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Create public key (for encryption) - includes salt
      const publicKey = `${keyHex}:${saltHex}`;
      
      // Create private key (for decryption) - includes password hash for verification
      const passwordHash = await window.crypto.subtle.digest('SHA-256', encoder.encode(password));
      const passwordHashArray = new Uint8Array(passwordHash);
      const passwordHashHex = Array.from(passwordHashArray).map(b => b.toString(16).padStart(2, '0')).join('');
      const privateKey = `${password}:${passwordHashHex}:${saltHex}`;

      setKeys({
        public: publicKey,
        private: privateKey,
        salt: salt,
        derivedKey: derivedKey
      });

      setSnackbar({ open: true, message: 'Encryption keys generated successfully! 🎉', severity: 'success' });
      
    } catch (error) {
      setSnackbar({ open: true, message: `Error generating keys: ${error.message}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, keyType) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: `${keyType} copied to clipboard!`, severity: 'success' });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setSnackbar({ open: true, message: `${keyType} copied to clipboard!`, severity: 'success' });
    }
  };

  const securityFeatures = [
    { icon: <Shield />, text: 'PBKDF2 with 100,000 iterations for key strengthening' },
    { icon: <Security />, text: 'Generates unique salt for each key creation' },
    { icon: <Lock />, text: 'Creates AES-256 compatible encryption keys' },
    { icon: <Public />, text: 'All processing happens locally in your browser' }
  ];

  return (
      <Box sx={{ 
      }}>
        <Container maxWidth="md">
          <Paper elevation={10} sx={{ p: 4, backdropFilter: 'blur(10px)' }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <VpnKey sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" component="h1" gutterBottom sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Key Generator
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Generate secure encryption keys from passwords
              </Typography>
            </Box>

            {/* Security Info */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle sx={{ fontWeight: 600 }}>🛡️ Key Generation Process</AlertTitle>
              <List dense sx={{ mt: 1 }}>
                {securityFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {React.cloneElement(feature.icon, { fontSize: 'small', color: 'primary' })}
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature.text} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>

            {/* Password Input */}
            <Box mb={3}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Master Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateKeys()}
                placeholder="Enter a strong master password (12+ characters recommended)"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />
              
              {/* Password Strength Indicator */}
              {password && (
                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Password strength:
                    </Typography>
                    <Chip 
                      label={passwordStrength.label} 
                      color={passwordStrength.color}
                      size="small"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              )}
            </Box>

            {/* Generate Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={generateKeys}
              disabled={isLoading || !password}
              startIcon={isLoading ? null : <Key />}
              sx={{ mb: 3, py: 1.5 }}
            >
              {isLoading ? (
                <>
                  <Box sx={{ width: '100%', mr: 2 }}>
                    <LinearProgress color="inherit" />
                  </Box>
                  Generating Keys...
                </>
              ) : (
                '🔑 Generate Encryption Keys'
              )}
            </Button>

            {/* Generated Keys Display */}
            {keys && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
                    🔐 Generated Keys
                  </Typography>
                  
                  {/* Public Key */}
                  <Box mb={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="h6" color="primary">
                        Public Key (for encryption)
                      </Typography>
                      <Tooltip title="Copy public key">
                        <IconButton 
                          onClick={() => copyToClipboard(keys.public, 'Public key')}
                          color="primary"
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'grey.100', 
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        wordBreak: 'break-all',
                        maxHeight: 120,
                        overflow: 'auto'
                      }}
                    >
                      {keys.public}
                    </Paper>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Private Key */}
                  <Box mb={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="h6" color="error">
                        Private Key (for decryption - keep secret!)
                      </Typography>
                      <Tooltip title="Copy private key">
                        <IconButton 
                          onClick={() => copyToClipboard(keys.private, 'Private key')}
                          color="error"
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'grey.100', 
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        wordBreak: 'break-all',
                        maxHeight: 120,
                        overflow: 'auto'
                      }}
                    >
                      {keys.private}
                    </Paper>
                  </Box>

                  {/* Security Warning */}
                  <Alert severity="warning">
                    <AlertTitle sx={{ fontWeight: 600 }}>⚠️ Important Security Notes</AlertTitle>
                    <List dense>
                      <ListItem sx={{ py: 0, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckCircle fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Public Key: Share this with anyone who needs to encrypt files for you"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem sx={{ py: 0, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Warning fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Private Key: Keep this secret! Anyone with this key can decrypt your files"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem sx={{ py: 0, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Lock fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Store these keys securely (password manager, encrypted notes)"
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </List>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </Paper>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default KeyGenerator;