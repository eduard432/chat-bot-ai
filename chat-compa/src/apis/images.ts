import { ComputerVisionClient } from '@azure/cognitiveservices-computervision'
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js'
import { BlobServiceClient } from '@azure/storage-blob'
import { v4 as uuidv4 } from 'uuid'
import Logger from '../utils/Logger'

const { err, log, mgt } = new Logger()

export const describeImageSdk = async (
	url: string | undefined
): Promise<string | undefined> => {
	const IMAGE_AI_KEY: any = process.env.IMAGE_AI_KEY
	const IMAGE_AI_ENDPOINT: any = process.env.IMAGE_AI_ENDPOINT + '/describe'
	try {
		const cognitiveServiceCredentials = new CognitiveServicesCredentials(
			IMAGE_AI_KEY
		)
		const client = new ComputerVisionClient(
			cognitiveServiceCredentials,
			IMAGE_AI_ENDPOINT
		)
		const describeImageResponse = await client.describeImage(url || '', {
			language: 'es',
			maxCandidates: 1,
		})

		const text = describeImageResponse?.captions?.[0].text

		return text
	} catch (error: any) {
		log(error)
	}
}

export const uploadImage = async (
	data: Buffer
): Promise<string | undefined> => {
	try {
		const name = `${uuidv4()}.jpeg`

		const BUCKET_CONNECTION_STRING: any =
			process.env.BUCKET_CONNECTION_STRING

		const bloblServiceClient = BlobServiceClient.fromConnectionString(
			BUCKET_CONNECTION_STRING
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
