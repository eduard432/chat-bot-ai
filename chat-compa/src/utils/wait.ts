import { random } from 'lodash'

export const wait = (time: number) =>
	new Promise((resolve, reject) => setTimeout(resolve, time))

export const waitForTypeMessage = (message: string) => wait(message.length * random(75, 150))
