import { Message } from '../models/Message'

export const parseMessages = (messages: Message[] | undefined) => {
    if(typeof messages === 'undefined' ) return ''
	let fullText = ''
	for (let i = 0; i < messages.length; i++) {
		const message = messages[i]
		if (message.fromServer) {
			fullText += 'Amigo: ' + message.text + '\n'
		} else {
			fullText += 'Tu: ' + message.text + '\n'
		}
	}

	return fullText
}
