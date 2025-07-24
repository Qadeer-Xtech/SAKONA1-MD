// Core Dependencies
const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Custom Module Imports from the bot's framework
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

// Define the command for the bot
cmd({
    pattern: 'version',
    alias: ['changelog', 'cupdate', 'checkupdate'],
    react: '🚀',
    desc: 'Check bot\'s version, system stats, and update info.',
    category: 'info',
    filename: __filename
}, async (bot, message, args, { from, sender, pushname, reply }) => {

    try {
        // --- Step 1: Get Local Version Information ---
        const localVersionFilePath = path.join(__dirname, '../data/version.json');
        let localVersion = 'Unknown';
        let localChangelog = 'No changelog available.';

        if (fs.existsSync(localVersionFilePath)) {
            const localVersionData = JSON.parse(fs.readFileSync(localVersionFilePath));
            localVersion = localVersionData.version;
            localChangelog = localVersionData.changelog;
        }

        // --- Step 2: Get Latest Version Information from GitHub ---
        const remoteVersionUrl = 'https://raw.githubusercontent.com/Qadeer-Xtech/SAKONA1-MD/main/data/version.json';
        let latestVersion = 'Unknown';
        let latestChangelog = 'No changelog available.';

        try {
            const { data: remoteVersionData } = await axios.get(remoteVersionUrl);
            latestVersion = remoteVersionData.version;
            latestChangelog = remoteVersionData.changelog;
        } catch (error) {
            console.error('Failed to fetch latest version:', error);
        }

        // --- Step 3: Gather System and Bot Statistics ---
        const pluginsPath = path.join(__dirname, '../plugins');
        const totalPlugins = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js')).length;
        const totalCommands = commands.length;
        const uptime = runtime(process.uptime());
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // in MB
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2); // in MB
        const hostname = os.hostname();
        const lastUpdateTime = fs.statSync(localVersionFilePath).mtime.toLocaleString();

        // --- Step 4: Compare Versions and Prepare Update Message ---
        const repoUrl = 'https://github.com/Qadeer-Xtech/SAKONA1-MD';
        let updateStatusMessage = '✅ Your SAKONA1-MD bot is up-to-date!';
        
        if (localVersion !== latestVersion) {
            updateStatusMessage = `🚀 Your SAKONA1-MD bot is outdated!\n\n` +
                                `🔹 *Current Version:* ${localVersion}\n` +
                                `🔹 *Latest Version:* ${latestVersion}\n\n` +
                                `Use *.update* to update.`;
        }

        // --- Step 5: Construct the Final Message ---
        const greeting = new Date().getHours() < 12 ? 'Morning' : 'Night';

        const finalMessage = `🌟 *Good ${greeting}, ${pushname}!* 🌟\n\n` +
            `📌 *Bot Name:* SAKONA1-MD\n` +
            `🔖 *Current Version:* ${localVersion}\n` +
            `📢 *Latest Version:* ${latestVersion}\n` +
            `📂 *Total Plugins:* ${totalPlugins}\n` +
            `🔢 *Total Commands:* ${totalCommands}\n\n` +
            `💾 *System Info:*\n` +
            `⏳ *Uptime:* ${uptime}\n` +
            `📟 *RAM Usage:* ${ramUsed} MB / ${totalRam} MB\n` +
            `⚙️ *Host Name:* ${hostname}\n` +
            `📅 *Last Update:* ${lastUpdateTime}\n\n` +
            `📝 *Changelog:*\n${latestChangelog}\n\n` +
            `⭐ *GitHub Repo:* ${repoUrl}\n` +
            `👤 *Owner:* [Qadeer Khan](https://github.com/Qadeer-Xtech)\n\n` +
            `${updateStatusMessage}\n\n` +
            `🚀 *Hey! Don't forget to fork & star the repo!*`;

        // --- Step 6: Send the Reply with an Image and Formatted Caption ---
        await bot.sendMessage(from, {
            image: { url: 'https://qu.ax/hDLFX.png' },
            caption: finalMessage,
            contextInfo: {
                mentionedJid: [args.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363345872435489@newsletter',
                    newsletterName: '𝐒𝐀𝐊𝐎𝐍𝐀𝟏-𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error("Error fetching version info:", error);
        reply("❌ An error occurred while checking the bot version.");
    }
});
