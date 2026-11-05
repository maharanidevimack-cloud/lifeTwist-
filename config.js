// ================= CONFIGURATION & GLOBAL STATE =================
let allSessions = [];
let currentSessionId = null;
let isPrivateMode = false;
let searchQuery = "";
let privateSession = {
    id: 'private_session',
    title: 'Private Chat',
    messages: []
};
