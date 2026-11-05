// ============================================================================
// 5. SIDEBAR & POPUP MENU MANAGEMENT
// ============================================================================
function dismissAllMenus() {
    document.querySelectorAll('.message-popup-menu').forEach(menu => menu.remove());
    const attachPopupMenu = document.getElementById("attachPopupMenu");
    const attachBtn = document.getElementById("attachBtn");
    if (attachPopupMenu) attachPopupMenu.classList.remove("show");
    if (attachBtn) attachBtn.classList.remove("active");
    
    const filterMenu = document.getElementById("sessionsFilterMenu");
    if (filterMenu) filterMenu.classList.remove("show");
}

function showCustomRenameModal(currentTitle, onSave) {
    const existingModal = document.getElementById("customRenameModal");
    if (existingModal) existingModal.remove();

    const overlay = document.createElement("div");
    overlay.id = "customRenameModal";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(15, 23, 42, 0.6); display: flex; align-items: center;
        justify-content: center; z-index: 9999; backdrop-filter: blur(4px);
    `;

    const dialog = document.createElement("div");
    dialog.style.cssText = `
        background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
        border: 1px solid #475569; border-radius: 14px;
        padding: 20px; width: 85%; max-width: 320px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        color: #0f172a; font-family: inherit;
    `;

    dialog.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 16px; color: #0f172a;">Rename Chat</h3>
        <input type="text" id="renameInputBox" value="${currentTitle}" style="
            width: 100%; padding: 10px 12px; background: rgba(255,255,255,0.5); border: 1px solid #475569;
            border-radius: 8px; color: #0f172a; font-size: 14px; outline: none; box-sizing: border-box; margin-bottom: 16px;
        ">
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="cancelRenameBtn" style="
                padding: 8px 16px; background: transparent; border: 1px solid #475569;
                border-radius: 6px; color: #0f172a; cursor: pointer; font-size: 13px;
            ">Cancel</button>
            <button id="saveRenameBtn" style="
                padding: 8px 16px; background: linear-gradient(135deg, #1e293b, #0f172a); border: none;
                border-radius: 6px; color: #fff; cursor: pointer; font-size: 13px; font-weight: 600;
            ">Save</button>
        </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const inputField = document.getElementById("renameInputBox");
    inputField.focus();
    inputField.select();

    const closeHandler = () => overlay.remove();

    document.getElementById("cancelRenameBtn").onclick = closeHandler;
    overlay.onclick = (e) => { if (e.target === overlay) closeHandler(); };

    const saveHandler = () => {
        const val = inputField.value.trim();
        if (val) {
            onSave(val);
        }
        closeHandler();
    };

    document.getElementById("saveRenameBtn").onclick = saveHandler;
    inputField.onkeydown = (e) => {
        if (e.key === "Enter") saveHandler();
        if (e.key === "Escape") closeHandler();
    };
}

function renderSidebarList() {
    const listContainer = document.getElementById("chatSessionsList");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    
    const validSessions = allSessions.filter(s => s.messages && s.messages.length > 0);
    
    // Filter sessions based on dropdown selection ('All', 'Chat', 'Research', 'Studio')
    let filteredSessions = validSessions.filter(session => {
        const sMode = (session.mode || 'chat').toLowerCase();
        if (currentSessionFilter === 'All') {
            return true; // <--- FIXED: 'All' select hone par ab saare modes ke chats dikhenge!
        } else {
            return sMode === currentSessionFilter.toLowerCase();
        }
    });

    // Search query filtering
    filteredSessions = filteredSessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredSessions.forEach(session => {
        const item = document.createElement("div");
        item.className = `session-item ${(!isPrivateMode && session.id === currentSessionId) ? 'active' : ''}`;
        
        const titleSpan = document.createElement("span");
        titleSpan.className = "session-title-text";
        titleSpan.textContent = session.title;
        titleSpan.onclick = () => {
            switchSession(session.id);
            toggleSidebar(false);
        };
        item.appendChild(titleSpan);

        const optionsBtn = document.createElement("button");
        optionsBtn.className = "session-options-btn";
        optionsBtn.title = "Options";
        optionsBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
            </svg>
        `;

        optionsBtn.onclick = (e) => {
            e.stopPropagation();
            dismissAllMenus();

            const menu = document.createElement("div");
            menu.className = "message-popup-menu";

            const renameBtn = document.createElement("button");
            renameBtn.className = "popup-menu-item";
            renameBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Rename`;
            renameBtn.onclick = (ev) => {
                ev.stopPropagation();
                dismissAllMenus();
                showCustomRenameModal(session.title, (newTitle) => {
                    session.title = newTitle;
                    saveAllSessions();
                    renderSidebarList();
                });
            };
            menu.appendChild(renameBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "popup-menu-item";
            deleteBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete`;
            deleteBtn.onclick = (ev) => {
                ev.stopPropagation();
                dismissAllMenus();
                allSessions = allSessions.filter(s => s.id !== session.id);
                saveAllSessions();
                if (currentSessionId === session.id) {
                    const remaining = allSessions.filter(s => (s.mode || 'chat') === (typeof currentActiveMode !== 'undefined' ? currentActiveMode : 'chat'));
                    if (remaining.length > 0) {
                        switchSession(remaining[0].id);
                    } else {
                        createNewSession(false);
                    }
                } else {
                    renderSidebarList();
                }
            };
            menu.appendChild(deleteBtn);

            item.appendChild(menu);

            const rect = item.getBoundingClientRect();
            if (rect.bottom + 100 > window.innerHeight) {
                menu.style.top = "auto";
                menu.style.bottom = "100%";
                menu.style.marginTop = "0px";
                menu.style.marginBottom = "6px";
            }
        };

        item.appendChild(optionsBtn);
        listContainer.appendChild(item);
    });
}

function toggleSidebar(show) {
    const drawer = document.getElementById("sidebarDrawer");
    const overlay = document.getElementById("sidebarOverlay");
    if (show) {
        renderSidebarList();
        if (drawer) drawer.classList.add("active");
        if (overlay) overlay.classList.add("active");
    } else {
        if (drawer) drawer.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    }
}
