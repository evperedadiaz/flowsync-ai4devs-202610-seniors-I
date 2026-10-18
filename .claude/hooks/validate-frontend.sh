#!/usr/bin/env bash
# Hook PostToolUse (Edit|Write|MultiEdit): valida lint, tests y build del frontend
# cuando se edita un fichero dentro de frontend/. Sale con código 2 si algo falla,
# para que Claude vea el error y lo corrija.

input="$(cat)"
file="$(printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).tool_input?.file_path??"")}catch{console.log("")}})')"

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
case "$file" in
  "$root"/frontend/*) ;;
  *) exit 0 ;;
esac
case "$file" in
  */node_modules/*|*/package-lock.json) exit 0 ;;
esac

cd "$root/frontend" || exit 0

fail() {
  echo "❌ Validación del frontend fallida en: $1" >&2
  printf '%s\n' "$2" | tail -n 40 >&2
  exit 2
}

out="$(npm run --silent lint 2>&1)" || fail "lint" "$out"

if node -e 'process.exit(require("./package.json").scripts?.test ? 0 : 1)'; then
  out="$(npm test --silent 2>&1)" || fail "tests" "$out"
fi

out="$(npm run --silent build 2>&1)" || fail "build" "$out"

exit 0
