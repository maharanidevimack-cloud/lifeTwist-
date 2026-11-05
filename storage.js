// ============================================================================
// STORAGE & SESSION MANAGEMENT (BULLET-PROOF FIXED)
// ============================================================================
let currentActiveMode = 'chat'; // Track current mode (chat, research, studio)

function loadAllSessions() {
    const saved = localStorage.getItem("LifeTwist_all_sessions");
    if (saved) {
        try {
            allSessions = JSON.parse(saved);
        } catch(e) {
            allSessions = [];
        }
    }
    
    allSessions = allSessions.filter(s => s.messages && s.messages.length > 0);
    
    // Refresh ya app open hone par hamesha naya fresh chat start hoga
    startFreshUnsavedSession();
}

function startFreshUnsavedSession() {
    currentSessionId = 'temp_' + Date.now();
    clearScreenAndRender();
}

function saveAllSessions() {
    if (isPrivateMode) return;

    let currentSession = allSessions.find(s => s.id === currentSessionId);
    if (currentSession) {
        currentSession.mode = currentActiveMode;
    }

    const validSessions = allSessions.filter(s => s.messages && s.messages.length > 0);
    localStorage.setItem("LifeTwist_all_sessions", JSON.stringify(validSessions));
    renderSidebarList();
}

function createNewSession(openDrawer = true) {
    if (isPrivateMode) {
        togglePrivateMode(false);
    }
    allSessions = allSessions.filter(s => s.messages && s.messages.length > 0);
    startFreshUnsavedSession();
    if (openDrawer) {
        toggleSidebar(false);
    }
}

function switchSession(sessionId) {
    if (isPrivateMode) {
        togglePrivateMode(false);
    }
    
    // FIX: Agar current session mein messages hain, toh use pehle save ensure karo
    let currentSession = allSessions.find(s => s.id === currentSessionId);
    if (currentSession && currentSession.messages && currentSession.messages.length > 0) {
        // Pehle se saved hai
    }

    currentSessionId = sessionId;

    // Session ka mode detect karke active mode aur tab switch karo
    const session = allSessions.find(s => s.id === sessionId);
    if (session) {
        if (session.mode) {
            currentActiveMode = session.mode.toLowerCase();
        }
        if (typeof switchAppMode === 'function' && session.mode) {
            // Sirf internal mode variable update karo bina dubara fresh session banaye
            currentMode = session.mode.toLowerCase();
            currentHistoryTab = session.mode.toLowerCase();
            if (typeof setStorageMode === 'function') {
                setStorageMode(session.mode);
            }
        }
    }

    clearScreenAndRender();
    toggleSidebar(false);
}

function getCurrentSession() {
    if (isPrivateMode) {
        return privateSession;
    }
    let session = allSessions.find(s => s.id === currentSessionId);
    if (!session) {
        session = {
            id: currentSessionId,
            title: "New Chat",
            mode: currentActiveMode,
            messages: []
        };
        // FIX: Jaise hi session maanga jaye aur na mile, use turant allSessions mein push kar do taaki click par mil sake
        allSessions.push(session);
    }
    return session;
}

function togglePrivateMode(forceState = null) {
    const privateBtn = document.getElementById("privateBtn");
    
    if (forceState !== null) {
        isPrivateMode = forceState;
    } else {
        isPrivateMode = !isPrivateMode;
    }

    if (isPrivateMode) {
        privateSession.messages = [];
        if (privateBtn) privateBtn.classList.add("active");
    } else {
        privateSession.messages = [];
        if (privateBtn) privateBtn.classList.remove("active");
    }

    clearScreenAndRender();
}

function setStorageMode(mode) {
    currentActiveMode = mode.toLowerCase();
    renderSidebarList();
}
