import { useState, useTransition } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

type UploadStatus = "idle" | "success" | "error";

export function UploadTest() {
  const [simpleStatus, setSimpleStatus] = useState<UploadStatus>("idle");
  const [formStatus, setFormStatus] = useState<UploadStatus>("idle");
  const [isSimplePending, startSimpleTransition] = useTransition();
  const [isFormPending, startFormTransition] = useTransition();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          title="Upload File (simple)"
          onPress={() => startSimpleTransition(() => uploadFakeFile().then(setSimpleStatus))}
          disabled={isSimplePending}
        />
        {isSimplePending && <ActivityIndicator />}
        {simpleStatus === "success" && <Text style={styles.success}>OK</Text>}
        {simpleStatus === "error" && <Text style={styles.error}>Error</Text>}
      </View>

      <View style={styles.row}>
        <Button
          title="Upload File + Form Data"
          onPress={() => startFormTransition(() => uploadWithFormData().then(setFormStatus))}
          disabled={isFormPending}
        />
        {isFormPending && <ActivityIndicator />}
        {formStatus === "success" && <Text style={styles.success}>OK</Text>}
        {formStatus === "error" && <Text style={styles.error}>Error</Text>}
      </View>
    </View>
  );
}

async function uploadFakeFile(): Promise<UploadStatus> {
  try {
    const blob = new Blob(["fake-binary-content-for-testing"], { type: "image/png" });

    const formData = new FormData();
    formData.append("file", blob as any, "test-image.png");
    formData.append("description", "multipart upload test");

    const response = await fetch("https://postman-echo.com/post", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return "success";
  } catch (e) {
    console.error("Upload error:", e);
    return "error";
  }
}

async function uploadWithFormData(): Promise<UploadStatus> {
  try {
    const blob = new Blob(["fake-binary-content-for-testing"], { type: "image/png" });

    const formData = new FormData();
    formData.append("file", blob as any, "profile-photo.png");
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("age", "28");
    formData.append("description", "User profile photo upload");

    const response = await fetch("https://postman-echo.com/post", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return "success";
  } catch (e) {
    console.error("Upload error:", e);
    return "error";
  }
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  success: {
    color: "green",
    fontSize: 13,
  },
  error: {
    color: "red",
    fontSize: 13,
  },
});
