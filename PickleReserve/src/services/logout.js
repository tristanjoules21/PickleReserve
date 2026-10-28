import api from "./api";
import { clearAuth } from "./auth";

export async function logout(router) {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Failed to revoke the administrator session:", error);
  } finally {
    clearAuth();
    await router.push("/login");
  }
}
