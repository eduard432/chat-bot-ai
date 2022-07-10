import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai'
import {
	friendInstructions,
	initialFriendPrompt,
	initialKeyWordsPrompt,
} from './prompts'

const preConfig = {
	model: 'text-davinci-002',
	prompt: '',
	temperature: 0.9,
	max_tokens: 150,
	top_p: 1,
	frequency_penalty: 0,
	presence_penalty: 0.6,
	stop: ['AI:', 'Humano:'],
}

export const completion = async (
	config: CreateCompletionRequest = preConfig
) => {
	const OPENAI_KEY: any = process.env.OPENAI_KEY

	const configKey = new Configuration({
		apiKey: OPENAI_KEY,
	})

	const openai = new OpenAIApi(configKey)

	const response = await openai.createCompletion(config).then((response) => {
		const { choices } = response.data

		if (typeof choices !== 'undefined') {
			return String(choices[0].text)
		}

		return 'Deme un segundo'
	})

	return response
}

export const friendCompletition = (prompt: string = initialFriendPrompt, context = '') =>
	completion({
		frequency_penalty: 0.5,
		max_tokens: 80,
		model: 'text-davinci-002',
		presence_penalty: 0.9,
		prompt: `${friendInstructions}${context}${prompt}`,
		stop: ['Amigo:', 'Tu:'],
		temperature: 0.95,
		top_p: 1,
	})

export const keyWordsCompletition = (prompt: string) =>
	completion({
		frequency_penalty: 0.5,
		max_tokens: 80,
		model: 'text-davinci-002',
		prompt: `${initialKeyWordsPrompt}${prompt}`,
		temperature: 0.7,
		top_p: 1,
	})
