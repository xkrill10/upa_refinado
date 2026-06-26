import os

file_path = "src/pages/PatientEvolution.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to find the block:
# if (newTabId === "prescriptions" || newTabId === "all") {
#   setIsFormOpen(false);
# } else {
#   setIsFormOpen(true);
#   if (newTabId === "vitals") {
#     handleEvolutionTypeChange("Sinais Vitais");
#   } else if (newTabId === "discharge") {
#     handleEvolutionTypeChange("Alta");
#   } else if (newTabId === "exams") {
#     if (unreadExamsCount > 0 && id) markExamsAsRead(id);
#     handleEvolutionTypeChange("Procedimento");
#   } else if (newTabId === "evolutions") {
#     handleEvolutionTypeChange("Evolução Enfermagem");
#   }
# }

old_block = """                  if (newTabId === "prescriptions" || newTabId === "all") {
                    setIsFormOpen(false);
                  } else {
                    setIsFormOpen(true);
                    if (newTabId === "vitals") {
                      handleEvolutionTypeChange("Sinais Vitais");
                    } else if (newTabId === "discharge") {
                      handleEvolutionTypeChange("Alta");
                    } else if (newTabId === "exams") {
                      if (unreadExamsCount > 0 && id) markExamsAsRead(id);
                      handleEvolutionTypeChange("Procedimento");
                    } else if (newTabId === "evolutions") {
                      handleEvolutionTypeChange("Evolução Enfermagem");
                    }
                  }"""

# New logic: evolutions also sets isFormOpen to false, because we use the Modal now.
new_block = """                  if (newTabId === "prescriptions" || newTabId === "all" || newTabId === "evolutions") {
                    setIsFormOpen(false);
                  } else {
                    setIsFormOpen(true);
                    if (newTabId === "vitals") {
                      handleEvolutionTypeChange("Sinais Vitais");
                    } else if (newTabId === "discharge") {
                      handleEvolutionTypeChange("Alta");
                    } else if (newTabId === "exams") {
                      if (unreadExamsCount > 0 && id) markExamsAsRead(id);
                      handleEvolutionTypeChange("Procedimento");
                    }
                  }"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Successfully replaced block.")
else:
    print("Block not found. Trying flexible replace...")
    # fallback
    content = content.replace('if (newTabId === "prescriptions" || newTabId === "all") {', 'if (newTabId === "prescriptions" || newTabId === "all" || newTabId === "evolutions") {')
    
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modification complete.")
