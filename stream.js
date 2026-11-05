// ============================================================================
// 4. CHAT STREAM, RENDER & AUTO-SCROLL HELPERS (FIXED BRACKETS)
// ============================================================================
function scrollToBottomIfNeeded(force = false) {
    const chatStream = document.getElementById("chatStream");
    if (!chatStream) return;
    const isAtBottom = (chatStream.scrollHeight - chatStream.scrollTop - chatStream.clientHeight) <= 150;
    if (force || isAtBottom) {
        chatStream.scrollTop = chatStream.scrollHeight;
    }
} // <--- Yahan bracket miss tha, ab theek kar diya hai

function clearScreenAndRender() {
    const chatStream = document.getElementById("chatStream");
    const auraContainer = document.getElementById("auraContainer");
    if (!chatStream) return;
          
    requestAnimationFrame(() => {
        chatStream.innerHTML = "";
                  
        if (isPrivateMode) {
            const banner = document.createElement("div");
            banner.className = "private-banner";
            banner.innerHTML = "<strong>Private Chat:</strong> History off & messages won't be saved.";
            chatStream.appendChild(banner);
        }
        const session = getCurrentSession();
        if (session && session.messages && session.messages.length > 0) {
            if (auraContainer) auraContainer.classList.add("chat-active");
            for (let i = 0; i < session.messages.length; i++) {
                const msg = session.messages[i];
                if (msg.role === "user") {
                    appendUserBubble(msg.content, false, i);
                } else if (msg.role === "model" || msg.role === "assistant") {
                    appendAiBubble(msg.content, false);
                }
            }
        } else {
            if (auraContainer) auraContainer.classList.remove("chat-active");
        }
        scrollToBottomIfNeeded(true);
        renderSidebarList();
    });
}
