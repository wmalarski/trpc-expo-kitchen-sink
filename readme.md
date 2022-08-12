# Learning tRPC + Expo + Next.js + Supabase = TENS Stack

## 🚀 Introduction

A monorepo containing:

- Next.js web app
- React Native app with Expo
- A [tRPC](https://trpc.io)-API which is inferred straight into the above.
- [Prisma](http://prisma.io/) as a typesafe ORM

> In tRPC you simply write API-functions that are automatically inferred straight into your frontend - no matter if it's React, React Native, or something else _(that is TS/JS-based)_.

## 📁 Folder structure

```graphql
.
├── apps
│   ├── expo    # Expo/RN application
│   └── next    # Server-side rendered Next.js application
├── packages
│   └── api     # tRPC API 
└── prisma      # Prisma setup
```

## 🔗 Credits

- [https://github.com/trpc/zart](zart) base template.
- [https://github.com/t3-oss/create-t3-app](create-t3-app)
