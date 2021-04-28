// import path from "path";
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// console.log(require.resolve('memfs'));
console.log(/([\S]+)@([\S]+)/g.test("@react@latest"));
console.log(/([\S]+)@([\S]+)/g.exec("@react@latest"));