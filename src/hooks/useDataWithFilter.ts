import React from "react";

import { useDebouncedValue } from "./useDebouncedValue";

interface IUseDataWithFilterResult<T> {
  data: T[];
  searchQuery?: string;
  filterByText: (query: string) => void;
  clearSearch: () => void;
}

export interface IUseDataWithFilter<T> {
  data?: T[];
  excludeKeys?: string[];
  searchKeys?: string[];
  defaultSearchValue?: string;
  filterData?: (items: T[], query: string) => T[];
}

export const useDataWithFilter = <T>({
  data,
  excludeKeys = [],
  searchKeys = [],
  defaultSearchValue = "",
  filterData,
}: IUseDataWithFilter<T>): IUseDataWithFilterResult<T> => {
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useDebouncedValue<string>(600);
  const [searchQuery, setSearchQuery] =
    React.useState<string>(defaultSearchValue);

  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setDebouncedSearchQuery(query, true);
    } else {
      setDebouncedSearchQuery(query);
    }
  };

  const filterByText = React.useCallback((items: T[], query: string) => {
    if (filterData) {
      return filterData(items, query);
    }

    const result = items.filter((item) => {
      if (!(item instanceof Object)) {
        return false;
      }
      const keys = Object.keys(item);

      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (key && excludeKeys?.includes(key)) {
          continue;
        }
        if (searchKeys.length && key && !searchKeys?.includes(key)) {
          continue;
        }
        const value = item[key as keyof T];
        if (typeof value !== "string") {
          continue;
        }
        const includesSearch = value
          ?.toLowerCase()
          .includes(query.toLowerCase());
        if (includesSearch) {
          return true;
        }
      }

      return false;
    });

    return result;
  }, []);

  const clearSearch = React.useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("", true);
  }, []);

  const filteredData = React.useMemo(() => {
    const notFiltered = data || [];
    return debouncedSearchQuery
      ? filterByText(notFiltered, debouncedSearchQuery)
      : notFiltered;
  }, [data, debouncedSearchQuery]);

  return {
    data: filteredData,
    searchQuery,
    clearSearch,
    filterByText: updateSearchQuery,
  };
};
