import os

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to render `<EvolutionFeed feed={feed} />` when `activeTab === "evolutions"`
# In PatientEvolution, there's a `<div className="space-y-4">` that maps `filteredEvolutions`.
# Let's find: `<AnimatePresence>` below the form, which wraps the list of evolutions.

search_str = """          {!isFormOpen && !isExpressMode && (
            <div className="space-y-4 mt-6">"""

replace_str = """          {!isFormOpen && !isExpressMode && activeTab === "evolutions" && (
            <div className="mt-6">
              <EvolutionFeed feed={feed} />
            </div>
          )}
          
          {!isFormOpen && !isExpressMode && activeTab !== "evolutions" && (
            <div className="space-y-4 mt-6">"""

if search_str in content:
    content = content.replace(search_str, replace_str)
else:
    # If not found, let's try a more robust search.
    # The file has `<div id="timeline-content" className="scroll-mt-24">`
    # Let's put the Feed right after the timeline-content div.
    search_2 = '<div id="timeline-content" className="scroll-mt-24">'
    replace_2 = '<div id="timeline-content" className="scroll-mt-24">\n        {activeTab === "evolutions" && !isFormOpen && <EvolutionFeed feed={feed} />}\n'
    if search_2 in content:
        content = content.replace(search_2, replace_2)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Feed rendering.")
