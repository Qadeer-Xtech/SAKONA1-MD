const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const { proto } = require('@whiskeysockets/baileys');

// Helper function to convert text to small caps
function toSmallCaps(str) {
  const smallCaps = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.toUpperCase().split('').map(c => smallCaps[c] || c).join('');
}

// Helper function to get bot's uptime
function getUptime() {
  let sec = process.uptime();
  let h = Math.floor(sec / 3600);
  let m = Math.floor((sec % 3600) / 60);
  let s = Math.floor(sec % 60);
  return `${h}h ${m}m ${s}s`;
}

/**
 * Command: menu3
 * Description: Displays the main interactive menu with categories.
 */
cmd({
  pattern: "menu3",
  alias: ["list", "help"],
  use: '.menu3',
  desc: "Show bot command categories",
  category: "main",
  react: "❄️",
  filename: __filename
},
async (dyby, mek, m, { from, reply }) => {
  try {
    // --- 1. Group all commands by category ---
    const category = {};
    for (let command of commands) {
      if (!command.category || command.dontAddCommandList) continue;
      if (!category[command.category]) {
        category[command.category] = [];
      }
      category[command.category].push(command);
    }
    const sortedCategories = Object.keys(category).sort();

    // --- 2. Create interactive rows for the list message ---
    const rows = sortedCategories.map(cat => ({
      title: `${cat.toUpperCase()} MENU`,
      description: `Click to see all commands in ${cat} category.`,
      // This rowId is crucial. It triggers the next command when a user clicks it.
      rowId: `${config.PREFIX}category_${cat}` 
    }));

    const sections = [{
      title: toSmallCaps('Bot Command Categories'),
      rows: rows
    }];

    // --- 3. Construct the main menu message ---
    const headerText = `
*╭══〘 𝐒𝐀𝐊𝐎𝐍𝐀𝟏-𝐌𝐃 〙*
*┃❍* *ᴜsᴇʀ* : @${m.sender.split("@")[0]}
*┃❍* *ʀᴜɴᴛɪᴍᴇ* : ${getUptime()}
*┃❍* *ᴍᴏᴅᴇ* : *${config.MODE}*
*┃❍* *ᴘʀᴇғɪx* : [ ${config.PREFIX} ]
*┃❍* *ᴩʟᴜɢɪɴ* :  ${commands.length}
*┃❍* *ᴅᴇᴠ* : *𝐐𝐚𝐝𝐞𝐞𝐫 𝐊𝐡𝐚𝐧*
*┃❍* *ᴠᴇʀsɪᴏɴs* : *4.0.0*
*╰════════════════⊷*

Hello! I am Sakona, a Multi-Device WhatsApp bot. Choose a category from the list below to see its commands.
`;

    const listMessage = {
      text: headerText,
      footer: `\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ǫᴀᴅᴇᴇʀ ᴋʜᴀɴ`,
      buttonText: 'CLICK HERE TO SEE COMMANDS',
      sections: sections,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
      }
    };
    
    // --- 4. Send the interactive list message ---
    await dyby.sendMessage(from, listMessage, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});


/**
 * Command: category
 * Description: This is a hidden command triggered by the main menu list.
 * It displays the commands for the selected category.
 */
cmd({
  pattern: "category_(.*)", // This regex captures the category name
  dontAddCommandList: true, // Hides this command from the main menu
  filename: __filename
},
async (dyby, mek, m, { from, reply, match }) => {
  try {
    const selectedCategory = match[1]; // e.g., "download", "search"

    // --- 1. Group commands again to find the right ones ---
    const category = {};
    for (let command of commands) {
      if (!command.category) continue;
      if (!category[command.category]) {
        category[command.category] = [];
      }
      category[command.category].push(command);
    }

    // --- 2. Check if the selected category is valid ---
    if (!category[selectedCategory]) {
      return reply(`Invalid category: ${selectedCategory}`);
    }

    // --- 3. Build the text for the selected category's commands ---
    let categoryMenuText = `┌── 『 *${selectedCategory.toUpperCase()} MENU* 』\n`;
    const cmds = category[selectedCategory]
      .filter(c => c.pattern)
      .sort((a, b) => a.pattern.localeCompare(b.pattern));

    cmds.forEach((cmd) => {
      const usage = cmd.pattern.split('|')[0];
      categoryMenuText += `\n├❃ ${config.PREFIX}${toSmallCaps(usage)}`;
    });
    
    categoryMenuText += `\n┗━━━━━━━━━━━━━━❃\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ǫᴀᴅᴇᴇʀ ᴋʜᴀɴ`;

    // --- 4. Send the list of commands with an image ---
    await dyby.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL },
      caption: categoryMenuText,
      contextInfo: {
        mentionedJid: [m.sender],
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error fetching category commands: ${e.message}`);
  }
});
