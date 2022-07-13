import Logger from '../utils/Logger'
import Message, { Message as MessageType } from '../models/Message'
import Conversation, {
	Conversation as ConversationType,
} from '../models/Conversation'

const { gry, log } = new Logger()

export const getContext = async (
	search: string,
	phoneFrom: string,
	document: ConversationType | null
) => {
	if (document) {
		// Search for context
		const contextPrevMessages = await Message.find(
			{
				phoneConversation: phoneFrom,
				$text: {
					$search: search,
				},
			},
			{ score: { $meta: 'textScore' } },
			{
				sort: {
					score: { $meta: 'textScore' },
				},
			}
		).sort('-date')

		const index = document.messages.indexOf(contextPrevMessages[0]?.id)

		log({ index })

		if (index === -1) {
			return [undefined]
		}

		const messagesDocument = await Conversation.findOne({ phone: phoneFrom })
			.where('messages')
			.slice([index - 2, 6])
		// .populate({
		// 	path: 'messages',
		// 	select: {
		// 		text: 1,
		// 		fromServer: 1,
		// 		_id: 0,
		// 	},
		// })

		const matchedMessages = await Message.find({
			_id: {
				$in: messagesDocument?.messages,
			},
		})

		return matchedMessages
	}
}
