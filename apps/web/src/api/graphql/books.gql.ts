export const GET_BOOKS = `
  query GetBooks($search: String, $categoryId: ID, $isActive: Boolean) {
    books(search: $search, categoryId: $categoryId, isActive: $isActive) {
      id
      title
      author
      description
      isbn
      coverUrl
      category {
        id
        name
        description
        isActive
      }
      publishedYear
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_BOOK = `
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      author
      description
      isbn
      coverUrl
      category {
        id
        name
        description
        isActive
      }
      publishedYear
      isActive
      createdAt
      updatedAt
    }
  }
`;
