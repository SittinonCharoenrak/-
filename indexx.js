const { Client, GatewayIntentBits, REST, Routes, ButtonStyle, ModalBuilder, EmbedBuilder, ButtonBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder, SlashCommandBuilder, UserSelectMenuBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

 // ติดตั้งโค้ด npm install discord.js

// ----------------------| ตั้งค่าที่นี่ครับ |------------------------- //

const Command_AD = ['834306212996579358','ไอดีแอดมินคนที่ 2', 'ไอดีแอดมินคนที่3'];      // ไอดีแอดมินที่ใช้งานคำสั่งบอทได้

const Channel_relpy = '1288393751512743966';                                       // ไอดีช่องที่ส่งข้อความไปฝากบอก

// ----------------------------------------------- //

client.once('ready', async () => {
    console.log(`Bot logged in as ${client.user.tag}`);
    const commands = [
        new SlashCommandBuilder()
            .setName('selectuser')
            .setDescription('selectuser your server')
            .toJSON(),
    ];
    const rest = new REST({ version: '10' }).setToken(TOKEN_BOT);
    await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands },
    );
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'selectuser') {
        const allowedUserIDs = Command_AD;
        if (!allowedUserIDs.includes(interaction.user.id)) {
            await interaction.reply({
                content: '<:1015312603540627476:1287300638761291816> **เอ้ะ! คำสั่งสำหรับผู้ที่มีสิทธิ์เท่านั้น**',
                ephemeral: true
            });
            return;
        }
        const embed = new EmbedBuilder()
            .setColor(0xffc6d0)
            .setTitle('<:1029812652945444874:1270273628772241439> <:4753lovenote:1288376897411092510> ⋆ ˚｡⋆୨ แอบกระซิบหน่อยมุ้ย ୧⋆ ˚｡⋆')    // เปลี่ยนข้อความหน้าฝากบอกที่นี่
            .setImage('https://cdn.discordapp.com/attachments/1261972455954845729/1288366480261644298/Cute_Blue_Girl_Gamer_Twitch_Banner_1.png?ex=66f4ec49&is=66f39ac9&hm=5adab9da2941bbeb7540ad9e368c2ee5c25fe3770159a1cb6f2bcdfcc0571a18&')  // เปลี่ยนรูปภาพหน้าฝากบอกที่นี่
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sand_user')
                    .setLabel('⊰❞กระซิบ')
                    .setEmoji({ name: '💌' })
                    .setStyle(ButtonStyle.Primary)
            );
        await interaction.reply({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'sand_user') {
        const row = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId('select_user')
                    .setPlaceholder('เลือกผู้ใช้ หรือ พิมพ์ชื่อ')
                    .setMinValues(1)
                    .setMaxValues(1)
            );
        await interaction.reply({ components: [row], ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isUserSelectMenu() && interaction.customId === 'select_user') {
        const selectedUserId = interaction.values[0];
        if (selectedUserId === interaction.user.id) {
            await interaction.reply({content: '<:1015312603540627476:1287300638761291816> **คุณไม่สามารถกระซิบหาตัวเองได้**',ephemeral: true});
            return;
        }
        const modal = new ModalBuilder()
            .setCustomId(`submit_modals:${selectedUserId}`)
            .setTitle('กระซิบบอก')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('message_text')
                        .setLabel('ข้อความ')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('กรอกข้อความที่ต้องการกระซิบ')
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('message_hint')
                        .setLabel('คำใบ้')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('กรอกคำใบ้ที่ต้องการกระซิบ')
                        .setRequired(false)
                ),
            );
        await interaction.showModal(modal);
    }
});

