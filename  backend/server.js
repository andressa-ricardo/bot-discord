import express, { json } from 'express';
import { Client } from 'discord.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());

require('dotenv').config();

const client = new Client();
const token =  process.env.TOKEN; 
const channelId = process.env.CHANNEL_ID; 

app.post('/enviar-mensagem', (req, res) => {
  const mensagem = req.body.mensagem;

  if (!mensagem) {
    return res.status(400).json({ error: 'Mensagem não fornecida' });
  }

  const canal = client.channels.cache.get(channelId);
  if (!canal) {
    return res.status(404).json({ error: 'Canal não encontrado' });
  }

  canal.send(`@everyone ${mensagem}`)
    .then(() => res.json({ success: true }))
    .catch(error => res.status(500).json({ error: 'Erro ao enviar mensagem', details: error }));
});

client.on('ready', () => {
  console.log(`Bot está online como ${client.user.tag}`);
});

client.on("ready", () => {
  app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
  });
});

client.login(token);
