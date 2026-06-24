import re
import sys

# 1. Fix MyWorkspace.tsx
with open("src/pages/MyWorkspace.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add toast to handleEndShift
old_handle_doc = """  const handleEndShift = () => {
    localStorage.removeItem("upa_active_room");
    localStorage.removeItem("upa_active_doctor");
    navigate("/painel-medico");
  };"""
new_handle_doc = """  const handleEndShift = () => {
    localStorage.removeItem("upa_active_room");
    localStorage.removeItem("upa_active_doctor");
    toast.success("Turno encerrado. Bom descanso!");
    navigate("/painel-medico");
  };"""
content = content.replace(old_handle_doc, new_handle_doc)

# Remove Bom descanso from modal
old_modal_doc = """              <br />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Bom descanso!
              </span>"""
content = content.replace(old_modal_doc, "")

with open("src/pages/MyWorkspace.tsx", "w", encoding="utf-8") as f:
    f.write(content)


# 2. Fix NurseWorkspaceHeader.tsx
with open("src/components/NurseWorkspaceHeader.tsx", "r", encoding="utf-8") as f:
    content2 = f.read()

# Add toast to handleEndShiftConfirm
old_handle_nurse = """  const handleEndShiftConfirm = () => {
    localStorage.removeItem("upa_active_room");
    localStorage.removeItem("upa_active_nurse");
    localStorage.removeItem("upa_stamp_number");
    localStorage.removeItem("upa_stamp_state");
    setIsEndShiftModalOpen(false);
    navigate("/painel-enfermagem");
  };"""
new_handle_nurse = """  const handleEndShiftConfirm = () => {
    localStorage.removeItem("upa_active_room");
    localStorage.removeItem("upa_active_nurse");
    localStorage.removeItem("upa_stamp_number");
    localStorage.removeItem("upa_stamp_state");
    setIsEndShiftModalOpen(false);
    toast.success("Turno encerrado. Bom descanso!");
    navigate("/painel-enfermagem");
  };"""
content2 = content2.replace(old_handle_nurse, new_handle_nurse)

# Remove Bom descanso from modal
old_modal_nurse = """                <br />
                <br />
                <strong className="text-slate-700 dark:text-slate-300">
                  Bom descanso!
                </strong>"""
content2 = content2.replace(old_modal_nurse, "")

with open("src/components/NurseWorkspaceHeader.tsx", "w", encoding="utf-8") as f:
    f.write(content2)

print("Exit modals standardized successfully.")
