import { createSignal, createMemo } from "solid-js";

export type FilterSetter = (value: string) => void;

const throttleFilter = (callback: FilterSetter, limit: number): typeof callback => {
    let waiting = false;
    return (val: string): void => {
        if (!waiting) {
            callback(val);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
};

export type UseFilter = {
    includeFilter: string;
    excludeFilter: string;
    setIncludeFilter: FilterSetter;
    setExcludeFilter: FilterSetter;
    getModuleFilterMultiplier: (data: { id: string }) => number;
};

export const useFilter = (): UseFilter => {
    const [includeFilter, setIncludeFilter] = createSignal<string>("");
    const [excludeFilter, setExcludeFilter] = createSignal<string>("");

    const setIncludeFilterTrottled = createMemo(() => throttleFilter(setIncludeFilter, 200));
    const setExcludeFilterTrottled = createMemo(() => throttleFilter(setExcludeFilter, 200));

    const isModuleIncluded = createMemo(() => {
        if (includeFilter() === "") {
            return () => true;
        }
        try {
            const re = new RegExp(includeFilter());
            return ({ id }: { id: string }) => re.test(id);
        } catch (err) {
            return () => false;
        }
    });

    const isModuleExcluded = createMemo(() => {
        if (excludeFilter() === "") {
            return () => false;
        }
        try {
            const re = new RegExp(excludeFilter());
            return ({ id }: { id: string }) => re.test(id);
        } catch (err) {
            return () => false;
        }
    });

    const isDefaultInclude = includeFilter() === "";

    const getModuleFilterMultiplier = createMemo(() => {
        return (data: { id: string }) => {
            if (isDefaultInclude) {
                return isModuleExcluded()(data) ? 0 : 1;
            }
            return isModuleExcluded()(data) && !isModuleIncluded()(data) ? 0 : 1;
        };
    });

    return {
        getModuleFilterMultiplier: getModuleFilterMultiplier(),
        includeFilter: includeFilter(),
        excludeFilter: excludeFilter(),
        setExcludeFilter: setExcludeFilterTrottled(),
        setIncludeFilter: setIncludeFilterTrottled(),
    };
};
