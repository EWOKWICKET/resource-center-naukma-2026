export const ADD_TO_LIBRARY = `
  mutation AddToLibrary($bookId: ID!) {
    addToLibrary(bookId: $bookId) {
      id
      bookId
      addedAt
    }
  }
`;

export const REMOVE_FROM_LIBRARY = `
  mutation RemoveFromLibrary($bookId: ID!) {
    removeFromLibrary(bookId: $bookId)
  }
`;
