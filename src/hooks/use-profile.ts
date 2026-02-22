"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { updateUser } from "@/services/user.service";

interface ProfileFormData {
  nombre: string;
  telefono: string;
  pais: string;
  ciudad: string;
  bio: string;
}

export function useProfile() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: "",
    telefono: "",
    pais: "",
    ciudad: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        pais: user.pais || "",
        ciudad: user.ciudad || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  function handleCancel() {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        pais: user.pais || "",
        ciudad: user.ciudad || "",
        bio: user.bio || "",
      });
    }
    setIsEditing(false);
  }

  async function handleSave() {
    if (!user?._id) return;
    setIsSaving(true);
    try {
      await updateUser(user._id, formData);
      await refreshUser();
      setIsEditing(false);

      toast.success("Perfil actualizado", {
        description: "Tus datos se han guardado correctamente.",
      });
    } catch {
      toast.error("Error al guardar", {
        description: "No se pudo actualizar el perfil. Intenta de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const completionItems = useMemo(
    () => [
      { done: !!user?.nombre, label: "Nombre" },
      { done: !!user?.pais, label: "País" },
      { done: !!user?.ciudad, label: "Ciudad" },
      { done: !!user?.telefono, label: "Teléfono" },
      { done: !!user?.bio, label: "Bio" },
      { done: (user?.preferencias?.length || 0) > 0, label: "Preferencias" },
    ],
    [user]
  );

  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPercent = Math.round(
    (completedCount / completionItems.length) * 100
  );

  return {
    user,
    isEditing,
    setIsEditing,
    isSaving,
    formData,
    setFormData,
    handleCancel,
    handleSave,
    completionItems,
    completedCount,
    completionPercent,
  };
}
