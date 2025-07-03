async function queryGraphQL(query, variables = {}) {
    const token = localStorage.getItem("jwt");
  
    const response = await fetch("https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });
  
    const data = await response.json();
    return data.data;
  }
  
  function parseJWT(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  