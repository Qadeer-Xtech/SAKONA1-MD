const config = require('../config')
const {cmd , commands} = require('../command')
cmd({
    pattern: "about",
    alias: "dev",
    react: "👑",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let about = `
*╭┈───────────────•*
*𝗁𝗂 𝖽𝖾𝖺𝗋 👋 ${pushname}*
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* *ᴄʀᴇᴀᴛᴇᴅ ʙʏ: ǫᴀᴅᴇᴇʀ ᴋʜᴀɴ*
*│  ◦* *ʀᴇᴀʟ ɴᴀᴍᴇ➠ ǫᴀᴅᴇᴇʀ*
*│  ◦* *ɴɪᴄᴋɴᴀᴍᴇ➠ ǫᴀᴅᴇᴇʀ ᴋʜᴀɴ*
*│  ◦* *ᴀɢᴇ➠ ❌*
*│  ◦* *ᴄɪᴛʏ➠ Lɪʙʀᴇᴠɪʟʟᴇ*
*│  ◦* *ᴀ ᴘᴀꜱꜱɪᴏɴᴀᴛᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ᴅᴇᴠ*
*╰┈───────────────•*

*[ • sᴀᴋᴏɴᴀ1-ᴍᴅ - ᴘʀᴏᴊᴇᴄᴛ • ]*

*╭┈───────────────•*
*│  ◦* *▢➠ǫᴀᴅᴇᴇʀ-ᴋʜᴀɴ*
*│  ◦* *▢➠ᴏɴʟʏ 1 ᴅᴇᴠᴇʟᴏᴘᴇʀ*
*╰┈───────────────•*

*•────────────•⟢*
> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ǫᴀᴅᴇᴇʀ ᴋʜᴀɴ*
*•────────────•⟢*
`
await conn.sendMessage(from, {
    image: { url: 'https://qu.ax/hDLFX.png' },
    caption: about,
    contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363345872435489@newsletter', // ou ton JID actuel
            newsletterName: '𝐒𝐀𝐊𝐎𝐍𝐀𝟏-𝐌𝐃',
            serverMessageId: 143
        }
    }
}, { quoted: mek })

}catch(e){
console.log(e)
reply(`${e}`)
}
})

