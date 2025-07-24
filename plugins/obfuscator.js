// plugins/obfuscator.js

const { cmd } = require('../command');
// Apni lib file se main function ko import karein
const { obfuscateCode } = require('../lib/java-obs.js');

/**
 * Helper function to handle commands
 */
async function handleCommand(level, { m, q, reply, react }) {
    const codeToObfuscate = m.quoted?.text || q;

    if (!codeToObfuscate) {
        await react("⚠️");
        return reply(`Please provide JavaScript code to obfuscate, or reply to a message containing code.\n\nExample: .obf${level} console.log('Hello');`);
    }

    await react("⚙️"); // Processing
    
    const result = obfuscateCode(codeToObfuscate, level);

    if (result.success) {
        await reply(result.result);
        await react("✅");
    } else {
        await reply(result.error);
        await react("❌");
    }
}

// --- COMMAND DEFINITIONS ---

cmd({
    pattern: "obfbasic",
    desc: "Obfuscates JS code with BASIC level security.",
    category: "tools",
    react: "🔒",
    filename: __filename
}, async (conn, mek, m, { q, reply, react }) => {
    await handleCommand('basic', { m, q, reply, react });
});

cmd({
    pattern: "obfmedium",
    desc: "Obfuscates JS code with MEDIUM level security.",
    category: "tools",
    react: "🔒",
    filename: __filename
}, async (conn, mek, m, { q, reply, react }) => {
    await handleCommand('medium', { m, q, reply, react });
});

cmd({
    pattern: "obfadv",
    alias: ["obfadvanced"],
    desc: "Obfuscates JS code with ADVANCED level security.",
    category: "tools",
react: "🔒",
    filename: __filename
}, async (conn, mek, m, { q, reply, react }) => {
    await handleCommand('advanced', { m, q, reply, react });
});

cmd({
    pattern: "obfhard",
    alias: ["obfhardadv"],
    desc: "Obfuscates JS code with HARD-ADVANCED level security.",
    category: "tools",
    react: "🔒",
    filename: __filename
}, async (conn, mek, m, { q, reply, react }) => {
    await handleCommand('hard', { m, q, reply, react });
});
