import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
	options: {
		allowMixed: 0,
	}
})
class ValidPhones {
	@prop({ required: true })
	phones: string[]
}

export default getModelForClass(ValidPhones)
