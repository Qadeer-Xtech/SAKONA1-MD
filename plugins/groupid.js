const { cmd } = require('../command');

cmd({
    pattern: "gidlink",
    alias: ["groupidlink", "glinkid"],
    desc: "Get group ID from a WhatsApp group invite link",
    category: "utility",
    react: "🔗",
    filename: __filename,
}, async (conn, mek, m, { args, reply, react }) => {
    try {
        const link = args[0];

        if (!link?.includes('chat.whatsapp.com/')) {
            await react("⚠️");
            return reply("❌ Invalid or missing group link.\n\n✅ *Usage:*\n.gidlink https://chat.whatsapp.com/xxxxxx");
        }

        const code = link.split('https://chat.whatsapp.com/')[1];
        const info = await conn.groupGetInviteInfo(code);

        if (!info?.id) {
            await react("❌");
            return reply("❌ Couldn’t fetch group info. Link may be invalid or expired.");
        }

        await react("✅");
        await reply("✅ *Group ID found!*\n📎 *Copyable ID below:*");
        return reply(info.id);

    } catch (err) {
        console.error("❌ gidlink error:", err);
        await react("❌");
        reply("⚠️ An error occurred while fetching group ID.");
    }
});