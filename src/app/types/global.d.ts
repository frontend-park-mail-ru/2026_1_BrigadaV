declare module "*.hbs?compiled" {
    const template: (data?: any) => string;
    export default template;
}

interface CommandEvent extends Event {
    command: string;
    source: HTMLElement;
}

interface HTMLElementEventMap {
  "command": CommandEvent;
}
