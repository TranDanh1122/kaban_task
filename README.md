# Kanban Task Manager - Full-Stack Web Application

## Overview

Kanban Task Manager is a full-stack web application built with **Next.js** to manage tasks using a **Kanban board system**. Users can:

- Create plans, statuses (columns like *Todo*, *Pending*), and tasks.
- Drag-and-drop tasks between columns.
- Upload files.
- Archive/restore plans.
- Customize settings (*theme, font, etc.*).

The project utilizes **modern technologies** such as:

- **React, TypeScript, Redux Toolkit, RTK Query, Prisma, Supabase, and Cloudinary.**
- This showcases my skills in front-end and back-end development, state management, API integration, and performance optimization, making it a great fit for a **Junior Frontend Developer role**.

---

## Features

### 🔐 Authentication

- Login/register with **NextAuth**, including **OAuth GitHub integration**.

### 📌 Kanban Board

- Create plans with multiple **statuses (columns)** (e.g., *Todo*, *Pending*).
- Choose colors for each column.
- **Create, edit, delete, and drag-and-drop tasks** between columns.
- Drag-and-drop **sorting within and across columns**.

### ✅ Task Management

- Add, edit, delete tasks for each status.
- **Upload files** to tasks using **Cloudinary API**.

### 📂 Plan Management

- **Archive and restore plans.**

### 🎨 Settings

- **Switch fonts and themes**, saved in **local storage**.

### 🎭 UI/UX

- **Popup and dialog system** managed by **useReducer** and **ContextAPI**.
- **Responsive design** with **TailwindCSS** for a user-friendly interface.

### 🔄 State Management

- **Global state management** with **Redux Toolkit**.
- API handling via **extra reducers**.
- **Local data persistence** using **Redux Persist**.

### 🖥️ API & Backend

- Custom **Next.js Server API** with **Prisma** and **Supabase** as the database.
- API calls managed with **RTK Query**.

### 🚀 Performance Optimization

- Optimized with **React hooks**: `useMemo`, `memo`, `useCallback` for better performance.

---

## 🛠️ Technologies Used

### **Frontend**

- **Next.js, React, TypeScript, TailwindCSS**
- **Redux Toolkit, RTK Query, Redux Persist, ContextAPI, useReducer**
- **useMemo, useCallback**

### **Backend**

- **Next.js Server API, Prisma, Supabase**

### **Authentication**

- **NextAuth** (with **OAuth GitHub**)

### **File Upload**

- **Cloudinary API**

### **UI Libraries**

- `@hello-pangea/dnd` (*for drag-and-drop functionality*)
- **TailwindCSS** (*for styling*)
- **ShadCN** (*for UI components*)

### **Version Control**

- **Git, GitHub**

---

## 🚀 Installation & Setup

To run this project locally, follow these steps:

### **1️⃣ Clone the repository:**

```bash
git clone https://github.com/TranDanh1122/kanban-task-manager.git
cd kanban-task-manager
```

### **2️⃣ Install dependencies:**

```bash
npm install
# or
yarn install
```

### **3️⃣ Set up environment variables:**

Create a `.env` file in the root directory and add the following:

```env
NEXTAUTH_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=your_api_url
GITHUB_ID=github_app_client_id
GITHUB_SECRET=github_app_client_secret
CLOUDINARY_CLOUD_NAME=your_account_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret_key
CLOUDINARY_UPLOAD_FOLDER=your_upload_folder
POSTGRES_PRISMA_URL=your_url
POSTGRES_URL_NON_POOLING=your_url
```

### **4️⃣ Run the development server:**

```bash
npm run dev
# or
yarn dev
```

### **5️⃣ Open in browser:**

Go to: [**http://localhost:3000**](http://localhost:3000)

---

## 📂 Project Structure

```text
kanban/
├── prisma/
│   ├── schema.prisma        # Prisma Database setup
├── src/
│   ├── app/                # Next.js core page/route (e.g., /api, /)
│   ├── components/         # React components (Board, Task, Status, Dialog, UI Components...)
│   ├── context/            # Dialog context setup
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Shared functions, variables...
│   ├── redux/              # Redux Toolkit slices and RTK Query setup
│   ├── global.d.ts         # Shared TypeScript definitions
│   ├── middleware.ts       # App Middleware
├── .env.local              # Environment variables
├── package.json            # Project dependencies
└── README.md               # This file
```

---

## 🤝 Contributing

- This is a **personal project**, but **contributions are welcome!**
- Feel free to **fork the repository**, make improvements, and **submit pull requests**.
- I'm still learning, so any **ideas and comments are welcome!** 🚀

---

## 📜 License

This project is licensed under the **MIT License** – see the **LICENSE** file for details.

---

## 👤 Author

**Trần Thành Danh**

🔗 **Portfolio**: [Frontend Mentor](https://www.frontendmentor.io/profile/TranDanh1122)

🔗 **GitHub**: [GitHub Profile](https://github.com/TranDanh1122)

