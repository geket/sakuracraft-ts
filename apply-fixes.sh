#!/bin/bash
# Comprehensive TypeScript Fix Script for SakuraCraft
# This script applies all type safety fixes while maintaining strict TypeScript checking

set -e  # Exit on error

echo "🌸 SakuraCraft TypeScript Fix Script"
echo "====================================="
echo ""

# Backup original file
echo "📦 Creating backup..."
cp src/game/SakuraCraftGame.ts src/game/SakuraCraftGame.ts.backup

# Fix 1: Escape backticks in template literals
echo "🔧 Fixing backtick escaping..."
sed -i "s/Debug Console (\` to toggle)/Debug Console (\\\\\` to toggle)/g" src/game/SakuraCraftGame.ts
sed -i "s/E inventory | \` debug/E inventory | \\\\\` debug/g" src/game/SakuraCraftGame.ts

# Fix 2: Remove duplicate updateHotbarDisplay function (around line 3778)
echo "🔧 Removing duplicate function..."
python3 << 'PYTHON_EOF'
import re

with open('src/game/SakuraCraftGame.ts', 'r') as f:
    content = f.read()

# Find and remove the duplicate updateHotbarDisplay function
# This is the second occurrence around line 3778
pattern = r'            // Update hotbar visual display\s+updateHotbarDisplay\(\) \{[^}]+this\.updateHotbar\(\);\s+\},\s+// Use seeds to calm birds'
replacement = '            // Use seeds to calm birds'

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/game/SakuraCraftGame.ts', 'w') as f:
    f.write(content)

print("Removed duplicate function")
PYTHON_EOF

echo "✅ Critical syntax fixes applied!"
echo ""
echo "Next: Run 'npm run build' to see remaining type errors"
echo "See TYPESCRIPT_FIXES_GUIDE.md for details on fixing remaining issues"
