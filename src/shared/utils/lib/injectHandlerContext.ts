export const injectHandlerContext = <TPayload, TContext, TReturn>(
    handler: (params: TPayload & TContext) => TReturn,
    context: TContext
) => {
    return (payload: TPayload) => handler({ ...payload, ...context });
};
