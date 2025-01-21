// src/lib/getUserRole.ts

export async function getUserRole() {
  const response = await fetch("/api/getUserRole");
  const data = await response.json();
  return data.role;
}
