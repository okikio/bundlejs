deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts

deployctl deploy --project=bundlejs --exclude=node_modules --import-map=packages/edge/import_map.json --token=... packages/edge/deno.ts

