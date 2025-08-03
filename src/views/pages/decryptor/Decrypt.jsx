import React, { useState, useCallback, useEffect, useContext } from 'react';
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
  Snackbar,
  InputAdornment,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  LockOpen,
  Visibility,
  VisibilityOff,
  Download,
  CloudUpload,
  Security,
  CheckCircle,
  ErrorOutline,
  Description,
  Delete,
  Archive
} from '@mui/icons-material';
import { AuthContext } from 'context/AuthContext';

const Decrypt = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Changed to array
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedFiles, setDecryptedFiles] = useState([]); // Array of decrypted files
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dragOver, setDragOver] = useState(false);
  const [decryptionProgress, setDecryptionProgress] = useState(0);
  const { setPageTitle } = useContext(AuthContext);

  useEffect(() => {
    setPageTitle(() => "Decrypt");
    return () => setPageTitle("...");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFileSelect = useCallback(async (files) => {
    const encFiles = Array.from(files).filter(file => file.name.endsWith('.enc'));
    
    if (encFiles.length === 0) {
      showSnackbar('Please select valid encrypted files (.enc)', 'error');
      return;
    }

    if (encFiles.length !== files.length) {
      showSnackbar(`${files.length - encFiles.length} non-.enc files were ignored`, 'warning');
    }

    try {
      // Read files immediately to prevent reference loss
      const fileDataArray = [];
      
      for (const file of encFiles) {
        try {
          // Create a new File object to ensure we have a stable reference
          const fileBlob = new Blob([file], { type: file.type });
          const arrayBuffer = await fileBlob.arrayBuffer();
          
          fileDataArray.push({
            name: file.name,
            size: file.size,
            data: arrayBuffer,
            type: file.type,
            lastModified: file.lastModified
          });
        } catch (fileError) {
          console.error(`Error reading file ${file.name}:`, fileError);
          showSnackbar(`Error reading file: ${file.name}`, 'error');
        }
      }

      if (fileDataArray.length > 0) {
        setSelectedFiles(fileDataArray);
        setDecryptedFiles([]);
        showSnackbar(`${fileDataArray.length} encrypted file(s) selected and loaded`, 'success');
      }
      
    } catch (error) {
      console.error('Error processing files:', error);
      showSnackbar('Error processing selected files', 'error');
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    try {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await handleFileSelect(files);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      showSnackbar('Error processing dropped files', 'error');
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (newFiles.length === 0) {
      setDecryptedFiles([]);
    }
  };

  const decryptSingleFile = async (fileData, password) => {
    try {
      if (!fileData.data || fileData.data.byteLength === 0) {
        throw new Error('File data is empty or corrupted');
      }
      
      const dataArray = new Uint8Array(fileData.data);

      // Validate file structure
      if (dataArray.length < 20) { // Minimum size check
        throw new Error('File appears to be corrupted or not a valid encrypted file');
      }

      // Extract filename length and filename
      const filenameLengthBytes = dataArray.slice(0, 4);
      const filenameLength = new Uint32Array(filenameLengthBytes.buffer)[0];
      
      if (filenameLength > 1000 || filenameLength <= 0) { // Sanity check
        throw new Error('Invalid filename length in encrypted file');
      }
      
      const filenameBytes = dataArray.slice(4, 4 + filenameLength);
      const extractedFileName = new TextDecoder().decode(filenameBytes);

      // Extract salt, iv, and encrypted content
      let offset = 4 + filenameLength;
      
      if (offset + 28 > dataArray.length) { // 16 (salt) + 12 (iv) = 28
        throw new Error('File is too small to contain required encryption data');
      }
      
      const salt = dataArray.slice(offset, offset + 16);
      offset += 16;
      const iv = dataArray.slice(offset, offset + 12);
      offset += 12;
      const encrypted = dataArray.slice(offset);

      if (encrypted.length === 0) {
        throw new Error('No encrypted data found in file');
      }
      // Derive key from password and salt
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      const derivedKey = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      // Decrypt
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        derivedKey,
        encrypted
      );

      return {
        fileName: extractedFileName,
        data: new Uint8Array(decrypted),
        originalEncryptedName: fileData.name
      };
      
    } catch (error) {
      console.error(`Error decrypting file ${fileData.name}:`, error);
      throw new Error(`Failed to decrypt ${fileData.name}: ${error.message}`);
    }
  };

  const decryptFiles = async () => {
    if (selectedFiles.length === 0 || !password) {
      showSnackbar('Please select files and enter the password', 'error');
      return;
    }

    setIsDecrypting(true);
    setDecryptionProgress(0);
    const decrypted = [];
    let successCount = 0;

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const fileData = selectedFiles[i];
        
        try {
          const decryptedFile = await decryptSingleFile(fileData, password);
          decrypted.push(decryptedFile);
          successCount++;
          
          // Update progress
          setDecryptionProgress(((i + 1) / selectedFiles.length) * 100);
          
        } catch (fileError) {
          console.error(`Failed to decrypt ${fileData.name}:`, fileError);
          showSnackbar(`Failed to decrypt ${fileData.name}`, 'error');
        }
      }

      if (successCount > 0) {
        setDecryptedFiles(decrypted);
        showSnackbar(`Successfully decrypted ${successCount}/${selectedFiles.length} files! 🎉`, 'success');
      } else {
        showSnackbar('No files could be decrypted. Please check your password.', 'error');
      }

    } catch (error) {
      console.error('Decryption error:', error);
      showSnackbar(`Decryption failed: ${error.message}`, 'error');
    } finally {
      setIsDecrypting(false);
      setDecryptionProgress(0);
    }
  };

  // Simple ZIP creation function (basic implementation)
  const createZip = (files) => {
    // This is a basic ZIP implementation. For production, consider using JSZip library
    const zipData = [];
    
    files.forEach(file => {
      const fileName = file.fileName;
      const fileData = file.data;
      
      // Basic file entry (simplified - for production use JSZip)
      zipData.push({
        name: fileName,
        data: fileData
      });
    });
    
    return zipData;
  };

  const downloadAsZip = async () => {
    if (decryptedFiles.length === 0) return;

    try {
      // For a proper ZIP implementation, you would use JSZip library
      // This is a simplified version that creates individual downloads
      // To implement real ZIP, install jszip: npm install jszip
      
      if (decryptedFiles.length === 1) {
        // Single file - download directly
        const file = decryptedFiles[0];
        const blob = new Blob([file.data]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSnackbar(`Downloaded: ${file.fileName}`, 'success');
      } else {
        // Multiple files - create a simple archive (or download individually)
        // For real ZIP functionality, uncomment below and install jszip
        
        /*
        // Real ZIP implementation with JSZip:
        const JSZip = require('jszip');
        const zip = new JSZip();
        
        decryptedFiles.forEach(file => {
          zip.file(file.fileName, file.data);
        });
        
        const content = await zip.generateAsync({type:"blob"});
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `decrypted_files_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        */
        
        // Temporary solution: download files individually
        for (let i = 0; i < decryptedFiles.length; i++) {
          const file = decryptedFiles[i];
          const blob = new Blob([file.data]);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Small delay between downloads
          if (i < decryptedFiles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        showSnackbar(`Downloaded ${decryptedFiles.length} files individually`, 'success');
      }
      
    } catch (error) {
      console.error('Download error:', error);
      showSnackbar('Error downloading files', 'error');
    }
  };

  const isFormValid = password && selectedFiles.length > 0;

  const securityRequirements = [
    { icon: <Security />, text: 'Original password used to encrypt the bridge' },
    { icon: <Description />, text: 'Encrypted files (.enc extension)' },
    { icon: <CheckCircle />, text: 'Files are decrypted locally in your browser' },
    { icon: <ErrorOutline />, text: 'No data is sent to any servers' }
  ];

  return (
    <Box>
      <Container maxWidth="md">
        <Box textAlign="center" mb={4}>
          <Typography variant="h6" color="text.secondary">
            Decrypt your secure files safely - Single or Multiple files
          </Typography>
        </Box>

        {/* Security Info */}
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle sx={{ fontWeight: 600 }}>🔒 Decryption Requirements</AlertTitle>
          <List dense sx={{ mt: 1 }}>
            {securityRequirements.map((requirement, index) => (
              <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {React.cloneElement(requirement.icon, { fontSize: 'small', color: 'warning' })}
                </ListItemIcon>
                <ListItemText 
                  primary={requirement.text} 
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
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && decryptFiles()}
            placeholder="Enter the password used for encryption"
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
        </Box>

        {/* File Drop Zone */}
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: dragOver ? 'primary.main' : selectedFiles.length > 0 ? 'success.main' : 'grey.400',
            backgroundColor: dragOver ? 'action.hover' : selectedFiles.length > 0 ? 'success.light' : 'background.paper',
            transition: 'all 0.3s ease',
            mb: 3,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.primary" gutterBottom>
            {selectedFiles.length > 0 
              ? `${selectedFiles.length} file(s) selected` 
              : 'Drag & drop encrypted files here'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedFiles.length > 0 
              ? 'Click to add more files or drag additional files here'
              : 'Supports multiple .enc files - or click to select files'
            }
          </Typography>
          <input
            id="fileInput"
            type="file"
            accept=".enc"
            multiple
            onChange={(e) => e.target.files.length > 0 && handleFileSelect(Array.from(e.target.files))}
            style={{ display: 'none' }}
          />
        </Paper>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Selected Files ({selectedFiles.length})
              </Typography>
              <Grid container spacing={1}>
                {selectedFiles.map((file, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Chip
                      label={`${file.name} (${(file.size / 1024).toFixed(1)} KB)`}
                      onDelete={() => removeFile(index)}
                      deleteIcon={<Delete />}
                      variant="outlined"
                      sx={{ width: '100%', justifyContent: 'space-between' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        {isDecrypting && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Decrypting files... {Math.round(decryptionProgress)}%
            </Typography>
            <LinearProgress variant="determinate" value={decryptionProgress} />
          </Box>
        )}

        {/* Decrypt Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={decryptFiles}
          disabled={!isFormValid || isDecrypting}
          startIcon={isDecrypting ? null : <LockOpen />}
          sx={{ mb: 2, py: 1.5 }}
        >
          {isDecrypting ? (
            `🔓 Decrypting ${selectedFiles.length} file(s)...`
          ) : (
            `🔓 Decrypt ${selectedFiles.length} File(s)`
          )}
        </Button>

        {/* Download Button */}
        {decryptedFiles.length > 0 && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="myBlue"
            onClick={downloadAsZip}
            startIcon={decryptedFiles.length > 1 ? <Archive /> : <Download />}
            sx={{ py: 1.5, color: "#fff" }}
          >
            {decryptedFiles.length > 1 
              ? `📦 Download ${decryptedFiles.length} Files` 
              : '📥 Download Decrypted File'
            }
          </Button>
        )}

        {/* Success Message */}
        {decryptedFiles.length > 0 && (
          <Card sx={{ mt: 3, backgroundColor: '#eee' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle sx={{ color: 'success.dark', mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: 'success.dark', fontWeight: 600 }}>
                    Decryption Successful!
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'success.dark' }}>
                    {decryptedFiles.length} file(s) decrypted successfully
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom>Decrypted Files:</Typography>
              {decryptedFiles.map((file, index) => (
                <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                  • {file.fileName} ({(file.data.length / 1024).toFixed(1)} KB)
                </Typography>
              ))}
            </CardContent>
          </Card>
        )}
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

export default Decrypt;