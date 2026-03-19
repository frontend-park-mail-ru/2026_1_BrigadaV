declare module "*.hbs?compiled" {
    const template: (data?: any) => string;
    export default template;
}
