import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  IconButton,
  Alert,
  Chip,
  LinearProgress,
  Tooltip,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  ContentCopy,
  Refresh,
  Visibility,
  VisibilityOff,
  Security,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { AuthContext } from 'context/AuthContext';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { setPageTitle } = useContext(AuthContext)
  
    useEffect(()=>{
      setPageTitle(()=>"Generator")
      return()=>setPageTitle("...")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  const generatePassword = useCallback(() => {
    let charset = '';
    let requiredChars = '';

    // Build character set based on options
    if (options.uppercase) {
      charset += charSets.uppercase;
      requiredChars += charSets.uppercase.charAt(Math.floor(Math.random() * charSets.uppercase.length));
    }
    if (options.lowercase) {
      charset += charSets.lowercase;
      requiredChars += charSets.lowercase.charAt(Math.floor(Math.random() * charSets.lowercase.length));
    }
    if (options.numbers) {
      charset += charSets.numbers;
      requiredChars += charSets.numbers.charAt(Math.floor(Math.random() * charSets.numbers.length));
    }
    if (options.symbols) {
      charset += charSets.symbols;
      requiredChars += charSets.symbols.charAt(Math.floor(Math.random() * charSets.symbols.length));
    }

    // Remove similar/ambiguous characters if requested
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !charSets.similar.includes(char)).join('');
    }
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !charSets.ambiguous.includes(char)).join('');
    }

    if (charset.length === 0) {
      setPassword('');
      return;
    }

    // Generate random password
    let newPassword = requiredChars;
    for (let i = requiredChars.length; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle the password to avoid predictable patterns
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(newPassword);
    setCopied(false);
  }, [length, options]);

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'No Password', color: 'error' };
    
    let score = 0;
    let feedback = [];

    // Length scoring
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    else feedback.push('Use at least 12 characters');

    // Character variety scoring
    if (/[a-z]/.test(pwd)) score += 15;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(pwd)) score += 15;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(pwd)) score += 15;
    else feedback.push('Add numbers');
    
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    else feedback.push('Add symbols');

    // Bonus for no repeated patterns
    if (!/(.)\1{2,}/.test(pwd)) score += 10;
    else feedback.push('Avoid repeated characters');

    let label, color;
    if (score >= 80) {
      label = 'Very Strong';
      color = 'success';
    } else if (score >= 60) {
      label = 'Strong';
      color = 'info';
    } else if (score >= 40) {
      label = 'Moderate';
      color = 'warning';
    } else {
      label = 'Weak';
      color = 'error';
    }

    return { score, label, color, feedback };
  };

  const strength = calculateStrength(password);

  const copyToClipboard = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy password');
      }
    }
  };

  const handleOptionChange = (option) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  // Generate initial password
  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const getStrengthIcon = () => {
    switch (strength.color) {
      case 'success': return <CheckCircle color="success" />;
      case 'info': return <Security color="info" />;
      case 'warning': return <Warning color="warning" />;
      default: return <Warning color="error" />;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            🔐 Password Generator
          </Typography>

          {/* Generated Password Display */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="Generated Password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'monospace',
                  fontSize: '1.1rem'
                }
              }}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                      <IconButton onClick={copyToClipboard} edge="end">
                        <ContentCopy color={copied ? "success" : "inherit"} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Password Strength Indicator */}
          {password && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {getStrengthIcon()}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Strength: {strength.label}
                </Typography>
                <Chip 
                  label={`${strength.score}%`} 
                  color={strength.color} 
                  size="small" 
                  sx={{ ml: 2 }}
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={strength.score} 
                color={strength.color}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Password Length */}
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Password Length: {length} characters
            </Typography>
            <Slider
              value={length}
              onChange={(e, value) => setLength(value)}
              min={4}
              max={128}
              marks={[
                { value: 8, label: '8' },
                { value: 16, label: '16' },
                { value: 32, label: '32' },
                { value: 64, label: '64'  }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          {/* Character Options */}
          <Typography variant="h6" gutterBottom>
            Character Types
          </Typography>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.uppercase}
                  onChange={() => handleOptionChange('uppercase')}
                />
              }
              label="Uppercase Letters (A-Z)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.lowercase}
                  onChange={() => handleOptionChange('lowercase')}
                />
              }
              label="Lowercase Letters (a-z)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.numbers}
                  onChange={() => handleOptionChange('numbers')}
                />
              }
              label="Numbers (0-9)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.symbols}
                  onChange={() => handleOptionChange('symbols')}
                />
              }
              label="Symbols (!@#$%^&*)"
            />
          </Box>

          {/* Advanced Options */}
          <Typography variant="h6" gutterBottom>
            Advanced Options
          </Typography>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.excludeSimilar}
                  onChange={() => handleOptionChange('excludeSimilar')}
                />
              }
              label="Exclude Similar Characters (i, l, 1, L, o, 0, O)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.excludeAmbiguous}
                  onChange={() => handleOptionChange('excludeAmbiguous')}
                />
              }
              label="Exclude Ambiguous Characters ({ } [ ] ( ) / \\ '  ` ~ , ; . < >)"
            />
          </Box>

          {/* Generate Button */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Refresh />}
              onClick={generatePassword}
              fullWidth
              disabled={!Object.values(options).slice(0, 4).some(Boolean)}
            >
              Generate New Password
            </Button>
          </Box>

          {/* Warnings */}
          {!Object.values(options).slice(0, 4).some(Boolean) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please select at least one character type!
            </Alert>
          )}

          {copied && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password copied to clipboard!
            </Alert>
          )}

          {strength?.feedback?.length > 0 && password && (
            <Alert severity="info">
              <Typography variant="body2" component="div">
                <strong>Suggestions:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {strength.feedback.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PasswordGenerator;