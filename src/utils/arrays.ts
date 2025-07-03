type paginateProps<T> = {
  items: T[];
  page: number;
  limit: number;
};

export class ArraysUtils {
  static paginate<T>({ items, page, limit }: paginateProps<T>) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(items.length / limit);

    return {
      data: paginatedItems,
      pagination: {
        page,
        limit,
        count: items.length,
        totalPages,
      },
    };
  }
}
