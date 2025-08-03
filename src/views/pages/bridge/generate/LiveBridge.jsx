import { Box, Button, ButtonGroup, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Alert, LinearProgress, Chip } from '@mui/material'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { AuthContext } from 'context/AuthContext'
import { useTheme } from '@emotion/react'

function LiveBridge({ close }) {
    const theme = useTheme();
    const { api, myInfo } = useContext(AuthContext);
    const storageTypeMap = {
        drive: "api",
        dropbox: "api",
        onedrive: "api",
        vault: "vault",
        s3: "s3",
        aws: "s3",
        gcp: "s3",
        azure: "s3",
    };
    const [alias, setAlias] = useState("");
    const [storage, setStorage] = useState(""); 
    const [storageList, setStorageList] = useState([]);
    const [exp, setExp] = useState(""); 
    const [pass, setPass] = useState(""); 
    const [access, setAccess] = useState(""); 
    const [security, setSecurity] = useState(""); 
    const [storageType, setStorageType] = useState(""); 
    
    // New encryption-related state
    const [publicKey, setPublicKey] = useState(""); // Stores generated public key
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const [keyGenerated, setKeyGenerated] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [storageRes, apiStorageRes, defaultStorage] = await Promise.all([
                    axios.get(`${api}/mystorages/${myInfo?.id}`),
                    axios.get(`${api}/api-storages/${myInfo?.id}`),
                    axios.get(`${api}/ds/livebridge/${myInfo?.id}`)
                ]);
                console.log(storageRes.data, apiStorageRes.data, defaultStorage.data)
    
                const mergedData = [defaultStorage.data, ...(storageRes.data || []), ...(apiStorageRes.data || [])];
    
                if (mergedData.length) setStorageList(mergedData);
            } catch (error) {
                console.error("Error fetching storage data:", error);
            }
        };
    
        if (myInfo?.id) fetch();
    }, [api, myInfo]);

    // Password strength calculation
    const getPasswordStrength = useCallback((pwd) => {
        if (!pwd) return { score: 0, label: '', color: 'default' };
        
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (pwd.length >= 16) score++; // Extra point for very long passwords
        if (/[a-z]/.test(pwd)) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        const percentage = (score / 7) * 100;

        if (score < 3) return { score: percentage, label: 'Weak', color: 'error' };
        if (score < 5) return { score: percentage, label: 'Medium', color: 'warning' };
        if (score < 6) return { score: percentage, label: 'Strong', color: 'success' };
        return { score: percentage, label: 'Very Strong', color: 'success' };
    }, []);

    // Generate encryption key from passphrase
    const generateEncryptionKey = async (passphrase) => {
        if (!passphrase || passphrase.length < 8) {
            return null;
        }

        setIsGeneratingKey(true);

        try {
            // Generate encryption key from passphrase using PBKDF2
            const encoder = new TextEncoder();
            const keyMaterial = await window.crypto.subtle.importKey(
                'raw',
                encoder.encode(passphrase),
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

            // Export the key to create the public key string
            const exportedKey = await window.crypto.subtle.exportKey('raw', derivedKey);
            const keyArray = new Uint8Array(exportedKey);
            const keyHex = Array.from(keyArray).map(b => b.toString(16).padStart(2, '0')).join('');
            const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Create public key (for encryption) - includes salt
            const generatedPublicKey = `${keyHex}:${saltHex}`;
            
            setPublicKey(generatedPublicKey);
            setKeyGenerated(true);
            
            return generatedPublicKey;
            
        } catch (error) {
            console.error('Error generating encryption key:', error);
            return null;
        } finally {
            setIsGeneratingKey(false);
        }
    };

    // Handle passphrase change and auto-generate key
    const handlePassphraseChange = async (e) => {
        const newPass = e.target.value;
        setPass(newPass);
        setKeyGenerated(false);
        setPublicKey("");

        // Only generate key if passphrase is strong enough
        const strength = getPasswordStrength(newPass);
        if (newPass.length >= 8 && strength.score >= 60) { // Require at least medium strength
            await generateEncryptionKey(newPass);
        }
    };

    const passwordStrength = getPasswordStrength(pass);

    const genLive = () => {
        // Include the public key in the request if Diamond security is selected
        const requestData = {
            storageId: storage,
            alias,
            status: true,
            ownerId: myInfo.id, 
            exp,
            access,
            security,
            storageType: storageTypeMap[storageType.toLowerCase()] || "s3",
        };

        // Add public key to request if Diamond security and key is generated
        if (security === 2 && publicKey) {
            requestData.key = publicKey;
        }

        axios.post(`${api}/livebridges`, requestData).then(() => {
            close()
            window.location.reload()
        });
    };

    const handleStorageSelect = (e) => {
        setStorage(e)
        for(let x of storageList){
            if (x.id === e) setStorageType(()=>x.platform||x.type)
        }
    }

    // Check if form is valid for submission
    const isFormValid = () => {
        const basicValid = alias && storage && access && security;
        if (security === 2) {
            return basicValid && pass.length >= 8 && passwordStrength.score >= 60 && keyGenerated;
        }
        return basicValid;
    };

    return (
        <Box
            p={1}
            display="flex"
            flexDirection="column"
            gap={2}
            maxWidth="400px"
        >
            <FormControl fullWidth>
                <TextField
                    label="Alias"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Storage</InputLabel>
                <Select
                    value={storage}
                    label="Storage"
                    onChange={(e) => handleStorageSelect(e.target.value)}
                >
                    {storageList.length > 0 ? (
                        storageList.map((x, i) => {
                            return(
                            <MenuItem value={x.id} key={i}>
                                {x.alias==='Vault'?`${x.alias} (default)`:x.alias}
                            </MenuItem>
                        )})
                    ) : (
                        <MenuItem value="">No storage available</MenuItem>
                    )}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    placeholder="Expiration date"
                    type="date"
                />
                <FormHelperText>
                    *The Bridge will be deleted on the set day.
                </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Access</InputLabel>
                <Select
                    value={access}
                    label="Access"
                    onChange={(e) => setAccess(e.target.value)}
                >
                    <MenuItem value={1}>Public</MenuItem>
                    <MenuItem value={2}>Private</MenuItem>
                    <MenuItem value={3}>Controlled Access</MenuItem>
                </Select>
                <FormHelperText>
                        *Public: Allows anyone with the link to send you data
                        <br />*Private: Allows any verified users with the link to send you data
                        <br />*Controlled Access: Allows access to only the users you have given access to
                </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Data security level</InputLabel>
                <Select
                    value={security}
                    label="Data security level"
                    onChange={(e) => setSecurity(e.target.value)}
                >
                    <MenuItem value={1}>Gold (simpler, faster, server-side)</MenuItem>
                    <MenuItem value={2}>Diamond (More secure, client-side)</MenuItem>
                </Select>
                <FormHelperText>
                        *Gold: Encrypt your data in transit and on the server using server keys
                        <br />*Diamond: Encrypt your data before it leaves the sender's device using client keys (End-to-End encryption)
                </FormHelperText>
            </FormControl>
            
            {security === 2 && (
                <>
                    <FormControl fullWidth>
                        <TextField
                            label="Encryption Passphrase"
                            value={pass}
                            onChange={handlePassphraseChange}
                            type="password"
                        />
                        <FormHelperText>
                            This will be used to generate encryption keys. For maximum security:
                            <br />• Use 12+ characters (16+ recommended)
                            <br />• Include uppercase, lowercase, numbers, and symbols
                            <br />• Avoid common words or personal information
                        </FormHelperText>
                    </FormControl>

                    {/* Password Strength Indicator */}
                    {pass && (
                        <Box sx={{ mb: 1 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                <span style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }}>
                                    Passphrase strength:
                                </span>
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

                    {/* Key Generation Status */}
                    {isGeneratingKey && (
                        <Alert severity="info">
                            <LinearProgress sx={{ mb: 1 }} />
                            Generating encryption keys...
                        </Alert>
                    )}

                    {keyGenerated && (
                        <Alert severity="success">
                            ✓ Encryption keys generated successfully! Your files will be secured with military-grade encryption.
                        </Alert>
                    )}

                    {pass && pass.length >= 8 && passwordStrength.score < 60 && (
                        <Alert severity="warning">
                            Passphrase strength is too low for secure encryption. Please use a stronger passphrase.
                        </Alert>
                    )}

                    {pass && pass.length > 0 && pass.length < 8 && (
                        <Alert severity="error">
                            Passphrase must be at least 8 characters long for security.
                        </Alert>
                    )}
                </>
            )}

            <ButtonGroup fullWidth sx={{ gap: "20px" }}>
                <Button
                    color="error"
                    variant="contained"
                    onClick={close}
                    sx={{
                        color: "#fff",
                        background: theme.palette.error.dark,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={genLive}
                    color="success"
                    disabled={!isFormValid()}
                    sx={{
                        color: "#fff",
                        background: isFormValid() ? theme.palette.success.dark : theme.palette.action.disabled,
                    }}
                >
                    Generate
                </Button>
            </ButtonGroup>
        </Box>
    );
}

export default LiveBridge;