const messageStore = new Map();
client.on('interactionCreate', async interaction => {
    if (interaction.isModalSubmit() && interaction.customId.startsWith('submit_modals:')) {
        const selectedUserId = interaction.customId.split(':')[1];
        const selectedUser = await interaction.guild.members.fetch(selectedUserId);
        const messageText = interaction.fields.getTextInputValue('message_text');
        const messageHint = interaction.fields.getTextInputValue('message_hint') || 'ไม่มี';
        const uniqueId = interaction.id;
        const originalSenderId = interaction.user.id;
        messageStore.set(uniqueId, { messageText, messageHint, selectedUserId, originalSenderId });
        const embed = new EmbedBuilder()
            .setColor(0xffc6d0)
            .setTitle('⋆ ˚｡⋆୨คุณได้ส่งข้อความกระซิบฝากบอกแล้ว୧⋆ ˚｡⋆')

            .setDescription(`꒰<:4753lovenote:1288376897411092510>꒱.**กระซิบถึง** ${selectedUser}\n꒰<a:1212825197548413059:1260094797079904317>꒱.**ส่งกระซิบไปที่ช่อง** <#${Channel_relpy}>`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        const channels = interaction.guild.channels.cache.get(Channel_relpy);
        if (channels) {
            const embed = new EmbedBuilder()
            .setImage('https://cdn.discordapp.com/attachments/1261972455954845729/1288372137068855348/Cute_Blue_Girl_Gamer_Twitch_Banner.png?ex=66f4f18e&is=66f3a00e&hm=2ae3e785c2fc0b2d00d9ede18f7b1e2c4810c3da4612a5b09f3b404742d84258&')  // เปลี่ยนรูปภาพหน้าฝากบอกที่นี่
                .setColor(0xFFCCFF)
                .setTitle('<:1029812652945444874:1270273628772241439> ⋆｡‧˚ʚ เธอๆมีคนกระซิบมากบอกแหละ>< ɞ˚‧｡⋆')
                .setDescription(`**<:4753lovenote:1288376897411092510>ข้อความ**\n<a:1177679672415359066:1268161985883672676>**\`\`${messageText}\`\`**\n\n**<:4753lovenote:1288376897411092510>คำใบ้**\n<a:1177679672415359066:1268161985883672676>**\`\`${messageHint}\`\`**`);
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`reply_message:${selectedUserId}:${uniqueId}`)
                        .setLabel('⊰❞ตอบกลับ')
                        .setEmoji({ name: '💌' })
                        .setStyle(ButtonStyle.Primary)
                );
            await channels.send({ content: `# มีข้อความส่งมาให้ ${selectedUser}`, embeds: [embed], components: [row] });
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId.startsWith('reply_message:')) {
        const selectedUserId = interaction.customId.split(':')[1];
        const uniqueId = interaction.customId.split(':')[2];
        const messageData = messageStore.get(uniqueId);
        if (!messageData) {
            return await interaction.reply({ content: '<a:15831lovenote:1288388318471393300> แหม่เสียดายข้อความหมดอายุไปแล้วอ่าTT', ephemeral: true });
        }
        const allowedUserIDs = selectedUserId;
        if (!allowedUserIDs.includes(interaction.user.id)) {
            await interaction.reply({
                content: '<:1015312603540627476:1287300638761291816> **คุณไม่ใช่คนที่โดนกระซิบไม่สามารถตอบกลับได้**',
                ephemeral: true
            });
            return;
        }
        const { messageText, messageHint } = messageData;
        const modal = new ModalBuilder()
            .setCustomId(`submit_modals_reply:${selectedUserId}:${uniqueId}`)
            .setTitle('ตอบกลับ')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('message_text_reply')
                        .setLabel('ข้อความ')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('กรอกข้อความที่ต้องการตอบกลับ')
                        .setRequired(true)
                )
            );
        await interaction.showModal(modal);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isModalSubmit() && interaction.customId.startsWith('submit_modals_reply:')) {
        const selectedUserId = interaction.customId.split(':')[1];
        const uniqueId = interaction.customId.split(':')[2];
        const messageData = messageStore.get(uniqueId);
        if (!messageData) {
            return await interaction.reply({ content: '<a:15831lovenote:1288388318471393300> แหม่เสียดายข้อความหมดอายุไปแล้วอ่าTT', ephemeral: true });
        }
        const { messageText, messageHint, originalSenderId } = messageData;
        const selectedUser = await interaction.guild.members.fetch(selectedUserId);
        const messageTextReply = interaction.fields.getTextInputValue('message_text_reply');
        const embed = new EmbedBuilder()
            .setImage('https://cdn.discordapp.com/attachments/1261972455954845729/1288385523886325811/Cute_Blue_Girl_Gamer_Twitch_Banner_2.png?ex=66f4fe05&is=66f3ac85&hm=64ca7a28c8ef3143cd2475a5bda9e0fc8dbf463907faae320be7e3520b44ac7b&')  // เปลี่ยนรูปภาพหน้าฝากบอกที่นี่
            .setColor(0xFF33CC)
            .setTitle('มีคนกระซิบฝากข้อความมาบอก')
            .setDescription(`**<:4753lovenote:1288376897411092510>ข้อความ**\n<a:1177679672415359066:1268161985883672676>\`\`${messageText}\`\`**\n\n**<:4753lovenote:1288376897411092510>คำใบ้**\n<a:1177679672415359066:1268161985883672676>\`\`${messageHint}\`\`**\n\n**<:4753lovenote:1288376897411092510>คำตอบกลับ**\n<a:1177679672415359066:1268161985883672676>**\`\`${messageTextReply}\`\`**`);
            
            await interaction.update({ content: `**# ผู้ตอบกลับ** ${selectedUser}`, embeds: [embed], components: [] });
    }
});

client.login(TOKEN_BOT);