#!/usr/bin/env bash
#
# scaffold.sh
#
# Copies the io-service-base template into a target folder, applies token
# substitution, and prunes optional artifacts (masterdata, events, the
# unused auth variant) based on the supplied config.
#
# Requirements: bash 4+, jq
#
# Usage:
#   bash scaffold.sh --config /path/to/config.json
#
# Expected JSON config (all fields required unless noted):
#   {
#     "TargetDir": "/absolute/path/to/new-app",
#     "Force": false,
#     "Tokens": {
#       "APP_VENDOR": "obramax",
#       "APP_NAME": "io-something-service",
#       "APP_TITLE": "Something Service",
#       "APP_DESCRIPTION": "Does something useful",
#       "APP_VERSION": "0.1.0",
#       "NODE_BUILDER_VERSION": "6.x",
#       "DOCS_BUILDER_VERSION": "0.x"
#     },
#     "UsesMasterdata": true,
#     "UsesEvents": true,
#     "AuthPattern": "tokenAuth | sessionAuth | none",
#     "RunYarnInstall": false,
#     "InitGit": false,
#     "InitialBranch": "develop"
#   }

set -euo pipefail

info()  { printf '\033[36m[scaffold] %s\033[0m\n' "$1"; }
warn()  { printf '\033[33m[scaffold] %s\033[0m\n' "$1"; }
ok()    { printf '\033[32m[scaffold] %s\033[0m\n' "$1"; }
die()   { printf '\033[31m[scaffold] ERROR: %s\033[0m\n' "$1" >&2; exit 1; }

CONFIG_PATH=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --config) CONFIG_PATH="$2"; shift 2 ;;
    *) die "Unknown argument: $1" ;;
  esac
done

[[ -z "$CONFIG_PATH" ]] && die "--config is required"
[[ ! -f "$CONFIG_PATH" ]] && die "Config file not found: $CONFIG_PATH"

command -v jq >/dev/null 2>&1 || die "jq is required but not installed. Run: sudo pacman -S jq"

# ── Resolve paths ────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE_ROOT="$PLUGIN_ROOT/templates/io-service-base"

[[ ! -d "$TEMPLATE_ROOT" ]] && die "Template folder not found: $TEMPLATE_ROOT"

# ── Read config ──────────────────────────────────────────────────────────────

TARGET_DIR="$(jq -r '.TargetDir // empty' "$CONFIG_PATH")"
FORCE="$(jq -r '.Force // false' "$CONFIG_PATH")"
USES_MASTERDATA="$(jq -r '.UsesMasterdata // false' "$CONFIG_PATH")"
USES_EVENTS="$(jq -r '.UsesEvents // false' "$CONFIG_PATH")"
AUTH_PATTERN="$(jq -r '.AuthPattern // "none"' "$CONFIG_PATH")"
RUN_YARN_INSTALL="$(jq -r '.RunYarnInstall // false' "$CONFIG_PATH")"
INIT_GIT="$(jq -r '.InitGit // false' "$CONFIG_PATH")"
INITIAL_BRANCH="$(jq -r '.InitialBranch // "develop"' "$CONFIG_PATH")"

[[ -z "$TARGET_DIR" ]] && die "Config is missing required field: TargetDir"
jq -e '.Tokens' "$CONFIG_PATH" >/dev/null 2>&1 || die "Config is missing required field: Tokens"

# ── Guard existing target ────────────────────────────────────────────────────

if [[ -d "$TARGET_DIR" ]]; then
  NON_GIT_COUNT=$(find "$TARGET_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' | wc -l)
  if [[ "$NON_GIT_COUNT" -gt 0 && "$FORCE" != "true" ]]; then
    die "Target directory '$TARGET_DIR' is not empty. Set \"Force\": true to overwrite."
  fi
else
  mkdir -p "$TARGET_DIR"
fi

# ── Copy template ────────────────────────────────────────────────────────────

info "Copying template contents into $TARGET_DIR"
cp -r "$TEMPLATE_ROOT"/. "$TARGET_DIR/"

# ── Prune conditional artifacts ───────────────────────────────────────────────

if [[ "$USES_MASTERDATA" != "true" ]]; then
  info "Pruning Master Data artifacts (models/, mdSchema.ts)"
  rm -rf "$TARGET_DIR/node/models"
  rm -f  "$TARGET_DIR/node/mdSchema.ts"
fi

if [[ "$USES_EVENTS" != "true" ]]; then
  info "Pruning events/ folder"
  rm -rf "$TARGET_DIR/node/events"
fi

case "$AUTH_PATTERN" in
  tokenAuth)
    info "Keeping tokenAuth middleware, removing sessionAuth"
    rm -f "$TARGET_DIR/node/middlewares/auth/sessionAuth.ts"
    ;;
  sessionAuth)
    info "Keeping sessionAuth middleware, removing tokenAuth"
    rm -f "$TARGET_DIR/node/middlewares/auth/tokenAuth.ts"
    ;;
  none)
    info "Removing auth/ folder (no auth pattern selected)"
    rm -rf "$TARGET_DIR/node/middlewares/auth"
    ;;
  *)
    die "Unknown AuthPattern: $AUTH_PATTERN"
    ;;
esac

# ── Token substitution ────────────────────────────────────────────────────────

TEXT_EXTENSIONS=("ts" "tsx" "js" "json" "md" "yml" "yaml" "prettierrc" "npmrc" "vtexignore" "gitignore" "releaserc.json")
DOT_NAMES=(".eslintrc.js" ".eslintignore" ".prettierrc" ".npmrc" ".vtexignore" ".gitignore" ".releaserc.json")

is_text_file() {
  local filepath="$1"
  local filename
  filename="$(basename "$filepath")"
  local ext="${filename##*.}"

  for dn in "${DOT_NAMES[@]}"; do
    [[ "$filename" == "$dn" ]] && return 0
  done
  for e in "${TEXT_EXTENSIONS[@]}"; do
    [[ "$ext" == "$e" ]] && return 0
  done
  return 1
}

info "Building token map from config"
declare -A TOKENS
while IFS="=" read -r key value; do
  TOKENS["{{$key}}"]="$value"
done < <(jq -r '.Tokens | to_entries[] | "\(.key)=\(.value)"' "$CONFIG_PATH")

info "Applying token substitution"
while IFS= read -r -d '' filepath; do
  if is_text_file "$filepath"; then
    content="$(cat "$filepath")"
    replaced="$content"
    for token in "${!TOKENS[@]}"; do
      replaced="${replaced//"$token"/${TOKENS[$token]}}"
    done
    if [[ "$replaced" != "$content" ]]; then
      printf '%s' "$replaced" > "$filepath"
    fi
  fi
done < <(find "$TARGET_DIR" -type f -print0)

# ── Optional post-actions ─────────────────────────────────────────────────────

if [[ "$RUN_YARN_INSTALL" == "true" ]]; then
  NODE_DIR="$TARGET_DIR/node"
  info "Running 'yarn install' in $NODE_DIR"
  (cd "$NODE_DIR" && yarn install) || warn "yarn install exited with a non-zero code"
fi

if [[ "$INIT_GIT" == "true" ]]; then
  info "Initialising git repository on branch '$INITIAL_BRANCH'"
  (
    cd "$TARGET_DIR"
    git init -b "$INITIAL_BRANCH"
    git add -A
    git commit -m "chore: initial scaffold via /create-vtex-io-service"
  ) || warn "Git initialisation failed"
fi

ok "Done. Service scaffolded at $TARGET_DIR"
