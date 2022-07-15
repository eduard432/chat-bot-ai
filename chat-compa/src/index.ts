import dotenv from 'dotenv'
import connectDb from './db/db'
import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import Logger from './utils/Logger'
import messageHandler from './messages/messageHandler'
import { filter } from 'lodash'
import Message from './models/Message'
import mediaHandler from './messages/mediaHandler'
import { readFile } from './helpers/fs'
import { convertOggToWav, describeAudioApi } from './apis/audios'
import fs from 'fs/promises'

dotenv.config()

const { blu, grn, log } = new Logger()

const NODE_ENV = process.env.NODE_ENV

const main = async () => {
	connectDb()

	const client = new Client({
		authStrategy: new LocalAuth(),
		puppeteer: {
			slowMo: 300,
			args: NODE_ENV === 'production' ? ['--no-sandbox'] : [],
		},
	})

	client.on('qr', (qr) => {
		grn('QR RECEIVED')
		qrcode.generate(qr, { small: true })
	})

	client.on('ready', async () => {
		blu('Client is ready!')
		const chats = await client.getChats()
		const unreadChats = filter(chats, (c) => c.unreadCount !== 0)
		for (const chat of unreadChats) {
			const messages = await chat?.fetchMessages({ limit: 10 })
			const messagesUnread = filter(
				messages,
				(m) => m.ack === 1 && m.fromMe === false
			)
			for (const message of messagesUnread) {
				messageHandler(message, client)
			}
		}
	})

	client.on('message', (msg) => messageHandler(msg, client))

	// client.on('message_ack', (message) => ylw(`ACK: ${message.ack}, Body: ${message.body}`))

	// client.on('call', (call) => callHandler(call, client))

	await client.initialize()
}

main() 
// ;(async () => {
// 	const fileName = 'example'
// 	const buffer = await readFile('./audios/Voz-006.ogg')
// 	await convertOggToWav(buffer, fileName)
// 	const bufferWav = await readFile(`./audios/${fileName}.wav`)
// 	const text = await describeAudioApi(bufferWav)
// 	log(text)
// 	await fs.unlink(`./audios/${fileName}.wav`)
// })()
