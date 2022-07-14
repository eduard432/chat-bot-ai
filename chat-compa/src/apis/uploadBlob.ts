import { BlobServiceClient } from '@azure/storage-blob'
import { v1 as uuid } from 'uuid'
import Logger from '../utils/Logger'

const { err, log, mgt } = new Logger()

export const uploadBlob = async (
	data: Buffer,
	phone: string,
	container: string
): Promise<string | null> => {
	const BUCKET_CONNECTION_STRING: any = process.env.BUCKET_CONNECTION_STRING
	try {
		const name = `${phone}-${uuid()}`
		const blobServiceClient = BlobServiceClient.fromConnectionString(
			BUCKET_CONNECTION_STRING
		)
		const containerClient = blobServiceClient.getContainerClient(container)
		const blockBlobContainer = containerClient.getBlockBlobClient(name)

		mgt('\nUploading to Azure storage as blob\n\t')

		// Upload data to the blobl
		const uploadBlobResponse = await blockBlobContainer.uploadData(data)

		const url = blockBlobContainer.url

		mgt(
			'Blob was uploaded successfully. requestId: ' +
				uploadBlobResponse.requestId
		)

		return url
	} catch (error) {
		err(error)
		return null
	}
}
