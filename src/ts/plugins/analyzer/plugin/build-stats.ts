/// <reference lib="webworker" />
import type { VisualizerData } from "../types/types";
import type { TemplateType } from "../types/template-types";

// import { getRequest } from "../../../util/cache";

const htmlEscape = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

interface BuildHtmlOptions {
  title: string;
  data: VisualizerData;
  template: TemplateType;
}

export async function buildHtml({ title, data, template }: BuildHtmlOptions): Promise<string> {
  // const [script, style]: Response[] = await Promise.all([
  //   getRequest(`/js/${template}.min.js`),
  //   getRequest(`/js/${template}.min.css`)
  // ]);

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${htmlEscape(title)}</title>
    <link rel='stylesheet' href='/js/${template}.min.css' />
    <style>
    </style>
  </head>
  <body>
    <main></main>
    <!-- <script src="/js/${template}.min.js" type="module" defer></script> -->
    <script type="module" defer>
      /*<!--*/
      import * as drawChart from "/js/${template}.min.js";
      const data = ${JSON.stringify(data)};
  
      const run = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
  
        const chartNode = document.querySelector("main");
        drawChart.default(chartNode, data, width, height);
      };
  
      window.addEventListener('resize', run);
  
      document.addEventListener('DOMContentLoaded', run);
      /*-->*/
    </script>
  </body>
  </html>
  `;
}
