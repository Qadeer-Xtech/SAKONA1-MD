const { cmd } = require('../command'); // Aapka command handler

cmd({
    pattern: "test",
    fromMe: false, // Taakay har koi use kar sake
    desc: "A simple test command to check group functionality",
    category: "general"
},
async (m, { reply }) => {
    // Yeh command console mein bhi message dega aur group mein bhi
    console.log(">>> TEST COMMAND IS RUNNING! <<<");
    await reply("✅ Test command is working perfectly in this group!");
});
