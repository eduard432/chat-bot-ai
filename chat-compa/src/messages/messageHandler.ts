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

const { err, grn, blu, log } = new Logger()

const messageHandler = async (message: WAWebJS.Message, client: Client) => {
	try {
		const phoneFrom = message.from
		// const valid = await validatePhone(phoneFrom)

		// // if (!valid) {
		// // 	return client.sendMessage(
		// // 		phoneFrom,
		// // 		errorMessageHandler['invalid-phone']
		// // 	)
		// // }

		let msg: string = message.body

		if (message.hasMedia) {
			msg = ((await mediaHandler(message)) || '') + ' ' + message.body
		}

		const document = await Conversation.findOne(
			{ phone: phoneFrom },
			{
				messages: {
					$slice: -8,
				},
				_id: 0,
			}
		)

		const newMessage = {
			text: msg,
			fromServer: false,
		}

		let history = ''

		if (document) {
			if (document?.messages.length >= 100)
				return client.sendMessage(
					phoneFrom,
					errorMessageHandler['message-limit']
				)
			history = parseMessages(document?.messages)
		} else {
			const newConversation = new Conversation({
				phone: phoneFrom,
			})

			await newConversation.save()
		}

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

		await wait(random(2500, 4500))

		const chat = await message.getChat()
		chat.sendStateTyping()

		const documentUpdates = await Conversation.findOneAndUpdate(
			{ phone: phoneFrom },
			{ lastMessages: [] }
		)

		if (documentUpdates?.lastMessages.length === 0) {
			return
		}

		history += parseMessages(documentUpdates?.lastMessages)

		let compl = await friendCompletition(history + 'Amigo:')

		compl = compl.trim()

		await waitForTypeMessage(compl)
		client.sendMessage(phoneFrom, compl)

		await Conversation.findOneAndUpdate(
			{ phone: phoneFrom },
			{
				$push: { messages: newMessage },
			}
		)

		blu(history)
		grn('Amigo: ' + compl)

		if (compl) {
			await Conversation.findOneAndUpdate(
				{ phone: phoneFrom },
				{
					$push: {
						messages: {
							text: compl,
							fromServer: true,
						},
					},
				}
			)
		}
	} catch (error) {
		err(error)
	}
}

export default messageHandler
