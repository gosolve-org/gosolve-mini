export const paginate = (source?: any[], pageSize: number = 0, page: number = 0) => {
    if (source == null) return [];
    const filteredSource = source.filter(Boolean);

    const pageCount = Math.ceil(filteredSource.length / pageSize);
    const firstIndexOnPage = (page - 1) * pageSize;
    const isLastPage = page === pageCount;
    const lastIndexOnPage = isLastPage
        ? (filteredSource.length % pageSize === 0 ? pageSize : filteredSource.length % pageSize) +
          pageSize * (page - 1)
        : pageSize * page;

    return filteredSource.slice(firstIndexOnPage, lastIndexOnPage);
};
