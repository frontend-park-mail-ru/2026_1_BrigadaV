export const debounce = <TParams extends unknown[], TReturn>(
    func: (...parameters: TParams) => TReturn,
    delay: number = 250
) => {
    let outerArgs: TParams | [] = [];
    let id: NodeJS.Timeout | null = null;

    function execute() {
        func(...(outerArgs as TParams));
        outerArgs = [];
        id = null;
    }

    return function(...args: TParams) {
        if (id !== null) {
            clearTimeout(id);
        }

        outerArgs = args;
        id = setTimeout(execute, delay);
    };
};
