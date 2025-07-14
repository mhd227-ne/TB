// === 📦 INSTALLATION DES MODULES REQUIS === // npm install telegraf dotenv ytdl-core node-fetch openai axios

require('dotenv').config(); const { Telegraf } = require('telegraf'); const ytdl = require('ytdl-core'); const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); const fs = require('fs'); const path = require('path'); const axios = require('axios'); const { Configuration, OpenAIApi } = require('openai');

const bot = new Telegraf(process.env.BOT_TOKEN); const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

// === /start === bot.start(async (ctx) => { await ctx.replyWithPhoto( { url: 'https://files.catbox.moe/96cfkn.jpg' }, { caption: ╭───『 🤖 *𝗧𝗘𝗦𝗧 𝗕𝗢𝗧* 』───╮ │ │ 👋 *Salut ${ctx.from.first_name || 'utilisateur'} !* │ │ Je suis un bot *multi-outils* stylé, │ créé par 𝙺𝙰𝚆𝙰𝙺𝙸²²7 🧠 │ │ 🔹 Tape */menu* pour voir mes commandes │ 🔹 Tape */kawaki* pour discuter avec l’IA │ 🔹 Tape */youtube* ou */tiktok* pour télécharger │ ╰─────「 📌 Powered by Kawaki 」────╯, parse_mode: 'Markdown', } ); });

// === /menu === bot.command('menu', async (ctx) => { await ctx.replyWithPhoto( { url: 'https://files.catbox.moe/xcqfiz.jpg' }, { caption: ` ╭───『 📜 𝗠𝗘𝗡𝗨 𝗗𝗨 𝗕𝗢𝗧 』───╮ │ 🤖 BOT: 𝗞𝗔𝗪𝗔𝗞𝗜 𝗕𝗢𝗧 │ 👑 Créateur: 𝙺𝙰𝚆𝙰𝙺𝙸²²7 │ 🆔 Numéro: +22781289418 │ 🖠 GitHub: github.com/kawaki2000 │ 💬 Telegram: @kawaki227 │ 🔗 Chaîne: Clique ici ╰────────────────────────╯

🌟 COMMANDES DISPONIBLES : ━━━━━━━━━━━━━━━━━━━━━━━ 📅 Téléchargement : • /youtube [lien] • /song [lien] • /tiktok [lien] • /instagram [lien] • /pinterest [lien] • /imd [url image]

🧠 Intelligence Artificielle : • /kawaki [ta question] • /talk [parle avec moi]

🔍 Info : • /meinfo – Infos perso • /channelinfo [@user] • /url [un lien]

🛀 Logos (ephoto360) : • /dragonball, /neon1, /gold1, etc.

