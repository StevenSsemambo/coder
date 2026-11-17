#!/usr/bin/env bash
# Rebuilds picoc.wasm from ./src. Needs clang with the wasm32 target and wasm-ld, plus the WASI sysroot:
#   curl -L -o sysroot.tgz https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-25/wasi-sysroot-25.0.tar.gz
#   tar xzf sysroot.tgz        # then:  WASI_SYSROOT=$PWD/wasi-sysroot-25.0 ./build.sh
# The result is committed as picoc.wasm; scripts/prepare-runtimes.mjs copies it to public/vendor/.
set -euo pipefail
cd "$(dirname "$0")/src"
: "${WASI_SYSROOT:?set WASI_SYSROOT to the unpacked wasi-sysroot folder}"
SRCS="picoc.c table.c lex.c parse.c expression.c heap.c type.c variable.c clibrary.c platform.c include.c debug.c \
platform/platform_unix.c platform/library_unix.c cstdlib/stdio.c cstdlib/math.c cstdlib/string.c cstdlib/stdlib.c \
cstdlib/time.c cstdlib/errno.c cstdlib/ctype.c cstdlib/stdbool.c"
clang --target=wasm32-wasi --sysroot="$WASI_SYSROOT" -Os -DUNIX_HOST -DVER='"1"' -DTAG='"1"' -std=gnu11 -w \
  -nodefaultlibs -Wl,--allow-undefined -Wl,--max-memory=134217728 $SRCS -lc -lm -o ../picoc.wasm
ls -l ../picoc.wasm
