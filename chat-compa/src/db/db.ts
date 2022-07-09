import { connect } from 'mongoose'


export default async function connectDb() {
    
    const DB_ROOT_USERNAME: any = process.env.DB_ROOT_USERNAME
    const DB_ROOT_PASSWORD: any = process.env.DB_ROOT_PASSWORD
    const URI: any = process.env.DB_URI
	const db = await connect(URI)
    console.log(`Database is connected to ${db.connection.db.databaseName}`)
}
