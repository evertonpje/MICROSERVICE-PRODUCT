import DatabaseConnection from "./DatabaseConnection"

export async function initSqliteSchema(
    connection: DatabaseConnection
): Promise<void> {
    // Create table if not exists
    await connection.query(
        `create table if not exists product (
      id_product integer primary key,
      description text not null,
      price real not null,
      width integer,
      height integer,
      length integer,
      weight real
    )`,
        []
    )

    // Seed data if fewer than 100 products exist
    const rows = await connection.query(
        "select count(1) as count from product",
        []
    )
    const count = Number(rows[0]?.count ?? rows[0]?.["count(1)"] ?? 0)
    if (count < 100) {
        for (let i = 1; i <= 100; i++) {
            // Deterministic simple sample data
            const price = 10 * i
            const width = 10 + (i % 10)
            const height = 5 + (i % 7)
            const length = 8 + (i % 6)
            const weight = (i % 15) + 1
            await connection.query(
                "insert or ignore into product (id_product, description, price, width, height, length, weight) values (?, ?, ?, ?, ?, ?, ?)",
                [i, `Product ${i}`, price, width, height, length, weight]
            )
        }
    }
}
