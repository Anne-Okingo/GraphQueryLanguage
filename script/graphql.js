async function queryGraphQL(query, variables = {}) {
  const token = localStorage.getItem("jwt")?.trim();
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
      throw new Error(result.errors[0].message);
    }
    console.log("GraphQL Success:", result.data);
    return result.data;
  } catch (err) {
    console.error("GraphQL Fetch Error:", err);
    throw err;
  }
}


function parseJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return {};
  }
}
