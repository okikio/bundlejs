import type { VisualizerData } from "../types/types";
import type { TemplateType } from "../types/template-types";
interface BuildHtmlOptions {
    title: string;
    data: VisualizerData;
    template: TemplateType;
}
export declare function buildHtml({ title, data, template }: BuildHtmlOptions): Promise<string>;
export {};
