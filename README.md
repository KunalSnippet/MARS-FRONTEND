## MARS Frontend

This is the standalone web dashboard for MARS. It is a Vite + React + TypeScript app that talks to the FastAPI backend in the sibling [MARS-BE](../MARS-BE) workspace.

### What it includes

- Task Console for submitting requests and watching task progress
- Agent Monitor for scheduler/PCB state
- Model Dashboard for model and queue health
- Analytics for token, latency, and request trends
- Logs for recent structured events with filters

## How to Run

1. Open a terminal and navigate to the `MARS-FE` directory.
2. Install the necessary NPM dependencies:
   ```bash
   npm install
   ```
3. Start the development server (we recommend starting the `MARS-BE` backend first):
   ```bash
   npm run dev
   ```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### API Configuration

The frontend reads the backend base URL from `VITE_MARS_API_URL`.

Default:

```bash
http://localhost:8000
```

If your API runs on a different host or port, set the variable before starting Vite:

```bash
VITE_MARS_API_URL=http://localhost:8000 npm run dev
```

### Project Structure

```text
src/
	api/         fetch wrappers for backend resources
	hooks/       React Query hooks for polling and mutations
	components/  shared UI pieces and charts
	pages/       route-level screens
	App.tsx      app shell and routing
	main.tsx     React entrypoint
	styles.css   global styling
```

### Notes

- The app is designed to work against the mock backend mode first.
- React Query handles all polling and server-state fetching.
- Charts use Recharts, and markdown output is rendered with React Markdown.
