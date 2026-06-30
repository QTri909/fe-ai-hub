export const getQueryParams = (url?: string): Record<string, string> => {
  const search = url ? new URL(url).search : window.location.search;
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

export const stringifyQueryParams = (params: Record<string, string | number | boolean | undefined | null>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const searchStr = searchParams.toString();
  return searchStr ? `?${searchStr}` : '';
};
