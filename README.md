# DulyPlan Admin Panel

Admin panel for managing DulyPlan system settings, pricing tiers, organizations, and users.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material UI** - UI component library
- **React Hook Form** - Form management
- **React Router** - Routing
- **Axios** - HTTP client
- **js-cookie** - Cookie management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

**IMPORTANT: Before starting the application, you need to add the custom domain to your hosts file.**

#### Step 1: Update Hosts File

The hosts file maps domain names to IP addresses. We need to add `local.admin.dulyplan.com` to point to `127.0.0.1` (localhost).

##### On macOS:

1. **Open Terminal**
2. **Edit the hosts file:**
   ```bash
   sudo nano /etc/hosts
   ```
3. **Add this line at the end of the file:**
   ```
   127.0.0.1   local.admin.dulyplan.com
   ```
4. **Save and exit:**
   - Press `Ctrl + X`
   - Press `Y` to confirm
   - Press `Enter` to save
5. **Flush DNS cache (optional but recommended):**
   ```bash
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```

##### On Windows:

1. **Open Notepad as Administrator:**
   - Press `Windows Key`
   - Type "Notepad"
   - Right-click on "Notepad"
   - Select "Run as administrator"
2. **Open the hosts file:**
   - Click "File" → "Open"
   - Navigate to: `C:\Windows\System32\drivers\etc\`
   - Change file type filter to "All Files (*.*)"
   - Select `hosts` file and click "Open"
3. **Add this line at the end of the file:**
   ```
   127.0.0.1   local.admin.dulyplan.com
   ```
4. **Save the file:**
   - Press `Ctrl + S` or click "File" → "Save"
5. **Flush DNS cache (optional but recommended):**
   - Open Command Prompt as Administrator
   - Run: `ipconfig /flushdns`

##### On Ubuntu/Linux:

1. **Open Terminal**
2. **Edit the hosts file:**
   ```bash
   sudo nano /etc/hosts
   ```
   Or using vim:
   ```bash
   sudo vim /etc/hosts
   ```
3. **Add this line at the end of the file:**
   ```
   127.0.0.1   local.admin.dulyplan.com
   ```
4. **Save and exit:**
   - **For nano:** Press `Ctrl + X`, then `Y`, then `Enter`
   - **For vim:** Press `Esc`, type `:wq`, then press `Enter`
5. **Flush DNS cache (if using systemd-resolved):**
   ```bash
   sudo systemd-resolve --flush-caches
   ```
   Or for older systems:
   ```bash
   sudo service networking restart
   ```

#### Step 2: Verify Hosts File Entry

**On macOS/Linux:**
```bash
cat /etc/hosts | grep local.admin.dulyplan.com
```

**On Windows (Command Prompt):**
```cmd
type C:\Windows\System32\drivers\etc\hosts | findstr local.admin.dulyplan.com
```

You should see: `127.0.0.1   local.admin.dulyplan.com`

#### Step 3: Start the Application

```bash
npm install
npm run dev
```

#### Step 4: Access the Application

After the server starts, you can access the admin panel at:
- **Primary URL:** `http://local.admin.dulyplan.com:3001` (recommended)
- **Alternative:** `http://localhost:3001` (also works)

**Note:** If you see "Connection refused" or can't access via the custom domain, make sure:
1. The hosts file entry was saved correctly
2. You flushed the DNS cache
3. You restarted your browser after updating the hosts file
4. The Vite dev server is running on port 3001

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── pages/            # Page components
│   ├── Login.tsx     # Login page
│   └── Dashboard.tsx  # Admin dashboard
│   └── sections/     # Admin sections (Pricing, Users, Organizations, etc.)
├── common/           # Shared utilities
│   ├── env.ts        # Environment configuration
│   └── api-config.ts # Axios configuration
├── services/         # API services
│   ├── api.service.ts
│   └── auth.service.ts
│   └── pricing.service.ts
│   └── org.service.ts
│   └── user.service.ts
├── components/       # Shared UI components
│   └── Layout/       # Sidebar + dashboard layout
│   └── ProfileModal.tsx
├── theme/            # Material UI theme
│   └── ThemeProvider.tsx
└── App.tsx           # Main app component with routing
```

## API Configuration

The admin panel uses the same API configuration as the main frontend:
- Production: `https://dulyplan.com`
- UAT: `https://api.dulyplan.com`
- Development: `http://local.dulyplan.com:8085`

API calls are configured in `src/common/api-config.ts` and `src/common/env.ts`
and use the same authentication mechanism (JWT cookies).

Use `VITE_API_ROOT` to override the backend at build time when needed:

```bash
VITE_API_ROOT=https://dulyplan.com npm run build
```

## Authentication & Access

- Uses the same login flow as the main DulyPlan frontend.
- System admin status is verified via `/v1/system-admin/status`.
- Non-system-admin users are logged out and redirected.

## Features

- ✅ Login/Logout with system admin enforcement
- ✅ Dashboard layout with responsive sidebar
- ✅ Pricing Management (dynamic pricing tiers)
- ✅ Organization Management (pagination + search)
- ✅ User Management (pagination + search + filters)
- ⏳ System Analytics (placeholder)

## Notes

- This is a separate React application from the main DulyPlan frontend
- Uses the same backend API
- Admin-specific routes are protected by `requireSystemAdmin`
- Pricing and limits are stored in DB (dynamic tiers)
