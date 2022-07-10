import {
	getModelForClass,
	modelOptions,
	prop,
	Ref,
} from '@typegoose/typegoose'
import { Message, MessageLast } from './Message'

@modelOptions({
	options: {
		allowMixed: 0,
	},
})
export class Conversation {
	@prop({ required: true })
	phone: string

	@prop({ required: true, ref: () => Message })
	messages: Ref<Message>[]

	@prop({ required: false })
	lastMessages: MessageLast[]
	// @prop({ required: true })
	// history: string
}

export default getModelForClass(Conversation)
