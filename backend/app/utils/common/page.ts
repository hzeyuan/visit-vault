const DEFAULT_PAGE_SIZE = 20;
const getPageSize = (take?: number | null): number => {
    return take || DEFAULT_PAGE_SIZE;
}