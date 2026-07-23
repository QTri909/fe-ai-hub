#!/usr/bin/env python3
"""
Cleanup script to remove duplicate Edit Modal JSX blocks from RequirementsPage.tsx.
"""
import re

FILE_PATH = "fe-ai-hub/src/pages/requirements/RequirementsPage.tsx"

with open(FILE_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Find all Edit Modal JSX blocks
# Each block starts with optional comment + {editModal.visible && ( and ends with )}
# We need to match the full block including the closing )}

# Strategy: find all positions of "editModal.visible && (" and then find the matching closing ")}"
# We'll use a simple approach: find all blocks between {editModal.visible && ( and the next )}\n\n

# Pattern: match from {editModal.visible && ( to the closing )} followed by newline
# The block contains nested parentheses, so we need to be careful
# Let's match from the comment or the {editModal.visible to the closing )}

# Find all occurrences of the edit modal block
# Each block is:
#   {/* Edit Modal */}
#   {editModal.visible && (
#     <div ...>
#       ... content ...
#     </div>
#   )}
#
# Or without comment:
#   {editModal.visible && (
#     <div ...>
#       ... content ...
#     </div>
#   )}

# Let's find all blocks by looking for the pattern
# We'll split on the editModal.visible marker and reconstruct

# Find all positions where editModal.visible appears
positions = []
for match in re.finditer(r'editModal\.visible', content):
    positions.append(match.start())

print(f"Found {len(positions)} occurrences of editModal.visible")

if len(positions) > 1:
    # We need to find the end of each block
    # Each block ends with )}\n\n (or )}\n)
    # Let's find the block boundaries
    
    blocks = []
    for i, pos in enumerate(positions):
        # Find the start of the block (include the comment if present)
        # Look backwards for {/* Edit Modal */}
        block_start = pos
        # Check if there's a comment before this position
        before = content[:pos]
        comment_match = re.search(r'\{/\* Edit Modal \*/\}\n\s*$', before)
        if comment_match:
            block_start = comment_match.start()
        
        # Find the end of the block: )}\n\n or )}\n
        # The block ends with )}\n\n (closing the JSX expression)
        after = content[pos:]
        # Find the closing )} - it should be at the same indentation level
        # Look for )}\n\n or )}\n followed by something that's not part of the block
        end_match = re.search(r'\n            \}\)\n\n', after)
        if end_match:
            block_end = pos + end_match.end()
        else:
            # Try without the double newline
            end_match = re.search(r'\n            \}\)\n', after)
            if end_match:
                block_end = pos + end_match.end()
            else:
                # Try to find any )} at the end
                end_match = re.search(r'\}\)\s*$', after)
                if end_match:
                    block_end = pos + end_match.end()
                else:
                    block_end = pos + len(after)
        
        blocks.append((block_start, block_end))
    
    print(f"Found {len(blocks)} blocks")
    
    # Remove all but the first block
    for block_start, block_end in reversed(blocks[1:]):
        content = content[:block_start] + content[block_end:]
        print(f"Removed block from {block_start} to {block_end}")

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Cleanup complete!")
