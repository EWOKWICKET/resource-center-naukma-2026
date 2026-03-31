export const GET_CATEGORIES_WITH_STATS = `
  query GetCategoriesWithStats {
    categoriesWithStats {
      id
      name
      description
      isActive
      activeBookCount
    }
  }
`;

export const GET_ADMIN_STATS = `
  query GetAdminStats {
    adminStats {
      totalBooks
      activeBooks
      inactiveBooks
      totalCategories
      booksByCategory {
        categoryId
        categoryName
        count
      }
    }
  }
`;
