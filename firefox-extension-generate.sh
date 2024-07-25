#!/bin/bash
CURRENT_DIR=$(pwd)
EXT_DIR=$(dirname "$0")
cd "$EXT_DIR"

zip -r -FS "$CURRENT_DIR/shortcut-manager.zip" * --exclude '*.git*' 'Thumbs.db' '*.DS_Store' 'other/*' 'firefox-extension-generate.sh'
mv "$CURRENT_DIR/shortcut-manager.zip" "$CURRENT_DIR/shortcut-manager.xpi"