import { api } from "@/lib/api";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

type ReceiptItemDraft = {
  name: string;
  amount: string;
};

type Mode = { mode: "create" } | { mode: "attach"; transactionId: string };

export function useScanReceipt(target: Mode) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [items, setItems] = useState<ReceiptItemDraft[]>([]);

  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (source: "camera" | "gallery") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Permission denied");
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setImageUri(asset.uri);
    setImageMimeType(asset.mimeType ?? "image/jpeg");
  };

  const scan = async () => {
    if (!imageUri) {
      setError("Pick or take a photo first");
      return;
    }

    setScanning(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "receipt.jpg",
        type: imageMimeType,
      } as unknown as Blob);

      const response = await api.upload("/transactions/scan-receipt", formData);
      setTitle(response.title);
      setAmount(String(response.amount));
      setOccurredAt(response.occurred_at);
      setImageUrl(response.image_url);
      setItems(
        response.items.map((item: { name: string; amount: number }) => ({
          name: item.name,
          amount: String(item.amount),
        }))
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setScanning(false);
    }
  };

  const updateItem = (index: number, field: "name" | "amount", value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", amount: "" }]);
  };

  const save = async () => {
    const parsedAmount = Number(amount);
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than 0");
      return false;
    }

    const parsedItems = items
      .filter((item) => item.name.trim())
      .map((item) => ({ name: item.name.trim(), amount: Number(item.amount) || 0 }));

    setSaving(true);
    setError(null);
    try {
      if (target.mode === "create") {
        await api.post("/transactions", {
          title: title.trim(),
          amount: -parsedAmount,
          category_id: categoryId,
          occurred_at: occurredAt,
          image_url: imageUrl,
          items: parsedItems,
        });
      } else {
        await api.post(`/transactions/${target.transactionId}/receipt-items`, {
          image_url: imageUrl,
          items: parsedItems,
          amount: -parsedAmount,
          occurred_at: occurredAt,
        });
      }
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    imageUri,
    pickImage,
    scan,
    scanning,
    title,
    setTitle,
    amount,
    setAmount,
    occurredAt,
    setOccurredAt,
    categoryId,
    setCategoryId,
    items,
    updateItem,
    removeItem,
    addItem,
    saving,
    error,
    save,
  };
}
