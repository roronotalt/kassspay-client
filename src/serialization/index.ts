import * as devalue from "devalue";

// stringify wrapper using svelte devalue https://github.com/sveltejs/devalue
export const Kstringify = (
    value: any,
    reducers?: Record<string, (value: any) => any>
): string => {
    return devalue.stringify(value, reducers);
};

// parse wrapper using svelte devalue https://github.com/sveltejs/devalue
export const Kparse = (
    serialized: string,
    revivers?: Record<string, (value: any) => any>
) => {
    return devalue.parse(serialized, revivers);
};
