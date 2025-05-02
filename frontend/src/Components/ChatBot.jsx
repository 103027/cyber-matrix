import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    IconButton,
    Typography,
    TextField,
    Paper,
    Fade,
} from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '../contexts/theme/ThemeContext';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import api from "../api/axios_token.jsx";

export default function ChatBot() {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);
    const messagesEndRef = useRef(null);

    const handleSendMessage = async () => {
        if (message.trim() === '') return;
        const userMessage = message; // store message first
        setMessages([...messages, { message: userMessage, response: '...' }]);
        setMessage('');
        try {
            const response = await api.post('/chat', { message: userMessage });
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].response = response.data.response;
                return newMessages;
            });
        } catch (error) {
            console.error('API error:', error);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].response = "Something went wrong. Please try again.";
                return newMessages;
            });
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setOpen(false);
                setMessages([]);
            }
        }
    
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 35,
                    zIndex: 1000,
                    backgroundColor: theme.ChatBot_IconButton,
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                }}
            >
                <IconButton
                    sx={{
                        color: theme.ChatBot_text,
                        bgcolor: theme.ChatBot_IconButton_bg,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        '&:hover': {
                            bgcolor: theme.ChatBot_IconButton_bg_Hover,
                        },
                    }}
                    onClick={() => setOpen(!open)}
                >
                    <ChatBubbleIcon sx={{ fontSize: 40, color: theme.ChatBot_IconButton_msgIcon }} />
                </IconButton>
            </Box>

            <Fade in={open}>
                <Paper
                    ref={chatRef}
                    elevation={6}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 15,
                        width: 370,
                        height: 450,
                        bgcolor: theme.ChatBot_bg,
                        color: theme.ChatBot_text,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1300,
                        border: '1px solid ' + theme.ChatBot_border,
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 2,
                            py: 1.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ChatBubbleIcon sx={{ fontSize: 40, color: theme.ChatBot_Ask_Anything }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                Ask Anything
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: theme.ChatBot_text }}>
                            <CloseIcon fontSize="small" onClick={() => {setOpen(false); setMessages([]);}}/>
                        </IconButton>
                    </Box>

                    {/* Chat Content */}
                    {
                        messages.length > 0 ? (
                            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                                <Box sx={{ mb: 2 }}>
                                    {
                                        messages.map((message, index) => (
                                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: 600,
                                                            bgcolor: theme.ChatBot_message_bg,
                                                            color: theme.ChatBot_message_text,
                                                            px: 2,
                                                            py: 1,
                                                            borderRadius: "15px 0px 15px 15px",
                                                            maxWidth: '65%',
                                                        }}
                                                    >
                                                        {message.message}
                                                    </Typography>
                                                    <PermIdentityIcon fontSize="large" sx={{ color: theme.ChatBot_Ask_Anything }} />
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                                                    <ChatBubbleIcon sx={{ color: theme.ChatBot_Ask_Anything }} fontSize="large" />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontWeight: 600,
                                                            bgcolor: theme.ChatBot_response_bg,
                                                            color: theme.ChatBot_response_text,
                                                            px: 2,
                                                            py: 1,
                                                            borderRadius: "0px 15px 15px 15px",
                                                            maxWidth: '65%',
                                                        }}
                                                    >
                                                        {message.response}
                                                    </Typography>
                                                </Box>
                                                <div ref={messagesEndRef} />
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ChatBubbleIcon sx={{ fontSize: 80, color: theme.ChatBot_Ask_Anything }} />
                            </Box>
                        )}

                    {/* Input Field */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: 1,
                            py: 0.5,
                            m: 1,
                            bgcolor: theme.ChatBot_bg,
                            border: '1px solid ' + theme.ChatBot_Ask_Anything,
                            borderRadius: 5,
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Enter Question"
                            InputProps={{
                                disableUnderline: true,
                                style: { color: theme.ChatBot_text, fontFamily: 'Poppins, sans-serif', fontWeight: 600 },
                            }}
                            sx={{
                                input: { px: 1.5, py: 1 },
                            }}
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <IconButton sx={{ color: theme.ChatBot_Ask_Anything }} onClick={handleSendMessage}>
                            <SendIcon sx={{ color: theme.ChatBot_Ask_Anything }}/>
                        </IconButton>
                    </Box>
                </Paper>
            </Fade>
        </>
    )
}