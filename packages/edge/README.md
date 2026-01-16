curl -fsSL https://deno.land/x/install/install.sh | sh

export DENO_INSTALL="/home/gitpod/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

deno serve -A --env-file=.env --watch packages/edge/mod.ts

deno install --global -Arf jsr:@deno/deployctl

deployctl deploy --project=bundlejs --exclude=node_modules --config=packages/edge/deno.jsonc packages/edge/mod.ts

