export declare type FilterSetter = (value: string) => void;
export declare type UseFilter = {
    includeFilter: string;
    excludeFilter: string;
    setIncludeFilter: FilterSetter;
    setExcludeFilter: FilterSetter;
    getModuleFilterMultiplier: (data: {
        id: string;
    }) => number;
};
export declare const useFilter: () => UseFilter;
