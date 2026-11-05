// ============================================================================
// MODES MANAGEMENT (FIXED SYNTAX & AUTO-CLEAR SCREEN)
// ============================================================================
function switchAppMode(mode) {
    currentMode = mode.toLowerCase();
    currentHistoryTab = mode.toLowerCase();
          
    // 1. Storage mode update karo
    if (typeof setStorageMode === 'function') {
        setStorageMode(mode);
    } else {
        currentActiveMode = mode.toLowerCase();
    }
    
    // 2. Jaise hi mode badlega, naya fresh session shuru ho jayega aur screen clear ho jayegi
    if (typeof startFreshUnsavedSession === 'function') {
        startFreshUnsavedSession();
    }
          
    // 3. Header tabs ke active classes ko update karo
    const chatBtn = document.getElementById("tabChatBtn");
    const researchBtn = document.getElementById("tabResearchBtn");
    const studioBtn = document.getElementById("tabStudioBtn");
          
    if (chatBtn) chatBtn.classList.remove("active");
    if (researchBtn) researchBtn.classList.remove("active");
    if (studioBtn) studioBtn.classList.remove("active");
          
    if (mode === 'chat' && chatBtn) chatBtn.classList.add("active");
    if (mode === 'research' && researchBtn) researchBtn.classList.add("active");
    if (mode === 'studio' && studioBtn) studioBtn.classList.add("active");
          
    // 4. Input box ka placeholder mode ke hisaab se badal do
    const userInput = document.getElementById("userInput");
    if (userInput) {
        if (mode === 'research') {
            userInput.placeholder = "Wikipedia & Deep Research se poochho...";
        } else if (mode === 'studio') {
            userInput.placeholder = "Studio Mode: Smart Study & Tutor se poochho...";
        } else {
            userInput.placeholder = "Ask LifeTwist anything...";
        }
    }
          
    // 5. Sidebar list ko refresh karo
    if (typeof renderSidebarList === 'function') {
        renderSidebarList();
    }
}

function switchHeaderMode(mode) { 
    switchAppMode(mode); 
}

function switchHistoryTab(tab) { 
    switchAppMode(tab); 
}
