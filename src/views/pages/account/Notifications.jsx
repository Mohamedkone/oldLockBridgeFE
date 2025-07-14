import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Button,
    Divider,
} from "@mui/material";

const Notifications = () => {
  // Initial state for notifications
    const initialState = {
        general: {
        email: true,
        push: false,
        sms: false,
        },
        security: {
        email: true,
        push: true,
        sms: false,
        },
        activity: {
        email: false,
        push: true,
        sms: true,
        },
    };

    // State for notifications and tracking changes
    const [notifications, setNotifications] = useState(initialState);
    const [isChanged, setIsChanged] = useState(false);

    // Check if there are any changes compared to the initial state
    const checkForChanges = (current, initial) => {
        return JSON.stringify(current) !== JSON.stringify(initial);
    };

    // Update isChanged state whenever notifications are modified
    useEffect(() => {
        setIsChanged(checkForChanges(notifications, initialState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notifications]);

    // Handle toggle
    const handleToggle = (category, type) => {
        setNotifications((prevState) => ({
        ...prevState,
        [category]: {
            ...prevState[category],
            [type]: !prevState[category][type],
        },
        }));
    };

    // Handle save changes
    const handleSave = () => {
        alert("Your notification preferences have been saved!");
        setIsChanged(false); // Reset isChanged after saving
    };

    return (
        <Box p={4}>
        <Typography variant="h3" gutterBottom>
            Notification Preferences
        </Typography>

        {/* General Notifications */}
        <Box mt={3}>
            <Typography variant="h6">General Notifications</Typography>
            <FormControlLabel
            control={
                <Switch
                checked={notifications.general.email}
                onChange={() => handleToggle("general", "email")}
                />
            }
            label="Email Notifications"
            />
            <FormControlLabel
            control={
                <Switch
                checked={notifications.general.push}
                onChange={() => handleToggle("general", "push")}
                />
            }
            label="Push Notifications"
            />
            <FormControlLabel
            control={
                <Switch
                checked={notifications.general.sms}
                onChange={() => handleToggle("general", "sms")}
                />
            }
            label="SMS Notifications"
            />
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Security Notifications */}
        <Box mt={3}>
            <Typography variant="h6">Security Notifications</Typography>
            <FormControlLabel
            control={
                <Switch
                checked={notifications.security.email}
                onChange={() => handleToggle("security", "email")}
                />
            }
            label="Email Notifications"
            />
            <FormControlLabel
            control={
                <Switch
                checked={notifications.security.push}
                onChange={() => handleToggle("security", "push")}
                />
            }
            label="Push Notifications"
            />
            <FormControlLabel
            control={
                <Switch
                checked={notifications.security.sms}
                onChange={() => handleToggle("security", "sms")}
                />
            }
            label="SMS Notifications"
            />
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Activity Notifications */}
        <Box mt={3}>
            <Typography variant="h6">Activity Notifications</Typography>
            <FormControlLabel
            control={
                <Switch
                checked={notifications.activity.email}
                onChange={() => handleToggle("activity", "email")}
                />
            }
            label="Email Notifications"
            />
            <FormControlLabel
            control={
                <Switch
                checked={notifications.activity.push}
                onChange={() => handleToggle("activity", "push")}
                />
            }
            label="Push Notifications"
            />
            <FormControlLabel
            control={
                <Switch
                checked={notifications.activity.sms}
                onChange={() => handleToggle("activity", "sms")}
                />
            }
            label="SMS Notifications"
            />
        </Box>

        {/* Save Button */}
        <Box mt={4}>
            <Button
            variant="contained"
            color="myBlue"
            disabled={!isChanged}
            onClick={handleSave} sx={{
                borderRadius:"30px",
                color:"#fff"
            }}
            >
            Save Changes
            </Button>
        </Box>
        </Box>
    );
};

export default Notifications;
