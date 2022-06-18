import { init, parse } from 'es-module-lexer';

(async () => {
  await init;

  const source = `
    import type { name } from 'mod\\u1011';
    import json from './json.json' assert { type: 'json' }
    export var p = 5;
    export function q () {

    };

    // Comments provided to demonstrate edge cases
    import /*comment!*/ (  'asdf', { assert: { type: 'json' }});
    import /*comment!*/.meta.asdf;
  `;

  const [imports, exports] = parse(source, 'optional-sourcename');
  console.log(source.substring(imports[0].ss, imports[0].se));
  console.log(exports);

  // Returns "modထ"
  // imports[0].n
  // Returns "mod\u1011"
  // source.substring(imports[0].s, imports[0].e);
  // "s" = start
  // "e" = end

  // Returns "import { name } from 'mod'"
  // source.substring(imports[0].ss, imports[0].se);
  // "ss" = statement start
  // "se" = statement end

  // Returns "{ type: 'json' }"
  // source.substring(imports[1].a, imports[1].se);
  // "a" = assert, -1 for no assertion

  // Returns "p,q"
  // exports.toString();

  // Dynamic imports are indicated by imports[2].d > -1
  // In this case the "d" index is the start of the dynamic import bracket
  // Returns true
  // imports[2].d > -1;

  // Returns "asdf" (only for string literal dynamic imports)
  // imports[2].n
  // Returns "import /*comment!*/ (  'asdf', { assert: { type: 'json' } })"
  // source.substring(imports[2].ss, imports[2].se);
  // // Returns "'asdf'"
  // source.substring(imports[2].s, imports[2].e);
  // // Returns "(  'asdf', { assert: { type: 'json' } })"
  // source.substring(imports[2].d, imports[2].se);
  // // Returns "{ assert: { type: 'json' } }"
  // source.substring(imports[2].a, imports[2].se - 1);

  // For non-string dynamic import expressions:
  // - n will be undefined
  // - a is currently -1 even if there is an assertion
  // - e is currently the character before the closing )

  // For nested dynamic imports, the se value of the outer import is -1 as end tracking does not
  // currently support nested dynamic immports

  // import.meta is indicated by imports[2].d === -2
  // Returns true
  // imports[2].d === -2;
  // Returns "import /*comment!*/.meta"
  // source.substring(imports[2].s, imports[2].e);
  // ss and se are the same for import meta
})();