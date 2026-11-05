// ============================================================================
// 3. HANDLERS & USER MESSAGE PROCESSING (MODE-WISE LOGIC FIXED & SILENT)
// ============================================================================
function handleAttachOption(optionType) {
    dismissAllMenus();

    if (optionType === 'Camera') {
        const camInput = document.getElementById('cameraInput');
        if (camInput) camInput.click();
    } else if (optionType === 'Photos') {
        const galInput = document.getElementById('galleryInput');
        if (galInput) galInput.click();
    } else if (optionType === 'Files') {
        const fInput = document.getElementById('fileInput');
        if (fInput) fInput.click();
    } else if (optionType === 'StudyMode') {
        currentMode = "study";
        const userInput = document.getElementById("userInput");
        if (userInput) {
            userInput.value = "📚 [Study Mode]: ";
            userInput.focus();
        }
    } else if (optionType === 'Thinking') {
        currentMode = "thinking";
        const userInput = document.getElementById("userInput");
        if (userInput) {
            userInput.value = "🧠 [Think Harder]: ";
            userInput.focus();
        }
    }
}

async function handleUserMessage() {
    const userInput = document.getElementById("userInput");
    const auraContainer = document.getElementById("auraContainer");
    const chatStream = document.getElementById("chatStream");
    const mmsPreviewBanner = document.getElementById("mmsPreviewBanner");

    if (!userInput) return;
    const text = userInput.value.trim();
    if (!text && !currentAttachment) return;

    if (auraContainer) auraContainer.classList.add("chat-active");
    const session = getCurrentSession();
    
    const displayText = currentAttachment ? `[📷 Photo Attached] ${text}` : text;
    appendUserBubble(displayText, true, session.messages.length);
    
    userInput.value = "";
    userInput.style.height = 'auto';
    
    if (mmsPreviewBanner) mmsPreviewBanner.style.display = "none";
    const sendAttachment = currentAttachment;
    currentAttachment = null;

    const aiWrapper = document.createElement("div");
    aiWrapper.className = "ai-message-wrapper";
    const aiBubble = document.createElement("div");
    aiBubble.className = "ai-bubble";
    
    // Screen par user ko sirf normal clean loading message hi dikhega (No background technical text)
    aiBubble.textContent = sendAttachment ? "LifeTwist photo analyze kar raha hai..." : "LifeTwist soch raha hai...";
    
    aiWrapper.appendChild(aiBubble);
    
    if (chatStream) {
        chatStream.appendChild(aiWrapper);
        scrollToBottomIfNeeded(true);
    }

    // MODE-WISE SILENT EXECUTION LOGIC (Andar hi andar mode pass hoga backend ko)
    let finalQueryText = text || "Describe this image";
    const activeMode = (typeof currentActiveMode !== 'undefined' ? currentActiveMode : 'chat').toLowerCase();

    // Engine call karte waqt activeMode sath mein bhej rahe hain taaki backend chup chaap handle kare
    await askLifeTwistEngine(finalQueryText, aiBubble, aiWrapper, session, sendAttachment, activeMode);
}
// Jab bhi user kisi live link par click kare, toh app ke andar hi WebView khul jaye
document.addEventListener("click", function(e) {
    const targetLink = e.target.closest("a");
    if (targetLink) {
        const href = targetLink.getAttribute("href");
        // Agar link external website ka hai aur download ya anchor nahi hai
        if (href && href.startsWith("http") && !targetLink.classList.contains("sponsor-circle-btn")) {
            e.preventDefault();
            if (typeof openInAppBrowser === 'function') {
                openInAppBrowser(href);
            } else {
                window.open(href, '_blank');
            }
        }
    }
});
