import { BlobServiceClient } from '@azure/storage-blob'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Logger from '../utils/Logger'

const { err, log, mgt, ylw } = new Logger()

export const describeImage = async (
	url: string| undefined
): Promise<string | undefined> => {
	const IMAGE_AI_ENDPOINT: any = process.env.IMAGE_AI_ENDPOINT
	const IMAGE_AI_KEY: any = process.env.IMAGE_AI_KEY

	try {
		const request = await axios.post(
			IMAGE_AI_ENDPOINT + '/describe',
			{
				url,
			},
			{
				params: {
					language: 'es',
				},
				headers: {
					'Content-Type': 'application/json',
					'Ocp-Apim-Subscription-Key': IMAGE_AI_KEY,
				},
			}
		)

		return request.data?.description?.captions[0].text || undefined
	} catch (error: any) {
		err(error)
	}
}

export const uploadImage = async (
	data: Buffer
): Promise<string | undefined> => {
	try {

		const name = `${uuidv4()}.jpeg`

		const IMAGE_BUCKET_CONNECTION_STRING: any =
			process.env.IMAGE_BUCKET_CONNECTION_STRING

		const bloblServiceClient = BlobServiceClient.fromConnectionString(
			IMAGE_BUCKET_CONNECTION_STRING
		)

		const containerClient =
			bloblServiceClient.getContainerClient('images-bot')

		const blockBlobContainer = containerClient.getBlockBlobClient(name)

		mgt('\nUploading to Azure storage as blob:\n\t')

		// Upload data to the blob
		const uploadBlobResponse = await blockBlobContainer.uploadData(data)


		const url = blockBlobContainer.url

		mgt(
			'Blob was uploaded successfully. requestId: ' +
				uploadBlobResponse.requestId
		)

		return url

	} catch (error) {
		err(error)
	}
}
