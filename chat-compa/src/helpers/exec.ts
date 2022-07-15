import { ChildProcess } from 'child_process'

export const waitForExec = (child: ChildProcess): Promise<number | null> => {
	return new Promise((resolve, reject) => {
		child.on('exit', (code) => {
			resolve(code)
		})
	})
}
