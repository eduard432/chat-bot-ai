import WAWebJS, { Client } from 'whatsapp-web.js'
import Conversation from '../models/Conversation'
import Logger from '../utils/Logger'
import { waitForTypeMessage } from '../utils/wait'

const { err } = new Logger()

const callHandler = async (call: WAWebJS.Call, client: Client) => {
	try {
		const phoneFrom = call.from
		const document = await Conversation.findOne(
			{ phone: phoneFrom },
			{ messages: 1, _id: 0 }
		)

		if (!document) {
			const newConversation = new Conversation({
				phone: phoneFrom,
			})

			await newConversation.save()
		}

		const newMessageFromUser = {
			text: '[CALL RECEIVE]',
			fromServer: false,
		}

		const newMessageFromServer = {
			text: 'Disculpa, en estos momentos no puedo responder',
			fromServer: true,
		}

		const msgResponse = newMessageFromServer.text

		if (typeof phoneFrom === 'string') {
			client.sendMessage(phoneFrom, msgResponse)
		}

		await waitForTypeMessage(msgResponse)
		await Conversation.findOneAndUpdate(
			{ phoneFrom },
			{
				$push: {
					messages: {
						$each: [newMessageFromUser, newMessageFromServer],
					},
				},
			}
		)
	} catch (error) {
		err(error)
	}
}

export default callHandler
