/**
 * GraphQL is used for read-heavy queries that benefit from flexible field
 * selection and nested data in a single round-trip.
 * All CRUD operations live in the REST API.
 */
export const schema = `
  type Book {
    id: ID!
    title: String!
    author: String!
    description: String
    isbn: String
    coverUrl: String
    category: Category
    publishedYear: Int
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    description: String
    isActive: Boolean!
  }

  type CategoryWithStats {
    id: ID!
    name: String!
    description: String
    isActive: Boolean!
    activeBookCount: Int!
  }

  type BooksPage {
    items: [Book!]!
    total: Int!
    page: Int!
    limit: Int!
  }

  type CategoryBookCount {
    categoryId: ID!
    categoryName: String!
    count: Int!
  }

  type AdminStats {
    totalBooks: Int!
    activeBooks: Int!
    inactiveBooks: Int!
    totalCategories: Int!
    booksByCategory: [CategoryBookCount!]!
  }

  type Query {
    books(search: String, categoryId: ID, isActive: Boolean, page: Int, limit: Int): BooksPage!
    book(id: ID!): Book
    categoriesWithStats: [CategoryWithStats!]!
    adminStats: AdminStats!
  }
`;
