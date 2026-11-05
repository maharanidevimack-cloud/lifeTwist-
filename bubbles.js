function appendUserBubble(text, scroll = true, messageIndex = null) {
    const chatStream = document.getElementById("chatStream");
    if (!chatStream) return;
    const userBubble = document.createElement("div");
    userBubble.className = "user-bubble";
    userBubble.textContent = text;

    let pressTimer = null;

    const showMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dismissAllMenus();

        const menu = document.createElement("div");
        menu.className = "message-popup-menu";

        const copyBtn = document.createElement("button");
        copyBtn.className = "popup-menu-item";
        copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
        copyBtn.onclick = (ev) => {
            ev.stopPropagation();
            navigator.clipboard.writeText(text);
            dismissAllMenus();
        };
        menu.appendChild(copyBtn);

        const editBtn = document.createElement("button");
        editBtn.className = "popup-menu-item";
        editBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Edit`;
        editBtn.onclick = (ev) => {
            ev.stopPropagation();
            dismissAllMenus();
            const session = getCurrentSession();
            if (messageIndex !== null && session && messageIndex < session.messages.length) {
                session.messages.splice(messageIndex);
                saveAllSessions();
                clearScreenAndRender();
            }
            const userInput = document.getElementById("userInput");
            if (userInput) {
                userInput.value = text;
                userInput.focus();
            }
        };
        menu.appendChild(editBtn);

        const retryBtn = document.createElement("button");
        retryBtn.className = "popup-menu-item";
        retryBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> Retry`;
        retryBtn.onclick = async (ev) => {
            ev.stopPropagation();
            dismissAllMenus();
            const session = getCurrentSession();
            if (messageIndex !== null && session && messageIndex < session.messages.length) {
                session.messages.splice(messageIndex);
                saveAllSessions();
                clearScreenAndRender();
            }
            const userInput = document.getElementById("userInput");
            if (userInput) userInput.value = text;
            handleUserMessage();
        };
        menu.appendChild(retryBtn);

        userBubble.appendChild(menu);

        const rect = userBubble.getBoundingClientRect();
        if (rect.bottom + 100 > window.innerHeight) {
            menu.style.top = "auto";
            menu.style.bottom = "100%";
            menu.style.marginTop = "0px";
            menu.style.marginBottom = "6px";
        }
    };

    userBubble.addEventListener("touchstart", (e) => {
        pressTimer = setTimeout(() => showMenu(e), 400);
    });
    userBubble.addEventListener("touchend", () => clearTimeout(pressTimer));
    userBubble.addEventListener("touchmove", () => clearTimeout(pressTimer));
    userBubble.addEventListener("contextmenu", (e) => showMenu(e));

    chatStream.appendChild(userBubble);
    if (scroll) scrollToBottomIfNeeded();
}

function appendAiBubble(replyText, scroll = true) {
    const chatStream = document.getElementById("chatStream");
    if (!chatStream) return;
    const aiWrapper = document.createElement("div");
    aiWrapper.className = "ai-message-wrapper";

    const aiBubble = document.createElement("div");
    aiBubble.className = "ai-bubble";
    aiBubble.innerHTML = formatLiveLinks(replyText);
    aiWrapper.appendChild(aiBubble);

    const actionsRow = document.createElement("div");
    actionsRow.className = "ai-actions-row";

    const speakBtn = document.createElement("button");
    speakBtn.className = "speak-btn";
    speakBtn.title = "Listen";
    speakBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
    `;
    speakBtn.onclick = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(replyText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'));
            utterance.lang = 'hi-IN';
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Aapka browser text-to-speech support nahi karta.");
        }
    };
    actionsRow.appendChild(speakBtn);

    const sponsorIconsRow = document.createElement("div");
    sponsorIconsRow.className = "sponsor-icons-row";
    sponsorIconsRow.innerHTML = `
        <a href="https://fktr.in/tDxsvx6" target="_blank" class="sponsor-circle-btn" title="Flipkart"><span>F</span></a>
        <a href="https://myntr.it/6A0m9y0" target="_blank" class="sponsor-circle-btn" title="Myntra"><span>M</span></a>
    `;
    actionsRow.appendChild(sponsorIconsRow);

    aiWrapper.appendChild(actionsRow);
    chatStream.appendChild(aiWrapper);
    if (scroll) {
        scrollToBottomIfNeeded();
    }
}

async function askLifeTwistEngine(newMessage, aiBubble, aiWrapper, session, attachment = null) {
    if (!isPrivateMode && !allSessions.find(s => s.id === session.id)) {
        session.title = newMessage.length > 25 ? newMessage.substring(0, 25) + "..." : (attachment ? "Image Query" : newMessage);
        session.mode = typeof currentActiveMode !== 'undefined' ? currentActiveMode : 'chat';
        allSessions.unshift(session);
    }

    session.messages.push({ role: "user", content: attachment ? `[📷 Photo Attached] ${newMessage}` : newMessage });
    saveAllSessions();

    try {
        const response = await fetch("https://lifetwist-backend-production-3c34.up.railway.app/api/engine/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer lifetwist_SamGo852220"
            },
            body: JSON.stringify({
                prompt: newMessage,
                history: session.messages,
                attachment: attachment,
                mode: currentMode
            })
        });

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();
        const aiReply = data.reply || data.response || "No response received";

        if (aiReply) {
            aiBubble.innerHTML = formatLiveLinks(aiReply);
            session.messages.push({ role: "model", content: aiReply });
            saveAllSessions();

            const actionsRow = document.createElement("div");
            actionsRow.className = "ai-actions-row";

            const speakBtn = document.createElement("button");
            speakBtn.className = "speak-btn";
            speakBtn.title = "Listen";
            speakBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
            `;
            speakBtn.onclick = () => {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(aiReply.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'));
                    utterance.lang = 'hi-IN';
                    window.speechSynthesis.speak(utterance);
                } else {
                    alert("Aapka browser text-to-speech support nahi karta.");
                }
            };
            actionsRow.appendChild(speakBtn);

            const sponsorIconsRow = document.createElement("div");
            sponsorIconsRow.className = "sponsor-icons-row";
            sponsorIconsRow.innerHTML = `
                <a href="https://fktr.in/tDxsvx6" target="_blank" class="sponsor-circle-btn" title="Flipkart"><span>F</span></a>
                <a href="https://myntr.it/6A0m9y0" target="_blank" class="sponsor-circle-btn" title="Myntra"><span>M</span></a>
            `;
            actionsRow.appendChild(sponsorIconsRow);

            aiWrapper.appendChild(actionsRow);
            scrollToBottomIfNeeded();
        } else {
            session.messages.pop();
            aiBubble.textContent = "Maaf kijiye, engine se sahi uttar nahi mila.";
        }
    } catch (error) {
        console.error("LifeTwist Engine Error:", error);
        session.messages.pop();
        aiBubble.textContent = "Error: " + error.message;
    }
                  }
          
