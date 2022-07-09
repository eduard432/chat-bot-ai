import { isNullOrUndefined } from '@typegoose/typegoose/lib/internal/utils'
import ValidPhones from '../models/ValidPhones'

export const validatePhone = async (number: string): Promise<boolean> => {
	const phone = await ValidPhones.findOne({ phones: number })

	return phone !== null
}
