import { connect } from 'mongoose'

export default async function connectDb() {
	const DB_URI = process.env.DB_URI
	const db = await connect(DB_URI || '')
	console.log(`Database is connected to ${db.connection.db.databaseName}`)
}
