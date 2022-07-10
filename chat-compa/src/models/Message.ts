import { getModelForClass, modelOptions, prop, index } from '@typegoose/typegoose'

@modelOptions({
	schemaOptions: {
		timestamps: true,
	},
})
@index({text: 'text'})
export class Message {
	@prop({ required: true })
	text: string
	@prop({ required: true })
	fromServer: boolean
	@prop({ required: true })
	phoneConversation: string
}

@modelOptions({
	schemaOptions: {
		timestamps: true,
		_id: false,
	},
})
export class MessageLast {
	@prop({ required: true })
	text: string
	@prop({ required: true })
	fromServer: boolean
}

export default getModelForClass(Message)
