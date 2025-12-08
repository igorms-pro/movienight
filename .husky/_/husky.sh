#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug() {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) $1"
  }
  readonly husky_skip_init=1
  export husky_skip_init
  debug "current working directory is $(pwd)"
  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi
  export PATH="$PATH"
fi
