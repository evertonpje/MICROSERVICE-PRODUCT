import DatabaseRepositoryFactory from "./infra/factory/DatabaseRepositoryFactory"
import ExpressAdapter from "./infra/http/ExpressAdapter"
import HapiAdapter from "./infra/http/HapiAdapter"
import HttpController from "./infra/http/HttpController"
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter"
import UsecaseFactory from "./infra/factory/UsecaseFactory"
import SqliteAdapter from "./infra/database/SqliteAdapter"
import { initSqliteSchema } from "./infra/database/sqlite_init"
import { openApiSpec } from "./infra/http/openapi"
import swaggerUi from "swagger-ui-express"

// main
;(async () => {
    const dbType = process.env.DB || "postgres"
    let connection: any
    if (dbType === "sqlite") {
        const dbFile = process.env.DB_FILE || "./catalog.sqlite"
        connection = new SqliteAdapter()
        await connection.connect(dbFile)
        await initSqliteSchema(connection)
    } else {
        connection = new PgPromiseAdapter()
        await connection.connect()
    }

    const repositoryFactory = new DatabaseRepositoryFactory(connection)
    const usecaseFactory = new UsecaseFactory(repositoryFactory)
    const httpServer = new ExpressAdapter()
    // const httpServer = new HapiAdapter();
    new HttpController(httpServer, usecaseFactory)
    // Swagger UI (Express only)
    if (httpServer instanceof ExpressAdapter) {
        ;(httpServer as any).use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(openApiSpec)
        )
    }
    httpServer.listen(3001)
})()