🨊 Extra : • /logo [nom] ━━━━━━━━━━━━━━━━━━━━━━━ `, parse_mode: 'Markdown', } ); });

// === IA Kawaki === bot.command('kawaki', async (ctx) => { const prompt = ctx.message.text.split(' ').slice(1).join(' '); if (!prompt) return ctx.reply('💬 Pose une question après /kawaki');

const res = await openai.createChatCompletion({ model: 'gpt-4', messages: [{ role: 'user', content: prompt }], }); ctx.reply(res.data.choices[0].message.content); });

// === Downloader YouTube vidéo === bot.command('youtube', async (ctx) => { const input = ctx.message.text.split(' ').slice(1).join(' '); if (!input || !ytdl.validateURL(input)) return ctx.reply('❌ Lien YouTube invalide.');

const info = await ytdl.getInfo(input); const title = info.videoDetails.title.replace(/[^�-]/g, '').substring(0, 30); const filePath = path.join(__dirname, ${title}.mp4);

const stream = ytdl(input, { quality: 'lowest' }); stream.pipe(fs.createWriteStream(filePath)).on('finish', async () => { await ctx.replyWithVideo({ source: filePath }, { caption: ✅ ${title} }); fs.unlinkSync(filePath); }); });

// === Télécharger audio === bot.command('song', async (ctx) => { const input = ctx.message.text.split(' ').slice(1).join(' '); if (!input || !ytdl.validateURL(input)) return ctx.reply('❌ Lien YouTube invalide.');

const title = 'song_' + Date.now(); const filePath = path.join(__dirname, ${title}.mp3);

const stream = ytdl(input, { filter: 'audioonly' }); stream.pipe(fs.createWriteStream(filePath)).on('finish', async () => { await ctx.replyWithAudio({ source: filePath }, { caption: '🎵 Audio extrait avec succès.' }); fs.unlinkSync(filePath); }); });

// === TikTok === bot.command('tiktok', async (ctx) => { const input = ctx.message.text.split(' ').slice(1).join(' '); if (!input.includes('tiktok')) return ctx.reply('❌ Lien TikTok invalide.');

try { const res = await fetch(https://tikwm.com/api/?url=${encodeURIComponent(input)}); const json = await res.json(); if (!json.data) return ctx.reply('❌ Téléchargement échoué.');

await ctx.replyWithVideo({ url: json.data.play }, { caption: `✅ TikTok téléchargé.` });

} catch (e) { ctx.reply('❌ Erreur lors du téléchargement.'); } });

// === Instagram === bot.command('instagram', async (ctx) => { const url = ctx.message.text.split(' ')[1]; if (!url || !url.includes('instagram')) return ctx.reply('❌ Lien Instagram invalide.');

try { const res = await axios.get('https://snapinsta.app/api/convert', { params: { url }, headers: { 'User-Agent': 'Mozilla/5.0' }, }); const videoUrl = res.data.url; await ctx.replyWithVideo({ url: videoUrl }, { caption: '📸 Vidéo Instagram téléchargée.' }); } catch (err) { ctx.reply('❌ Impossible de télécharger depuis Instagram.'); } });

// === Pinterest === bot.command('pinterest', async (ctx) => { const url = ctx.message.text.split(' ')[1]; if (!url || !url.includes('pinterest')) return ctx.reply('❌ Lien Pinterest invalide.'); await ctx.reply(📌 Voici ton lien prêt : ${url}); });

// === Image Direct === bot.command('imd', async (ctx) => { const imageUrl = ctx.message.text.split(' ')[1]; if (!imageUrl) return ctx.reply('❌ Fournis un lien direct vers l’image.');

await ctx.replyWithPhoto({ url: imageUrl }, { caption: '🖼️ Image téléchargée avec succès !' }); });

// === URL Analyzer === bot.command('url', async (ctx) => { const url = ctx.message.text.split(' ')[1]; if (!url || !url.startsWith('http')) return ctx.reply('❌ Lien invalide.');

ctx.reply(🔍 Analyse du lien : ${url}\n• Domaine : ${new URL(url).hostname}); });

// === Me Info === bot.command('meinfo', (ctx) => { const user = ctx.from; ctx.reply(👤 *Nom:* ${user.first_name} ${user.last_name || ''}\n🔰 *Username:* @${user.username || 'N/A'}\n🆔 *ID:* ${user.id}, { parse_mode: 'Markdown', }); });

// === Channel Info === bot.command('channelinfo', async (ctx) => { const input = ctx.message.text.split(' ').slice(1).join(' '); if (!input) return ctx.reply('⚠️ Donne un @nom_de_chaine ou lien.');

try { const chat = await ctx.telegram.getChat(input); ctx.reply(📢 *Titre:* ${chat.title}\n🆔 *ID:* ${chat.id}\n🔗 *Username:* ${chat.username ? '@' + chat.username : 'N/A'}, { parse_mode: 'Markdown', }); } catch (error) { ctx.reply('❌ Impossible d’obtenir les infos.'); } });

// === Talk / IA Clever === bot.command('talk', async (ctx) => { const prompt = ctx.message.text.split(' ').slice(1).join(' '); if (!prompt) return ctx.reply('❓ Tu veux qu’on parle de quoi ?');

const res = await openai.createChatCompletion({ model: 'gpt-4', messages: [{ role: 'user', content: prompt }], });

ctx.reply(💬 ${res.data.choices[0].message.content}); });

// === Logo simple (pilulier simulé) === bot.command('logo', async (ctx) => { const name = ctx.message.text.split(' ').slice(1).join(' '); if (!name) return ctx.reply('❌ Donne un nom pour le logo.');

await ctx.replyWithPhoto( { url: https://dummyimage.com/400x200/000/fff&text=${encodeURIComponent(name)} }, { caption: '🧊 Logo généré.' } ); });

// === Démarrer le bot === bot.launch(); console.log('🤖 Kawaki Bot lancé avec succès');

