// frontend/src/components/tools/SocraticTutorPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, ArrowLeft, Lightbulb, Plus, MessageSquare, Trash2, Menu } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Navbar from '../layout/TopNav.jsx'; // Assuming TopNav is the navbar

const SocraticTutorPage = () => {
    // Session State
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your Socratic Tutor. I'm here to help you learn by asking questions. What topic would you like to explore today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch Sessions on Mount
    useEffect(() => {
        loadSessions();
    }, []);

    const [searchParams] = useSearchParams();
    const sessionIdFromUrl = searchParams.get('sessionId');

    useEffect(() => {
        if (sessionIdFromUrl && sessionIdFromUrl !== currentSessionId) {
            handleSelectSession(sessionIdFromUrl);
        }
    }, [sessionIdFromUrl]);

    const loadSessions = async () => {
        try {
            const data = await api.getSocraticSessions();
            setSessions(data);
        } catch (error) {
            console.error("Failed to load sessions:", error);
        }
    };

    const handleNewChat = () => {
        setCurrentSessionId(null);
        setMessages([
            {
                role: 'assistant',
                content: "Hello! I'm your Socratic Tutor. I'm here to help you learn by asking questions. What topic would you like to explore today?"
            }
        ]);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSelectSession = async (sessionId) => {
        try {
            setIsLoading(true);
            const data = await api.getSocraticSession(sessionId);
            setMessages(data.messages);
            setCurrentSessionId(sessionId);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
        } catch (error) {
            console.error("Failed to load session:", error);
            toast.error("Failed to load conversation.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSession = async (e, sessionId) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this conversation?")) return;
        try {
            await api.deleteSocraticSession(sessionId);
            setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
            if (currentSessionId === sessionId) {
                handleNewChat();
            }
            toast.success("Conversation deleted.");
        } catch (error) {
            console.error("Failed to delete session:", error);
            toast.error("Failed to delete conversation.");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map(msg => ({ role: msg.role, content: msg.content }));
            history.push(userMessage);

            const data = await api.socraticChat({
                message: userMessage.content,
                history: history,
                sessionId: currentSessionId // Send current ID if exists
            });

            // If we started a new session, the backend returns the new ID
            if (!currentSessionId && data.sessionId) {
                setCurrentSessionId(data.sessionId);
                // Refresh list to show new session in sidebar
                loadSessions();
            }

            const botMessage = { role: 'assistant', content: data.reply };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Socratic Tutor Error:", error);
            toast.error("Failed to get a response. Please try again.");
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="font-bold text-lg">Socratic Tutor</h2>
                    </div>
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white p-2.5 rounded-xl hover:bg-primary-dark transition-colors font-medium shadow-sm hover:shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        New Conversation
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-140px)] p-2 space-y-1 custom-scrollbar">
                    {sessions.length === 0 && (
                        <div className="text-center p-4 text-text-muted-light dark:text-text-muted-dark text-sm">
                            No past conversations.
                        </div>
                    )}
                    {sessions.map(session => (
                        <div
                            key={session.sessionId}
                            onClick={() => handleSelectSession(session.sessionId)}
                            className={`group p-3 rounded-lg cursor-pointer text-sm flex items-center justify-between transition-all ${currentSessionId === session.sessionId
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                : 'text-text-light dark:text-text-dark hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark'
                                }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{session.preview}</span>
                            </div>
                            <button
                                onClick={(e) => handleDeleteSession(e, session.sessionId)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-text-muted-light dark:text-text-muted-dark hover:text-red-500 transition-all"
                                title="Delete conversation"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full w-full relative">
                {/* Header */}
                <div className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark p-4 flex items-center shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mr-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg md:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link to="/" className="mr-4 text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary-light transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
                            {currentSessionId ? "Conversation" : "New Conversation"}
                        </h1>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                                    ? 'bg-primary text-white'
                                    : 'bg-indigo-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl shadow-sm border text-sm sm:text-base ${msg.role === 'user'
                                    ? 'bg-primary text-white border-primary rounded-tr-none'
                                    : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark rounded-tl-none'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex w-full justify-start">
                            <div className="flex max-w-[80%] gap-3 flex-row">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                    <Bot size={16} />
                                </div>
                                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center gap-2">
                                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Thinking...</span>
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your answer or question..."
                            className="flex-1 p-3 pr-12 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SocraticTutorPage;
