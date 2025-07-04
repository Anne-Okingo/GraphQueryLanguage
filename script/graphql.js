
async function queryGraphQL(query, variables = {}) {
  const token = localStorage.getItem("jwt")?.trim();
  if (!token) throw new Error("Not authenticated. Please login again.");

  try {
    const response = await fetch("https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL Error:", result.errors);
      throw new Error(result.errors[0].message || "Unknown GraphQL error");
    }

    return result.data;
  } catch (err) {
    console.error("GraphQL Fetch Error:", err);
    throw new Error("Failed to fetch data. Please check your network or try again.");
  }
}

function parseJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return {};
  }
}