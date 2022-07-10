import WAWebJS, { Client } from 'whatsapp-web.js'
import Conversation from '../models/Conversation'
import { friendCompletition } from '../openai/openai'
import Logger from '../utils/Logger'
import { parseMessages } from '../utils/parseMessages'
import { wait, waitForTypeMessage } from '../utils/wait'
import errorMessageHandler from './errorMessageHandler'
import mediaHandler from './mediaHandler'
import { validatePhone } from '../validator/validatePhone'
import { random } from 'lodash'
import Message from '../models/Message'

const { err, grn, blu, log } = new Logger()

const messageHandler = async (message: WAWebJS.Message, client: Client) => {
	try {
		// Get the pgone number and msg
		const phoneFrom = message.from
		let msg: string = message.body

		// const valid = await validatePhone(phoneFrom)

		// // if (!valid) {
		// // 	return client.sendMessage(
		// // 		phoneFrom,
		// // 		errorMessageHandler['invalid-phone']
		// // 	)
		// // }

		// The message hasMedia if true, download and analyze
		if (message.hasMedia) {
			msg = ((await mediaHandler(message)) || '') + ' ' + message.body
		}

		// Search for prev conversations

		const document = await Conversation.findOne(
			{ phone: phoneFrom },
			{
				messages: {
					$slice: -8,
				},
				_id: 0,
			}
		).populate('messages')

		let history = ''

		// If document exits
		if (document) {
			// Search from message limit, if true, send error
			if (document?.messages.length >= 100)
				return client.sendMessage(
					phoneFrom,
					errorMessageHandler['message-limit']
				)

			const matchedMessages = await Message.find({
				_id: {
					$in: document?.messages,
				},
			})

			// Save prev messages on history
			history = parseMessages(matchedMessages)
		} else {
			// if doesnt exits, create
			const newConversation = new Conversation({
				phone: phoneFrom,
			})

			await newConversation.save()
		}

		// Find for conversation and update the stack
		await Conversation.findOneAndUpdate(
			{ phone: phoneFrom },
			{
				$push: {
					lastMessages: {
						text: msg,
						fromServer: false,
					},
				},
			}
		)

		// Wait for random time, wait for more messages before response
		await wait(random(2500, 4200))

		// const getContext = Conversation.findOne({phone: phoneFrom}, {})

		// Get whatsapp chat, for the sendStateTyping()
		const chat = await message.getChat()
		chat.sendStateTyping()

		// Update document, remove stack
		const documentUpdates = await Conversation.findOneAndUpdate(
			{ phone: phoneFrom },
			{ lastMessages: [] }
		)

		// If stack is equal to 0 do nothing
		if (documentUpdates?.lastMessages.length === 0) {
			return
		}

		// Combine prevMessages with the stack
		history += parseMessages(documentUpdates?.lastMessages)

		// Send OpenAi for a AI Response:
		let compl = await friendCompletition(history + 'Amigo:')

		// Trim the response for spaces
		compl = compl.trim()

		// Simulate the waiting time of writing a message
		await waitForTypeMessage(compl)

		client.sendMessage(phoneFrom, compl)

		// Push the message to the DB history of messages

		// newMessage object from message
		const newMessage = await Message.create({
			text: msg,
			fromServer: false,
		})

		await Conversation.findOneAndUpdate(
			{ phone: phoneFrom },
			{
				$push: { messages: newMessage },
			}
		)

		blu(history)
		grn('Amigo: ' + compl)

		// If AI Response, push the response to the DB history of messages
		if (compl) {
			const newMessageFromServer = await Message.create({
				text: compl,
				fromServer: true,
			})

			await Conversation.findOneAndUpdate(
				{ phone: phoneFrom },
				{
					$push: {
						messages: newMessageFromServer,
					},
				}
			)
		}
	} catch (error) {
		// err(error)
		log(error)
	}
}

export default messageHandler
