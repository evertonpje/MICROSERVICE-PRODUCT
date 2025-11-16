import DatabaseConnection from "../database/DatabaseConnection"
import ProductRepository from "../../application/repository/ProductRepository"
import ProductRepositoryDatabase from "../repository/ProductRepositoryDatabase"
import RepositoryFactory from "../../application/factory/RepositoryFactory"
import SqliteAdapter from "../database/SqliteAdapter"
import ProductRepositorySqlite from "../repository/ProductRepositorySqlite"

export default class DatabaseRepositoryFactory implements RepositoryFactory {
    constructor(readonly connection: DatabaseConnection) {}

    createProductRepository(): ProductRepository {
        if (this.connection instanceof SqliteAdapter) {
            return new ProductRepositorySqlite(this.connection)
        }
        return new ProductRepositoryDatabase(this.connection)
    }
}
