import { OpenAPIV3 } from "openapi-types"

export const openApiSpec: OpenAPIV3.Document = {
    openapi: "3.0.3",
    info: {
        title: "Catalog API",
        version: "1.0.0",
        description: "API para consulta de produtos (Postgres ou SQLite)",
    },
    servers: [{ url: "http://localhost:3001", description: "Local" }],
    paths: {
        "/products": {
            get: {
                summary: "Lista produtos",
                tags: ["Products"],
                parameters: [
                    {
                        name: "Content-Type",
                        in: "header",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["application/json", "text/csv"],
                        },
                        description: "Define formato de saída (padrão JSON).",
                    },
                ],
                responses: {
                    200: {
                        description: "Lista de produtos",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Product",
                                    },
                                },
                            },
                            "text/csv": {
                                schema: {
                                    type: "string",
                                    description: "CSV com produtos",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/products/{idProduct}": {
            get: {
                summary: "Obtém um produto pelo ID",
                tags: ["Products"],
                parameters: [
                    {
                        name: "idProduct",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    200: {
                        description: "Produto encontrado",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Product",
                                },
                            },
                        },
                    },
                    422: {
                        description: "Erro de validação ou não encontrado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: { message: { type: "string" } },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Product: {
                type: "object",
                properties: {
                    id_product: { type: "integer" },
                    description: { type: "string" },
                    price: { type: "number" },
                    width: { type: "integer", nullable: true },
                    height: { type: "integer", nullable: true },
                    length: { type: "integer", nullable: true },
                    weight: { type: "number", nullable: true },
                },
                required: ["id_product", "description", "price"],
            },
        },
    },
}
