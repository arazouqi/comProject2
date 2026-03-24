export const API_BASE_URL = "http://192.168.1.116:3000";

export async function createUser(user: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(`${API_BASE_URL}/createuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  return res.json();
}

export async function deleteUser(email: string) {
  const res = await fetch(`${API_BASE_URL}/deleteuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  return res.json();
}

export async function getUser(email: string) {
  const res = await fetch(`${API_BASE_URL}/getuser?email=${email}`);
  return res.json();
}