document.addEventListener("DOMContentLoaded", () => {
    if (typeof currentActiveMode !== 'undefined') {
        currentActiveMode = 'chat';
    }
    loadAllSessions();
    clearScreenAndRender();

    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatStream = document.getElementById("chatStream");
    const menuBtn = document.getElementById("menuBtn");
    const privateBtn = document.getElementById("privateBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    
    const sidebarNewChatIconBtn = document.getElementById("sidebarNewChatIconBtn");
    const sidebarSettingsBtn = document.getElementById("sidebarSettingsBtn");
    const searchChatsInput = document.getElementById("searchChatsInput");
    const attachBtn = document.getElementById("attachBtn");
    const attachPopupMenu = document.getElementById("attachPopupMenu");

    const chatInputArea = document.querySelector(".glass-search-box");
    const mmsPreviewBanner = document.createElement("div");
    mmsPreviewBanner.id = "mmsPreviewBanner";
    mmsPreviewBanner.style.cssText = `
        display: none; align-items: center; justify-content: space-between;
        background: rgba(148, 163, 184, 0.3); border: 1px solid #475569;
        padding: 6px 12px; border-radius: 8px; margin-bottom: 8px; color: #0f172a;
        font-size: 13px; font-weight: 500;
    `;
    mmsPreviewBanner.innerHTML = `
        <span id="mmsFileName">📸 Photo Selected</span>
        <button id="removeMmsBtn" style="background:transparent; border:none; color:#dc2626; cursor:pointer; font-weight:bold; font-size:16px;" title="Remove Photo">✕</button>
    `;
    if (chatInputArea && chatInputArea.parentElement) {
        chatInputArea.parentElement.insertBefore(mmsPreviewBanner, chatInputArea);
    }

    const removeMmsBtn = document.getElementById("removeMmsBtn");
    if (removeMmsBtn) {
        removeMmsBtn.onclick = () => {
            currentAttachment = null;
            mmsPreviewBanner.style.display = "none";
        };
    }

    function handleImageSelection(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            currentAttachment = {
                type: "image",
                base64: e.target.result
            };
            const fileNameSpan = document.getElementById("mmsFileName");
            if (fileNameSpan) fileNameSpan.textContent = `📸 Image Attached: ${file.name}`;
            mmsPreviewBanner.style.display = "flex";
        };
        reader.readAsDataURL(file);
    }

    document.addEventListener("click", (e) => {
        if (attachPopupMenu && !attachPopupMenu.contains(e.target) && e.target !== attachBtn && !attachBtn.contains(e.target)) {
            attachPopupMenu.classList.remove("show");
            attachBtn.classList.remove("active");
        }
        if (!e.target.closest('.session-options-btn') && !e.target.closest('.user-bubble') && !e.target.closest('.sessions-filter-dropdown-wrapper')) {
            dismissAllMenus();
        }
    });

    if (attachBtn && attachPopupMenu) {
        attachBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            attachPopupMenu.classList.toggle("show");
            attachBtn.classList.toggle("active");
        });
    }

    if (menuBtn) menuBtn.onclick = () => toggleSidebar(3); // or toggleSidebar(true)
    if (privateBtn) privateBtn.onclick = () => togglePrivateMode();
    if (sidebarOverlay) sidebarOverlay.onclick = () => toggleSidebar(false);
    
    if (sidebarNewChatIconBtn) {
        sidebarNewChatIconBtn.onclick = () => createNewSession(true);
    }

    if (sidebarSettingsBtn) {
        sidebarSettingsBtn.onclick = () => {
            alert("Settings option clicked!");
        };
    }

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;
        if (swipeDistance > 70 && touchStartX < 40) {
            toggleSidebar(true);
        } else if (swipeDistance < -70) {
            toggleSidebar(false);
        }
    }, false);

    if (searchChatsInput) {
        searchChatsInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderSidebarList();
        });
    }

    if (chatStream) {
        chatStream.addEventListener("scroll", () => dismissAllMenus());
    }

    const cameraInput = document.getElementById('cameraInput');
    const galleryInput = document.getElementById('galleryInput');
    const fileInput = document.getElementById('fileInput');

    if (cameraInput) {
        cameraInput.addEventListener('change', (e) => {
            if (e.target.files[0]) handleImageSelection(e.target.files[0]);
        });
    }

    if (galleryInput) {
        galleryInput.addEventListener('change', (e) => {
            if (e.target.files[0]) handleImageSelection(e.target.files[0]);
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) alert(`Document select ho gaya: ${file.name}`);
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener("click", handleUserMessage);
    }

    if (userInput) {
        userInput.addEventListener("input", function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        userInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleUserMessage();
            }
        });
    }
});
  
