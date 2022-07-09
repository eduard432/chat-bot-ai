import { modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
	schemaOptions: {
		timestamps: true,
		_id: false,
	},
})
export class Message {
	@prop({ required: true })
	text: string
	@prop({ required: true })
	fromServer: boolean
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
