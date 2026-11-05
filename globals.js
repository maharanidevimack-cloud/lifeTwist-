let currentAttachment = null;
let currentMode = "chat";
let currentHistoryTab = 'chat';
let currentSessionFilter = 'All';

function formatLiveLinks(text) {
    if (!text) return "";
    let clean = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    clean = clean.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, function(match, btnText, url) {
        return `<br><a href="${url}" target="_blank" class="live-data-link">${btnText} ↗</a><br>`;
    });
    return clean;
}
