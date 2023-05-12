curl -fsSL https://deno.land/x/install/install.sh | sh

export DENO_INSTALL="/home/gitpod/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

deno run -A --watch packages/edge/mod.ts

deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts

deployctl deploy --project=bundlejs --exclude=node_modules --import-map=packages/edge/import_map.json packages/edge/mod.ts

