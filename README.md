# graphql

A web-based developer profile dashboard that visualizes user experience (XP), project progress, and audit statistics using data from a GraphQL API all writen in Javascript.

---
## Features
- **Login System:** Secure authentication using JWT tokens.
- **Profile Dashboard:** Displays user info, XP stats, project status, and project breakdowns by xp gained over time and xp gained per projects.
- **Interactive Graphs:** Visualizes XP over time, XP by project, and project status using Chart.js.
- **Responsive UI:** Styled with a modern, responsive CSS.
---
##  Live Demo

🔗 [Visit graphql](https://anne-okingo.github.io/GraphQueryLanguage/index.html)

---

## File Structure
- `idex.html` — Login page for user authentication.
- `profile.html` — Main dashboard for authenticated users.
- `style.css` — Styles for all pages and components.
- `script/auth.js` — Handles login form and JWT storage.
- `script/profile.js` — Fetches and displays user profile and stats.
- `script/graphs.js` — Renders interactive charts with Chart.js.
- `script/graphql.js` — Utility for making authenticated GraphQL requests.

## Setup & Usage
1. **Clone the repository:**
   ```bash
   git clone https://learn.zone01kisumu.ke/git/aokingo/graphql
   cd graphql
  
2.** Open with Live Server**

You can use the **Live Server** extension.

1. Make sure the **Live Server** extension is installed.
2. Right-click on `index.html` in the project directory.
3. Select **"Open with Live Server"**.
4. Your browser will open at:  
   `http://127.0.0.1:5500/index.html`
 ```
3. **Open `index.html` in your browser.**
   - Enter your credentials to log in.
   - On success, you are redirected to `profile.html`.
4. **Profile Dashboard:**
   - View your XP, project stats, and pass/fail ratio.
   - Logout with the button in the profile header.

### Requirements
- Modern web browser (Chrome, Firefox, Edge, etc.)
- Internet connection (API calls to https://learn.zone01kisumu.ke)


## Author

**Anne Okingo**   
[GitHub](https://github.com/Anne-Okingo) • [LinkedIn](https://www.linkedin.com/in/anne-okingo-8ab242126/)



## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
