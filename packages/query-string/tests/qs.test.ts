import { describe, test, expect, it } from "vitest";
import stringify from "../src/qs/stringify.ts"
import { encode } from "../src/qs/utils.ts";
import iconv from "iconv-lite"
import formats from "../src/qs/formats.ts";
import { emptyTestCases } from "./empty-keys-cases.ts";

describe('stringify()', function (t) {
  it('stringifies a querystring object', function (st) {
    expect(stringify({ a: 'b' })).toBe('a=b');
    expect(stringify({ a: 1 })).toBe('a=1');
    expect(stringify({ a: 1, b: 2 })).toBe('a=1&b=2');
    expect(stringify({ a: 'A_Z' })).toBe('a=A_Z');
    expect(stringify({ a: '€' })).toBe('a=%E2%82%AC');
    expect(stringify({ a: '' })).toBe('a=%EE%80%80');
    expect(stringify({ a: 'א' })).toBe('a=%D7%90');
    expect(stringify({ a: '𐐷' })).toBe('a=%F0%90%90%B7');

  });

  it('stringifies falsy values', function (st) {
    expect(stringify(undefined)).toBe('');
    expect(stringify(null)).toBe('');
    expect(stringify(null, { strictNullHandling: true })).toBe('');
    expect(stringify(false)).toBe('');
    expect(stringify(0)).toBe('');

  });

  it('stringifies symbols', function (st) {
    expect(stringify(Symbol.iterator)).toBe('');
    expect(stringify([Symbol.iterator])).toBe('0=Symbol%28Symbol.iterator%29');
    expect(stringify({ a: Symbol.iterator })).toBe('a=Symbol%28Symbol.iterator%29');
    expect(
      stringify({ a: [Symbol.iterator] }, { encodeValuesOnly: true, arrayFormat: 'brackets' }),
      'a[]=Symbol%28Symbol.iterator%29'
    );

  });

  it('stringifies bigints', function (st) {
    var three = BigInt(3);
    var encodeWithN = function (value, charset) {
      var result = encode(value, charset);
      return typeof value === 'bigint' ? result + 'n' : result;
    };
    expect(stringify(three)).toBe('');
    expect(stringify([three])).toBe('0=3');
    expect(stringify([three], { encoder: encodeWithN })).toBe('0=3n');
    expect(stringify({ a: three })).toBe('a=3');
    expect(stringify({ a: three }, { encoder: encodeWithN })).toBe('a=3n');
    expect(
      stringify({ a: [three] }, { encodeValuesOnly: true, arrayFormat: 'brackets' }),
      'a[]=3'
    );
    expect(
      stringify({ a: [three] }, { encodeValuesOnly: true, encoder: encodeWithN, arrayFormat: 'brackets' }),
      'a[]=3n'
    );

  });

  it('adds query prefix', function (st) {
    expect(stringify({ a: 'b' }, { addQueryPrefix: true })).toBe('?a=b');

  });

  it('with query prefix, outputs blank string given an empty object', function (st) {
    expect(stringify({}, { addQueryPrefix: true })).toBe('');

  });

  it('stringifies nested falsy values', function (st) {
    expect(stringify({ a: { b: { c: null } } })).toBe('a%5Bb%5D%5Bc%5D=');
    expect(stringify({ a: { b: { c: null } } }, { strictNullHandling: true })).toBe('a%5Bb%5D%5Bc%5D');
    expect(stringify({ a: { b: { c: false } } })).toBe('a%5Bb%5D%5Bc%5D=false');

  });

  it('stringifies a nested object', function (st) {
    expect(stringify({ a: { b: 'c' } })).toBe('a%5Bb%5D=c');
    expect(stringify({ a: { b: { c: { d: 'e' } } } })).toBe('a%5Bb%5D%5Bc%5D%5Bd%5D=e');

  });

  it('`allowDots` option: stringifies a nested object with dots notation', function (st) {
    expect(stringify({ a: { b: 'c' } }, { allowDots: true })).toBe('a.b=c');
    expect(stringify({ a: { b: { c: { d: 'e' } } } }, { allowDots: true })).toBe('a.b.c.d=e');

  });

  // it('stringifies an array value', function (st) {
  //   expect(
  //     stringify({ a: ['b', 'c', 'd'] }, { arrayFormat: 'indices' }),
  //     'a%5B0%5D=b&a%5B1%5D=c&a%5B2%5D=d',
  //     'indices => indices'
  //   );
  //   expect(
  //     stringify({ a: ['b', 'c', 'd'] }, { arrayFormat: 'brackets' }),
  //     'a%5B%5D=b&a%5B%5D=c&a%5B%5D=d',
  //     'brackets => brackets'
  //   );
  //   expect(
  //     stringify({ a: ['b', 'c', 'd'] }, { arrayFormat: 'comma' }),
  //     'a=b%2Cc%2Cd',
  //     'comma => comma'
  //   );
  //   expect(
  //     stringify({ a: ['b', 'c', 'd'] }, { arrayFormat: 'comma', commaRoundTrip: true }),
  //     'a=b%2Cc%2Cd',
  //     'comma round trip => comma'
  //   );
  //   expect(
  //     stringify({ a: ['b', 'c', 'd'] }),
  //     'a%5B0%5D=b&a%5B1%5D=c&a%5B2%5D=d',
  //     'default => indices'
  //   );

  // });

  // it('`skipNulls` option', function (st) {
  //   expect(
  //     stringify({ a: 'b', c: null }, { skipNulls: true }),
  //     'a=b',
  //     'omits nulls when asked'
  //   );

  //   expect(
  //     stringify({ a: { b: 'c', d: null } }, { skipNulls: true }),
  //     'a%5Bb%5D=c',
  //     'omits nested nulls when asked'
  //   );


  // });

  it('omits array indices when asked', function (st) {
    expect(stringify({ a: ['b', 'c', 'd'] }, { indices: false })).toBe('a=b&a=c&a=d');

  });

  describe('stringifies an array value with one item vs multiple items', function (st) {
    it('non-array item', function (s2t) {
      expect(stringify({ a: 'c' }, { encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a=c');
      expect(stringify({ a: 'c' }, { encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a=c');
      expect(stringify({ a: 'c' }, { encodeValuesOnly: true, arrayFormat: 'comma' })).toBe('a=c');
      expect(stringify({ a: 'c' }, { encodeValuesOnly: true })).toBe('a=c');


    });

    it('array with a single item', function (s2t) {
      expect(stringify({ a: ['c'] }, { encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a[0]=c');
      expect(stringify({ a: ['c'] }, { encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a[]=c');
      expect(stringify({ a: ['c'] }, { encodeValuesOnly: true, arrayFormat: 'comma' })).toBe('a=c');
      expect(stringify({ a: ['c'] }, { encodeValuesOnly: true, arrayFormat: 'comma', commaRoundTrip: true })).toBe('a[]=c'); // so it parses back as an array
      expect(stringify({ a: ['c'] }, { encodeValuesOnly: true })).toBe('a[0]=c');


    });

    it('array with multiple items', function (s2t) {
      expect(stringify({ a: ['c', 'd'] }, { encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a[0]=c&a[1]=d');
      expect(stringify({ a: ['c', 'd'] }, { encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a[]=c&a[]=d');
      expect(stringify({ a: ['c', 'd'] }, { encodeValuesOnly: true, arrayFormat: 'comma' })).toBe('a=c,d');
      expect(stringify({ a: ['c', 'd'] }, { encodeValuesOnly: true, arrayFormat: 'comma', commaRoundTrip: true })).toBe('a=c,d');
      expect(stringify({ a: ['c', 'd'] }, { encodeValuesOnly: true })).toBe('a[0]=c&a[1]=d');


    });

    it('array with multiple items with a comma inside', function (s2t) {
      expect(stringify({ a: ['c,d', 'e'] }, { encodeValuesOnly: true, arrayFormat: 'comma' })).toBe('a=c%2Cd,e');
      expect(stringify({ a: ['c,d', 'e'] }, { arrayFormat: 'comma' })).toBe('a=c%2Cd%2Ce');

      expect(stringify({ a: ['c,d', 'e'] }, { encodeValuesOnly: true, arrayFormat: 'comma', commaRoundTrip: true })).toBe('a=c%2Cd,e');
      expect(stringify({ a: ['c,d', 'e'] }, { arrayFormat: 'comma', commaRoundTrip: true })).toBe('a=c%2Cd%2Ce');


    });


  });

  it('stringifies a nested array value', function (st) {
    expect(stringify({ a: { b: ['c', 'd'] } }, { encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a[b][0]=c&a[b][1]=d');
    expect(stringify({ a: { b: ['c', 'd'] } }, { encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a[b][]=c&a[b][]=d');
    expect(stringify({ a: { b: ['c', 'd'] } }, { encodeValuesOnly: true, arrayFormat: 'comma' })).toBe('a[b]=c,d');
    expect(stringify({ a: { b: ['c', 'd'] } }, { encodeValuesOnly: true })).toBe('a[b][0]=c&a[b][1]=d');

  });

  it('stringifies comma and empty array values', function (st) {
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: false, arrayFormat: 'indices' })).toBe('a[0]=,&a[1]=&a[2]=c,d%');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: false, arrayFormat: 'brackets' })).toBe('a[]=,&a[]=&a[]=c,d%');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: false, arrayFormat: 'comma' })).toBe('a=,,,c,d%');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: false, arrayFormat: 'repeat' })).toBe('a=,&a=&a=c,d%');

    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: true, encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a[0]=%2C&a[1]=&a[2]=c%2Cd%25');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: true, encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a[]=%2C&a[]=&a[]=c%2Cd%25');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: true, encodeValuesOnly: true, arrayFormat: 'comma' })).toBe('a=%2C,,c%2Cd%25');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: true, encodeValuesOnly: true, arrayFormat: 'repeat' })).toBe('a=%2C&a=&a=c%2Cd%25');

    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: true, encodeValuesOnly: false, arrayFormat: 'indices' })).toBe('a%5B0%5D=%2C&a%5B1%5D=&a%5B2%5D=c%2Cd%25');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: true, encodeValuesOnly: false, arrayFormat: 'brackets' })).toBe('a%5B%5D=%2C&a%5B%5D=&a%5B%5D=c%2Cd%25');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: true, encodeValuesOnly: false, arrayFormat: 'comma' })).toBe('a=%2C%2C%2Cc%2Cd%25');
    expect(stringify({ a: [',', '', 'c,d%'] }, { encode: true, encodeValuesOnly: false, arrayFormat: 'repeat' })).toBe('a=%2C&a=&a=c%2Cd%25');


  });

  it('stringifies comma and empty non-array values', function (st) {
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: false, arrayFormat: 'indices' })).toBe('a=,&b=&c=c,d%');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: false, arrayFormat: 'brackets' })).toBe('a=,&b=&c=c,d%');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: false, arrayFormat: 'comma' })).toBe('a=,&b=&c=c,d%');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: false, arrayFormat: 'repeat' })).toBe('a=,&b=&c=c,d%');

    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: true, encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a=%2C&b=&c=c%2Cd%25');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: true, encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a=%2C&b=&c=c%2Cd%25');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: true, encodeValuesOnly: true, arrayFormat: 'comma' })).toBe('a=%2C&b=&c=c%2Cd%25');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: true, encodeValuesOnly: true, arrayFormat: 'repeat' })).toBe('a=%2C&b=&c=c%2Cd%25');

    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: true, encodeValuesOnly: false, arrayFormat: 'indices' })).toBe('a=%2C&b=&c=c%2Cd%25');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: true, encodeValuesOnly: false, arrayFormat: 'brackets' })).toBe('a=%2C&b=&c=c%2Cd%25');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: true, encodeValuesOnly: false, arrayFormat: 'comma' })).toBe('a=%2C&b=&c=c%2Cd%25');
    expect(stringify({ a: ',', b: '', c: 'c,d%' }, { encode: true, encodeValuesOnly: false, arrayFormat: 'repeat' })).toBe('a=%2C&b=&c=c%2Cd%25');


  });

  it('stringifies a nested array value with dots notation', function (st) {
    expect(
      stringify(
        { a: { b: ['c', 'd'] } },
        { allowDots: true, encodeValuesOnly: true, arrayFormat: 'indices' }
      ),
      'indices: stringifies with dots + indices'
    ).toBe(
      'a.b[0]=c&a.b[1]=d'
    );
    expect(
      stringify(
        { a: { b: ['c', 'd'] } },
        { allowDots: true, encodeValuesOnly: true, arrayFormat: 'brackets' }
      ),
      'brackets: stringifies with dots + brackets'
    ).toBe(
      'a.b[]=c&a.b[]=d'
    );
    expect(
      stringify(
        { a: { b: ['c', 'd'] } },
        { allowDots: true, encodeValuesOnly: true, arrayFormat: 'comma' }
      ),
      'comma: stringifies with dots + comma'
    ).toBe(
      'a.b=c,d',
    );
    expect(
      stringify(
        { a: { b: ['c', 'd'] } },
        { allowDots: true, encodeValuesOnly: true }
      ),
      'default: stringifies with dots + indices'
    ).toBe(
      'a.b[0]=c&a.b[1]=d'
    );

  });

  it('stringifies an object inside an array', function (st) {
    expect(
      stringify({ a: [{ b: 'c' }] }, { arrayFormat: 'indices', encodeValuesOnly: true }),
      'indices => indices'
    ).toBe(
      'a[0][b]=c'
    );
    expect(
      stringify({ a: [{ b: 'c' }] }, { arrayFormat: 'repeat', encodeValuesOnly: true }),
      'repeat => repeat'
    ).toBe(
      'a[b]=c',
    );
    expect(
      stringify({ a: [{ b: 'c' }] }, { arrayFormat: 'brackets', encodeValuesOnly: true }),
      'brackets => brackets'
    ).toBe(
      'a[][b]=c',
    );
    expect(
      stringify({ a: [{ b: 'c' }] }, { encodeValuesOnly: true }),
      'default => indices'
    ).toBe(
      'a[0][b]=c',
    );

    expect(
      stringify({ a: [{ b: { c: [1] } }] }, { arrayFormat: 'indices', encodeValuesOnly: true }),
      'indices => indices'
    ).toBe(
      'a[0][b][c][0]=1',
    );
    expect(
      stringify({ a: [{ b: { c: [1] } }] }, { arrayFormat: 'repeat', encodeValuesOnly: true }),
      'repeat => repeat'
    ).toBe(
      'a[b][c]=1',
    );
    expect(
      stringify({ a: [{ b: { c: [1] } }] }, { arrayFormat: 'brackets', encodeValuesOnly: true }),
      'brackets => brackets'
    ).toBe(
      'a[][b][c][]=1',
    );
    expect(
      stringify({ a: [{ b: { c: [1] } }] }, { encodeValuesOnly: true }),
      'default => indices'
    ).toBe(
      'a[0][b][c][0]=1',
    );


  });

  it('stringifies an array with mixed objects and primitives', function (st) {
    expect(
      stringify({ a: [{ b: 1 }, 2, 3] }, { encodeValuesOnly: true, arrayFormat: 'indices' }),
      'indices => indices'
    ).toBe(
      'a[0][b]=1&a[1]=2&a[2]=3',
    );
    expect(
      stringify({ a: [{ b: 1 }, 2, 3] }, { encodeValuesOnly: true, arrayFormat: 'brackets' }),
      'brackets => brackets'
    ).toBe(
      'a[][b]=1&a[]=2&a[]=3',
    );
    expect(
      stringify({ a: [{ b: 1 }, 2, 3] }, { encodeValuesOnly: true, arrayFormat: 'comma' }),
      'brackets => brackets',
    ).toBe(
      'a=%7Bb%3A1%7D,2,3',
    );
    expect(
      stringify({ a: [{ b: 1 }, 2, 3] }, { encodeValuesOnly: true }),
      'default => indices'
    ).toBe(
      'a[0][b]=1&a[1]=2&a[2]=3',
    );
  });

  it('stringifies an object inside an array with dots notation', function (st) {
    expect(
      stringify(
        { a: [{ b: 'c' }] },
        { allowDots: true, encode: false, arrayFormat: 'indices' }
      ),
      'indices => indices'
    ).toBe(
      'a[0].b=c',
    );
    expect(
      stringify(
        { a: [{ b: 'c' }] },
        { allowDots: true, encode: false, arrayFormat: 'brackets' }
      ),
      'brackets => brackets'
    ).toBe(
      'a[].b=c',
    );
    expect(
      stringify(
        { a: [{ b: 'c' }] },
        { allowDots: true, encode: false }
      ),
      'default => indices'
    ).toBe(
      'a[0].b=c',
    );

    expect(
      stringify(
        { a: [{ b: { c: [1] } }] },
        { allowDots: true, encode: false, arrayFormat: 'indices' }
      ),
      'indices => indices'
    ).toBe(
      'a[0].b.c[0]=1',
    );
    expect(
      stringify(
        { a: [{ b: { c: [1] } }] },
        { allowDots: true, encode: false, arrayFormat: 'brackets' }
      ),
      'brackets => brackets'
    ).toBe(
      'a[].b.c[]=1',
    );
    expect(
      stringify(
        { a: [{ b: { c: [1] } }] },
        { allowDots: true, encode: false }
      ),
      'default => indices'
    ).toBe(
      'a[0].b.c[0]=1',
    );


  });

  it('does not omit object keys when indices = false', function (st) {
    expect(stringify({ a: [{ b: 'c' }] }, { indices: false })).toBe('a%5Bb%5D=c');

  });

  it('uses indices notation for arrays when indices=true', function (st) {
    expect(stringify({ a: ['b', 'c'] }, { indices: true })).toBe('a%5B0%5D=b&a%5B1%5D=c');

  });

  it('uses indices notation for arrays when no arrayFormat is specified', function (st) {
    expect(stringify({ a: ['b', 'c'] })).toBe('a%5B0%5D=b&a%5B1%5D=c');

  });

  it('uses indices notation for arrays when arrayFormat=indices', function (st) {
    expect(stringify({ a: ['b', 'c'] }, { arrayFormat: 'indices' })).toBe('a%5B0%5D=b&a%5B1%5D=c');

  });

  it('uses repeat notation for arrays when arrayFormat=repeat', function (st) {
    expect(stringify({ a: ['b', 'c'] }, { arrayFormat: 'repeat' })).toBe('a=b&a=c');

  });

  it('uses brackets notation for arrays when arrayFormat=brackets', function (st) {
    expect(stringify({ a: ['b', 'c'] }, { arrayFormat: 'brackets' })).toBe('a%5B%5D=b&a%5B%5D=c');

  });

  it('stringifies a complicated object', function (st) {
    expect(stringify({ a: { b: 'c', d: 'e' } })).toBe('a%5Bb%5D=c&a%5Bd%5D=e');

  });

  it('stringifies an empty value', function (st) {
    expect(stringify({ a: '' })).toBe('a=');
    expect(stringify({ a: null }, { strictNullHandling: true })).toBe('a');

    expect(stringify({ a: '', b: '' })).toBe('a=&b=');
    expect(stringify({ a: null, b: '' }, { strictNullHandling: true })).toBe('a&b=');

    expect(stringify({ a: { b: '' } })).toBe('a%5Bb%5D=');
    expect(stringify({ a: { b: null } }, { strictNullHandling: true })).toBe('a%5Bb%5D');
    expect(stringify({ a: { b: null } }, { strictNullHandling: false })).toBe('a%5Bb%5D=');

  });

  it('stringifies an empty array in different arrayFormat', function (st) {
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false })).toBe('b[0]=&c=c');
    // arrayFormat default
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'indices' })).toBe('b[0]=&c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'brackets' })).toBe('b[]=&c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'repeat' })).toBe('b=&c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'comma' })).toBe('b=&c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'comma', commaRoundTrip: true })).toBe('b[]=&c=c');
    // with strictNullHandling
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'indices', strictNullHandling: true })).toBe('b[0]&c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'brackets', strictNullHandling: true })).toBe('b[]&c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'repeat', strictNullHandling: true })).toBe('b&c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'comma', strictNullHandling: true })).toBe('b&c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'comma', strictNullHandling: true, commaRoundTrip: true })).toBe('b[]&c=c');
    // with skipNulls
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'indices', skipNulls: true })).toBe('c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'brackets', skipNulls: true })).toBe('c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'repeat', skipNulls: true })).toBe('c=c');
    expect(stringify({ a: [], b: [null], c: 'c' }, { encode: false, arrayFormat: 'comma', skipNulls: true })).toBe('c=c');


  });

  it('stringifies a null object', function (st) {
    var obj = Object.create(null);
    obj.a = 'b';
    expect(stringify(obj)).toBe('a=b');

  });

  it('returns an empty string for invalid input', function (st) {
    expect(stringify(undefined)).toBe('');
    expect(stringify(false)).toBe('');
    expect(stringify(null)).toBe('');
    expect(stringify('')).toBe('');

  });

  it('stringifies an object with a null object as a child', function (st) {
    var obj = { a: Object.create(null) };

    obj.a.b = 'c';
    expect(stringify(obj)).toBe('a%5Bb%5D=c');
  });

  it('drops keys with a value of undefined', function (st) {
    expect(stringify({ a: undefined })).toBe('');

    expect(stringify({ a: { b: undefined, c: null } }, { strictNullHandling: true })).toBe('a%5Bc%5D');
    expect(stringify({ a: { b: undefined, c: null } }, { strictNullHandling: false })).toBe('a%5Bc%5D=');
    expect(stringify({ a: { b: undefined, c: '' } })).toBe('a%5Bc%5D=');

  });

  it('url encodes values', function (st) {
    expect(stringify({ a: 'b c' })).toBe('a=b%20c');

  });

  it('stringifies a date', function (st) {
    var now = new Date();
    var str = 'a=' + encodeURIComponent(now.toISOString());
    expect(stringify({ a: now })).toBe(str);

  });

  it('stringifies the weird object from qs', function (st) {
    expect(stringify({ 'my weird field': '~q1!2"\'w$5&7/z8)?' })).toBe('my%20weird%20field=~q1%212%22%27w%245%267%2Fz8%29%3F');

  });

  it('skips properties that are part of the object prototype', function (st) {
    // @ts-ignore
    Object.prototype.crash = 'test';
    expect(stringify({ a: 'b' })).toBe('a=b');
    expect(stringify({ a: { b: 'c' } })).toBe('a%5Bb%5D=c');
    // @ts-ignore
    delete Object.prototype.crash;

  });

  it('stringifies boolean values', function (st) {
    expect(stringify({ a: true })).toBe('a=true');
    expect(stringify({ a: { b: true } })).toBe('a%5Bb%5D=true');
    expect(stringify({ b: false })).toBe('b=false');
    expect(stringify({ b: { c: false } })).toBe('b%5Bc%5D=false');

  });

  it('stringifies buffer values', function (st) {
    expect(stringify({ a: new TextEncoder().encode('test') })).toBe('a=test');
    expect(stringify({ a: { b: new TextEncoder().encode('test') } })).toBe('a%5Bb%5D=test');

  });

  it('stringifies an object using an alternative delimiter', function (st) {
    expect(stringify({ a: 'b', c: 'd' }, { delimiter: ';' })).toBe('a=b;c=d');

  });

  it('does not blow up when Buffer global is missing', function (st) {
    var tempBuffer = globalThis.Buffer;
    delete globalThis.Buffer;
    var result = stringify({ a: 'b', c: 'd' });
    globalThis.Buffer = tempBuffer;
    expect(result, 'a=b&c=d');

  });

  it('does not crash when parsing circular references', function (st) {
    var a: Record<string, Record<string, any>> = {};
    a.b = a;
    expect(
      () => stringify({ 'foo[bar]': 'baz', 'foo[baz]': a }),
      'cyclic values throw'
    ).toThrowError(
      /RangeError: Cyclic object value/
    )

    var circular: Record<string, string | Record<string, any>> = {
      a: 'value'
    };
    circular.a = circular;
    expect(
      () => stringify(circular),
      'cyclic values throw'
    ).toThrowError(
      /RangeError: Cyclic object value/
    )

    var arr = ['a'];
    expect(
      () => stringify({ x: arr, y: arr }),
      'non-cyclic values do not throw'
    ).not.toThrowError(
      /RangeError: Cyclic object value/
    )


  });

  it('non-circular duplicated references can still work', function (st) {
    var hourOfDay = {
      'function': 'hour_of_day'
    };

    var p1 = {
      'function': 'gte',
      arguments: [hourOfDay, 0]
    };
    var p2 = {
      'function': 'lte',
      arguments: [hourOfDay, 23]
    };

    expect(
      stringify({ filters: { $and: [p1, p2] } }, { encodeValuesOnly: true, arrayFormat: 'indices' }),
      'filters[$and][0][function]=gte&filters[$and][0][arguments][0][function]=hour_of_day&filters[$and][0][arguments][1]=0&filters[$and][1][function]=lte&filters[$and][1][arguments][0][function]=hour_of_day&filters[$and][1][arguments][1]=23'
    );
    expect(
      stringify({ filters: { $and: [p1, p2] } }, { encodeValuesOnly: true, arrayFormat: 'brackets' }),
      'filters[$and][][function]=gte&filters[$and][][arguments][][function]=hour_of_day&filters[$and][][arguments][]=0&filters[$and][][function]=lte&filters[$and][][arguments][][function]=hour_of_day&filters[$and][][arguments][]=23'
    );
    expect(
      stringify({ filters: { $and: [p1, p2] } }, { encodeValuesOnly: true, arrayFormat: 'repeat' }),
      'filters[$and][function]=gte&filters[$and][arguments][function]=hour_of_day&filters[$and][arguments]=0&filters[$and][function]=lte&filters[$and][arguments][function]=hour_of_day&filters[$and][arguments]=23'
    );


  });

  it('selects properties when filter=array', function (st) {
    expect(stringify({ a: 'b' }, { filter: ['a'] })).toBe('a=b');
    expect(stringify({ a: 1 }, { filter: [] })).toBe('');

    expect(
      stringify(
        { a: { b: [1, 2, 3, 4], c: 'd' }, c: 'f' },
        { filter: ['a', 'b', 0, 2], arrayFormat: 'indices' }
      ),
      'indices => indices'
    ).toBe(
      'a%5Bb%5D%5B0%5D=1&a%5Bb%5D%5B2%5D=3',
    );
    expect(
      stringify(
        { a: { b: [1, 2, 3, 4], c: 'd' }, c: 'f' },
        { filter: ['a', 'b', 0, 2], arrayFormat: 'brackets' }
      ),
      'brackets => brackets'
    ).toBe(
      'a%5Bb%5D%5B%5D=1&a%5Bb%5D%5B%5D=3',
    );
    expect(
      stringify(
        { a: { b: [1, 2, 3, 4], c: 'd' }, c: 'f' },
        { filter: ['a', 'b', 0, 2] }
      ),
      'default => indices'
    ).toBe(
      'a%5Bb%5D%5B0%5D=1&a%5Bb%5D%5B2%5D=3',
    );


  });

  it('supports custom representations when filter=function', function (st) {
    var calls = 0;
    var obj = { a: 'b', c: 'd', e: { f: new Date(1257894000000) } };
    var filterFunc = function (prefix, value) {
      calls += 1;
      if (calls === 1) {
        expect(prefix, 'prefix is empty').toBe('',);
        expect(value).toEqual(obj);
      } else if (prefix === 'c') {
        return void 0;
      } else if (value instanceof Date) {
        expect(prefix).toBe('e[f]');
        return value.getTime();
      }
      return value;
    };

    expect(stringify(obj, { filter: filterFunc })).toBe('a=b&e%5Bf%5D=1257894000000');
    expect(calls).toBe(5);

  });

  it('can disable uri encoding', function (st) {
    expect(stringify({ a: 'b' }, { encode: false })).toBe('a=b');
    expect(stringify({ a: { b: 'c' } }, { encode: false })).toBe('a[b]=c');
    expect(stringify({ a: 'b', c: null }, { strictNullHandling: true, encode: false })).toBe('a=b&c');

  });

  it('can sort the keys', function (st) {
    var sort = function (a, b) {
      return a.localeCompare(b);
    };
    expect(stringify({ a: 'c', z: 'y', b: 'f' }, { sort: sort })).toBe('a=c&b=f&z=y');
    expect(stringify({ a: 'c', z: { j: 'a', i: 'b' }, b: 'f' }, { sort: sort })).toBe('a=c&b=f&z%5Bi%5D=b&z%5Bj%5D=a');

  });

  it('can sort the keys at depth 3 or more too', function (st) {
    var sort = function (a, b) {
      return a.localeCompare(b);
    };
    expect(
      stringify(
        { a: 'a', z: { zj: { zjb: 'zjb', zja: 'zja' }, zi: { zib: 'zib', zia: 'zia' } }, b: 'b' },
        { sort: sort, encode: false }
      ),
    ).toBe(
      'a=a&b=b&z[zi][zia]=zia&z[zi][zib]=zib&z[zj][zja]=zja&z[zj][zjb]=zjb'
    );
    expect(
      stringify(
        { a: 'a', z: { zj: { zjb: 'zjb', zja: 'zja' }, zi: { zib: 'zib', zia: 'zia' } }, b: 'b' },
        { sort: null, encode: false }
      ),
    ).toBe(
      'a=a&z[zj][zjb]=zjb&z[zj][zja]=zja&z[zi][zib]=zib&z[zi][zia]=zia&b=b'
    );

  });

  it('can stringify with custom encoding', function (st) {
    expect(stringify({ 県: '大阪府', '': '' }, {
      encoder: function (str) {
        if (str.length === 0) {
          return '';
        }
        var buf = iconv.encode(str, 'shiftjis');
        var result = [];
        for (var i = 0; i < buf.length; ++i) {
          result.push(buf.readUInt8(i).toString(16));
        }
        return '%' + result.join('%');
      }
    })).toBe('%8c%a7=%91%e5%8d%e3%95%7b&=');

  });

  it('throws error with wrong encoder', function (st) {
    st['throws'](function () {
      // @ts-expect-error
      stringify({}, { encoder: 'string' });
    }, new TypeError('Encoder has to be a function.'));

  });

  it('can use custom encoder for a buffer object', function (st) {
    expect(stringify({ a: Uint8Array.from([1]) }, {
      encoder: function (buffer) {
        if (typeof buffer === 'string') {
          return buffer;
        }
        return String.fromCharCode(buffer.readUInt8(0) + 97);
      }
    })).toBe('a=b');

    expect(stringify({ a: new TextEncoder().encode('a b') }, {
      encoder: function (buffer) {
        return buffer;
      }
    })).toBe('a=a b');

  });

  it('serializeDate option', function (st) {
    var date = new Date();
    expect(
      stringify({ a: date }),
      'default is toISOString'
    ).toBe(
      'a=' + date.toISOString().replace(/:/g, '%3A'),
    );

    var mutatedDate = new Date();
    mutatedDate.toISOString = function () {
      throw new SyntaxError();
    };
    st['throws'](function () {
      mutatedDate.toISOString();
    }, SyntaxError);
    expect(
      stringify({ a: mutatedDate }),
      'toISOString works even when method is not locally present'
    ).toBe(
      'a=' + Date.prototype.toISOString.call(mutatedDate).replace(/:/g, '%3A'),
    );

    var specificDate = new Date(6);
    expect(
      stringify(
        { a: specificDate },
        { serializeDate: function (d) { return d.getTime() * 7; } }
      ),
      'custom serializeDate function called'
    ).toBe(
      'a=42',
    );

    expect(
      stringify(
        { a: [date] },
        {
          serializeDate: function (d) { return d.getTime(); },
          arrayFormat: 'comma'
        }
      ),
      'works with arrayFormat comma'
    ).toBe(
      'a=' + date.getTime(),
    );
    expect(
      stringify(
        { a: [date] },
        {
          serializeDate: function (d) { return d.getTime(); },
          arrayFormat: 'comma',
          commaRoundTrip: true
        }
      ),
      'works with arrayFormat comma'
    ).toBe(
      'a%5B%5D=' + date.getTime(),
    );


  });

  it('RFC 1738 serialization', function (st) {
    expect(stringify({ a: 'b c' }, { format: formats.RFC1738 })).toBe('a=b+c');
    expect(stringify({ 'a b': 'c d' }, { format: formats.RFC1738 })).toBe('a+b=c+d');
    expect(stringify({ 'a b': new TextEncoder().encode('a b') }, { format: formats.RFC1738 })).toBe('a+b=a+b');

    expect(stringify({ 'foo(ref)': 'bar' }, { format: formats.RFC1738 })).toBe('foo(ref)=bar');


  });

  it('RFC 3986 spaces serialization', function (st) {
    expect(stringify({ a: 'b c' }, { format: formats.RFC3986 })).toBe('a=b%20c');
    expect(stringify({ 'a b': 'c d' }, { format: formats.RFC3986 })).toBe('a%20b=c%20d');
    expect(stringify({ 'a b': new TextEncoder().encode('a b') }, { format: formats.RFC3986 })).toBe('a%20b=a%20b');


  });

  it('Backward compatibility to RFC 3986', function (st) {
    expect(stringify({ a: 'b c' })).toBe('a=b%20c');
    expect(stringify({ 'a b': new TextEncoder().encode('a b') })).toBe('a%20b=a%20b');


  });

  it('Edge cases and unknown formats', function (st) {
    ['UFO1234', false, 1234, null, {}, []].forEach(function (format) {
      // @ts-expect-error
      expect(() => stringify({ a: 'b c' }, { format: format }))
        .toThrowError(new TypeError('Unknown format option provided.'))
    });

  });

  it('encodeValuesOnly', function (st) {
    expect(
      stringify(
        { a: 'b', c: ['d', 'e=f'], f: [['g'], ['h']] },
        { encodeValuesOnly: true, arrayFormat: 'indices' }
      ),
      'encodeValuesOnly + indices'
    ).toBe(
      'a=b&c[0]=d&c[1]=e%3Df&f[0][0]=g&f[1][0]=h',
    );
    expect(
      stringify(
        { a: 'b', c: ['d', 'e=f'], f: [['g'], ['h']] },
        { encodeValuesOnly: true, arrayFormat: 'brackets' }
      ),
      'encodeValuesOnly + brackets'
    ).toBe(
      'a=b&c[]=d&c[]=e%3Df&f[][]=g&f[][]=h',
    );
    expect(
      stringify(
        { a: 'b', c: ['d', 'e=f'], f: [['g'], ['h']] },
        { encodeValuesOnly: true, arrayFormat: 'repeat' }
      ),
      'encodeValuesOnly + repeat'
    ).toBe(
      'a=b&c=d&c=e%3Df&f=g&f=h',
    );

    expect(
      stringify(
        { a: 'b', c: ['d', 'e'], f: [['g'], ['h']] },
        { arrayFormat: 'indices' }
      ),
      'no encodeValuesOnly + indices'
    ).toBe(
      'a=b&c%5B0%5D=d&c%5B1%5D=e&f%5B0%5D%5B0%5D=g&f%5B1%5D%5B0%5D=h',
    );
    expect(
      stringify(
        { a: 'b', c: ['d', 'e'], f: [['g'], ['h']] },
        { arrayFormat: 'brackets' }
      ),
      'no encodeValuesOnly + brackets'
    ).toBe(
      'a=b&c%5B%5D=d&c%5B%5D=e&f%5B%5D%5B%5D=g&f%5B%5D%5B%5D=h',
    );
    expect(
      stringify(
        { a: 'b', c: ['d', 'e'], f: [['g'], ['h']] },
        { arrayFormat: 'repeat' }
      ),
      'no encodeValuesOnly + repeat'
    ).toBe(
      'a=b&c=d&c=e&f=g&f=h',
    );


  });

  it('encodeValuesOnly - strictNullHandling', function (st) {
    expect(
      stringify(
        { a: { b: null } },
        { encodeValuesOnly: true, strictNullHandling: true }
      ),
    ).toBe(
      'a[b]'
    );

  });

  it('throws if an invalid charset is specified', function (st) {
    expect(() =>
      // @ts-expect-error
      stringify({ a: 'b' }, { charset: 'foobar' })
    ).toThrowError(new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined'))

  });

  it('respects a charset of iso-8859-1', function (st) {
    expect(stringify({ æ: 'æ' }, { charset: 'iso-8859-1' })).toBe('%E6=%E6');

  });

  it('encodes unrepresentable chars as numeric entities in iso-8859-1 mode', function (st) {
    expect(stringify({ a: '☺' }, { charset: 'iso-8859-1' })).toBe('a=%26%239786%3B');

  });

  it('respects an explicit charset of utf-8 (the default)', function (st) {
    expect(stringify({ a: 'æ' }, { charset: 'utf-8' })).toBe('a=%C3%A6');

  });

  it('`charsetSentinel` option', function (st) {
    expect(
      stringify({ a: 'æ' }, { charsetSentinel: true, charset: 'utf-8' }),
      'adds the right sentinel when instructed to and the charset is utf-8'
    ).toBe(
      'utf8=%E2%9C%93&a=%C3%A6',
    );

    expect(
      stringify({ a: 'æ' }, { charsetSentinel: true, charset: 'iso-8859-1' }),
      'adds the right sentinel when instructed to and the charset is iso-8859-1'
    ).toBe(
      'utf8=%26%2310003%3B&a=%E6',
    );


  });

  it('does not mutate the options argument', function (st) {
    var options = {};
    stringify({}, options);
    expect(options).toEqual({})
  });

  it('strictNullHandling works with custom filter', function (st) {
    var filter = function (prefix, value) {
      return value;
    };

    var options = { strictNullHandling: true, filter: filter };
    expect(stringify({ key: null }, options)).toBe('key');

  });

  it('strictNullHandling works with null serializeDate', function (st) {
    var serializeDate = function () {
      return null;
    };
    var options = { strictNullHandling: true, serializeDate: serializeDate };
    var date = new Date();
    expect(stringify({ key: date }, options)).toBe('key');

  });

  it('allows for encoding keys and values differently', function (st) {
    var encoder = function (str, charset, format, type) {
      if (type === 'key') {
        return encode(str, charset, format, type).toLowerCase();
      }
      if (type === 'value') {
        return encode(str, charset, format, type).toUpperCase();
      }

      throw 'this should never happen! type: ' + type;
    };

    expect(stringify({ KeY: 'vAlUe' }, { encoder: encoder })).toEqual('key=VALUE');

  });

  it('objects inside arrays', function (st) {
    var obj = { a: { b: { c: 'd', e: 'f' } } };
    var withArray = { a: { b: [{ c: 'd', e: 'f' }] } };

    expect(stringify(obj, { encode: false }), 'no array, no arrayFormat').toBe('a[b][c]=d&a[b][e]=f');
    expect(stringify(obj, { encode: false, arrayFormat: 'brackets' }), 'no array, bracket').toBe('a[b][c]=d&a[b][e]=f');
    expect(stringify(obj, { encode: false, arrayFormat: 'indices' }), 'no array, indices').toBe('a[b][c]=d&a[b][e]=f');
    expect(stringify(obj, { encode: false, arrayFormat: 'repeat' }), 'no array, repeat').toBe('a[b][c]=d&a[b][e]=f');
    expect(stringify(obj, { encode: false, arrayFormat: 'comma' }), 'no array, comma').toBe('a[b][c]=d&a[b][e]=f');

    expect(stringify(withArray, { encode: false }), 'array, no arrayFormat').toBe('a[b][0][c]=d&a[b][0][e]=f');
    expect(stringify(withArray, { encode: false, arrayFormat: 'brackets' }), 'array, bracket').toBe('a[b][][c]=d&a[b][][e]=f');
    expect(stringify(withArray, { encode: false, arrayFormat: 'indices' }), 'array, indices').toBe('a[b][0][c]=d&a[b][0][e]=f');
    expect(stringify(withArray, { encode: false, arrayFormat: 'repeat' }), 'array, repeat').toBe('a[b][c]=d&a[b][e]=f');
    expect(
      stringify(withArray, { encode: false, arrayFormat: 'comma' }),
      'array, comma',
    ).toBe(
      '???',
    );


  });

  it('stringifies sparse arrays', function (st) {
    /* eslint no-sparse-arrays: 0 */
    expect(stringify({ a: [, '2', , , '1'] }, { encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a[1]=2&a[4]=1');
    expect(stringify({ a: [, '2', , , '1'] }, { encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a[]=2&a[]=1');
    expect(stringify({ a: [, '2', , , '1'] }, { encodeValuesOnly: true, arrayFormat: 'repeat' })).toBe('a=2&a=1');

    expect(stringify({ a: [, { b: [, , { c: '1' }] }] }, { encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a[1][b][2][c]=1');
    expect(stringify({ a: [, { b: [, , { c: '1' }] }] }, { encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a[][b][][c]=1');
    expect(stringify({ a: [, { b: [, , { c: '1' }] }] }, { encodeValuesOnly: true, arrayFormat: 'repeat' })).toBe('a[b][c]=1');

    expect(stringify({ a: [, [, , [, , , { c: '1' }]]] }, { encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a[1][2][3][c]=1');
    expect(stringify({ a: [, [, , [, , , { c: '1' }]]] }, { encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a[][][][c]=1');
    expect(stringify({ a: [, [, , [, , , { c: '1' }]]] }, { encodeValuesOnly: true, arrayFormat: 'repeat' })).toBe('a[c]=1');

    expect(stringify({ a: [, [, , [, , , { c: [, '1'] }]]] }, { encodeValuesOnly: true, arrayFormat: 'indices' })).toBe('a[1][2][3][c][1]=1');
    expect(stringify({ a: [, [, , [, , , { c: [, '1'] }]]] }, { encodeValuesOnly: true, arrayFormat: 'brackets' })).toBe('a[][][][c][]=1');
    expect(stringify({ a: [, [, , [, , , { c: [, '1'] }]]] }, { encodeValuesOnly: true, arrayFormat: 'repeat' })).toBe('a[c]=1');


  });
});

describe('stringifies empty keys', function (t) {
  it.each(emptyTestCases)('stringifies an object with empty string key with $input', function (testCase) {
    expect(
      stringify(testCase.withEmptyKeys, { encode: false, arrayFormat: 'indices' }),
      'test case: ' + testCase.input + ', indices'
    ).toBe(
      testCase.stringifyOutput.indices,
    );
    expect(
      stringify(testCase.withEmptyKeys, { encode: false, arrayFormat: 'brackets' }),
      'test case: ' + testCase.input + ', brackets'
    ).toBe(
      testCase.stringifyOutput.brackets,
    );
    expect(
      stringify(testCase.withEmptyKeys, { encode: false, arrayFormat: 'repeat' }),
      'test case: ' + testCase.input + ', repeat'
    ).toBe(
      testCase.stringifyOutput.repeat,
    );

  })

  it('edge case with object/arrays', function (st) {
    expect(stringify({ '': { '': [2, 3] } }, { encode: false })).toBe('[][0]=2&[][1]=3');
    expect(stringify({ '': { '': [2, 3], a: 2 } }, { encode: false })).toBe('[][0]=2&[][1]=3&[a]=2');
    expect(stringify({ '': { '': [2, 3] } }, { encode: false, arrayFormat: 'indices' })).toBe('[][0]=2&[][1]=3');
    expect(stringify({ '': { '': [2, 3], a: 2 } }, { encode: false, arrayFormat: 'indices' })).toBe('[][0]=2&[][1]=3&[a]=2');


  });
});