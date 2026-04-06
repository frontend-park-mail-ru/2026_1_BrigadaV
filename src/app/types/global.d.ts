declare module '*.hbs?compiled' {
    const template: (data?: Record<string, unknown>) => string;
    export default template;
}
