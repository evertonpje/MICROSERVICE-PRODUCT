import DatabaseConnection from "./DatabaseConnection"
import sqlite3 from "sqlite3"

// Framework and Driver
// Adapter
export default class SqliteAdapter implements DatabaseConnection {
    private db?: sqlite3.Database

    async connect(databaseFile: string = ":memory:"): Promise<void> {
        sqlite3.verbose()
        await new Promise<void>((resolve, reject) => {
            const db = new sqlite3.Database(
                databaseFile,
                (err: Error | null) => {
                    if (err) return reject(err)
                    return resolve()
                }
            )
            this.db = db
        })
    }

    async query(statement: string, params: any): Promise<any> {
        if (!this.db) throw new Error("Database not connected")
        const sql = statement.trim().toLowerCase()
        const bind = Array.isArray(params) ? params : []

        if (sql.startsWith("select")) {
            return await new Promise<any[]>((resolve, reject) => {
                this.db!.all(
                    statement,
                    bind,
                    (err: Error | null, rows: any[]) => {
                        if (err) return reject(err)
                        resolve(rows || [])
                    }
                )
            })
        }

        // For non-SELECT statements, run and return basic metadata
        return await new Promise<{ lastID: number; changes: number }>(
            (resolve, reject) => {
                this.db!.run(
                    statement,
                    bind,
                    function (this: sqlite3.RunResult, err: Error | null) {
                        if (err) return reject(err)
                        resolve({
                            lastID: this.lastID ?? 0,
                            changes: this.changes ?? 0,
                        })
                    }
                )
            }
        )
    }

    async close(): Promise<void> {
        if (!this.db) return
        await new Promise<void>((resolve, reject) => {
            this.db!.close((err: Error | null) =>
                err ? reject(err) : resolve()
            )
        })
        this.db = undefined
    }
}
