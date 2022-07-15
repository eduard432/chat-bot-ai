import fs from 'fs'

type ReadOptions = {
	flag?: string | undefined
	encoded?: string | undefined
}

export const readFile = (
	path: fs.PathOrFileDescriptor,
	opts: ReadOptions = {}
): Promise<Buffer> =>
	new Promise((resolve, reject) => {
		fs.readFile(path, opts, (err, data) => {
			if (err) reject(err)
			else resolve(data)
		})
	})

export const writeFile = (
	path: fs.PathOrFileDescriptor,
	data: Buffer | string,
	opts: fs.WriteFileOptions = 'base64'
): Promise<void> =>
	new Promise((resolve, reject) => {
		fs.writeFile(path, data, opts, (err) => {
			if (err) reject(err)
			else resolve()
		})
	})
