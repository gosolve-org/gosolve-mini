export const paginate = (source: any[], pageSize: number, page: number) => {
        if (!source) return [];
        source = source.filter(Boolean);

        const pageCount = Math.ceil(source.length / pageSize);
        const firstIndexOnPage = (page - 1) * pageSize;
        const isLastPage = page === pageCount;
        const lastIndexOnPage = isLastPage
            ? (source.length % pageSize === 0
                    ? pageSize
                    : source.length % pageSize) +
                    pageSize * (page - 1)
            : pageSize * page;

        return source.slice(firstIndexOnPage, lastIndexOnPage);
}
