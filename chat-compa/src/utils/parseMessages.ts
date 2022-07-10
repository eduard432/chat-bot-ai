import { Message, MessageLast } from '../models/Message'

export const parseMessages = (
	messages: (Message | MessageLast | undefined)[] | undefined
) => {
	if (typeof messages === 'undefined') return ''
	let fullText = ''
	for (let i = 0; i < messages.length; i++) {
		const message = messages[i]
		if (typeof message === 'undefined') return ''
		if (message?.fromServer) {
			fullText += 'Amigo: ' + message?.text + '\n'
		} else {
			fullText += 'Tu: ' + message?.text + '\n'
		}
	}

	return fullText
}
