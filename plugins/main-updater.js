const { cmd } = require('../command');
const { exec } = require('child_process');

cmd({
    pattern: 'update',
    alias: ['sync', 'upgrade'],
    react: '🆕',
    desc: 'Update the bot to the latest version using git.',
    category: 'misc',
    filename: __filename,
}, async (conn, mek, m, { reply, isOwner }) => {

    if (!isOwner) {
        return reply('This command is only for the bot owner.');
    }

    try {
        await reply('🔍 Checking for SAKONA1-MD updates...');

        // Step 1: Fetch the latest updates from the remote repository
        exec('git fetch', async (err, stdout, stderr) => {
            if (err) {
                console.error('Git fetch error:', err);
                // This might happen if git is not installed or it's not a git repo
                return reply('❌ Update failed. Make sure git is installed and you cloned the repo using "git clone".');
            }

            // Step 2: Check the status to see if we are behind the remote
            exec('git status -uno', async (err, stdout, stderr) => {
                if (err) {
                    console.error('Git status error:', err);
                    return reply('❌ Could not check update status.');
                }

                if (stdout.includes("Your branch is up to date")) {
                    return reply('✅ Your SAKONA1-MD bot is already up-to-date!');
                }

                await reply('🔄 New update found! Updating your bot...');

                // Step 3: Hard reset to the latest version from the main branch
                // This will overwrite all local files with the latest ones from the repo
                exec('git reset --hard origin/main', async (err, stdout, stderr) => {
                    if (err) {
                        console.error('Git reset error:', err);
                        return reply('❌ Failed to apply the update.');
                    }

                    await reply('📦 Installing new dependencies if any...');

                    // Step 4: Install any new dependencies from the updated package.json
                    exec('npm install', async (err, stdout, stderr) => {
                        if (err) {
                            console.error('NPM install error:', err);
                            return reply('❌ Failed to install dependencies, but files are updated. Please run "npm install" manually.');
                        }

                        await reply('✅ Update complete! Restarting the bot to apply changes...');

                        // Step 5: Exit the process for PM2 or other process manager to restart
                        process.exit(0);
                    });
                });
            });
        });

    } catch (error) {
        console.error('Update error:', error);
        return reply('❌ An unexpected error occurred during the update.');
    }
});
