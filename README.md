# Prompt party

Role & Core Directive You are an elite Full-Stack Engineer and world-class UI/UX Designer. Your task is to build a premium, world-class AI Prompt Marketplace with a fully dynamic CMS. The website must feel like a blend of Apple, Linear, Framer, Arc Browser, and Notion—minimal, luxurious, extremely fast, and elegant. Strict constraint: The UI must never look like a standard template, and absolutely no content or configuration can be hardcoded.

Part 1: Global Design Language (Apple Liquid Glass) Implement a flawless "Apple Liquid Glass" aesthetic globally. The UI must feel futuristic, premium, and highly polished.

Visuals: Crystal-clear frosted glass, dynamic backdrop blur (40–80px), soft reflections, thin semi-transparent borders, and organic background lighting.

Geometry: Floating glass cards, rounded corners (28–40px), spacious layouts, and glass depth/soft shadows.

Typography & Colors: Perfect typography, premium gradients, and high-contrast minimal text.

Motion & Performance: Smooth Framer Motion (or equivalent) animations, GPU-accelerated transitions, 60 FPS performance, hover states, mouse drag, touch swipe, and smooth spring transitions. Mobile-first and fully responsive.

Part 2: Frontend Architecture (User-Facing)

Floating Navigation: A floating Liquid Glass capsule, fixed top center. Includes Home, Image Prompts, Website Prompts, Video Prompts, and Reviews. Must shrink slightly on scroll, show an active indicator, and include a full-screen Liquid Glass hamburger menu for mobile.

Hero Section: Full-screen floating glass container split into two equal columns by a thin vertical divider. Both sides operate independently (text, image, or video). Backgrounds must remain visible through the glass (supports image, video, or animated gradients). Includes large heading, description, primary/secondary CTAs, and smooth entrance animations.

Featured Prompts & Categories: Horizontal scrolling premium carousels for Image, Website, and Video categories.

Card Layout: Preview image, Before/After labels, Title, short description, category/model badges, rating, view count, Copy/Favorite/Share buttons, Free/Pro badge, and a large Liquid Glass "Prompt" button.

Interactions: Infinite loop, drag/swipe support, pagination dots, and floating glass navigation arrows.

Advanced Search & Filters: Instant live search. Filters for Category, AI Model, Popular, Newest, Trending, Free, and Premium.

Prompt Detail Modal: Clicking a prompt opens a premium Liquid Glass modal displaying: Large preview, full prompt text, copy/download buttons, AI model, tags, views, likes, and related prompts.

Reviews & Contact Section: Beautiful Apple-style review cards (Avatar, rating, text, animations). A Liquid Glass contact card with the heading "Let’s Build Something Amazing Together", description "Need a custom prompt or collaboration?", and a primary CTA "Message Me on Instagram" linking to [https://www.instagram.com/rohidnotforyou/](https://www.instagram.com/rohidnotforyou/).

Footer: Premium footer including Logo, Navigation, Instagram link, Copyright, Privacy Policy, and Terms.

Part 3: Backend & CMS Architecture (Admin-Facing) Create a secure, authenticated /admin route. The dashboard must also use the Liquid Glass design language.

Dashboard Overview: View website analytics, traffic, most viewed/copied prompts, and recent activity.

Prompt Manager: Full CRUD for prompts. Manage Title, Description, Prompt Text, Image, Video, AI Model, Category, Tags, Featured/Trending toggles, Free/Pro status, SEO metadata, Slug, and display order.

Category Manager: Create unlimited categories with Name, Description, Icon, Image, and Order.

Media Library (Crucial): A central asset manager supporting Images, Videos, SVGs, and Icons. Features drag-and-drop, multi-upload, folders, search, and preview. Rule: Every image/video component on the public site must be selectable directly from this library.

Global Content Editors:

Hero Editor: Fully edit titles, text, buttons, links, glass styles, and swap hero/background media and animations.

Homepage Builder: Drag-and-drop to reorder, hide, show, duplicate, or delete homepage sections. Edit all backgrounds, spacing, and content.

Navigation & Footer Editors: Full control over logos, menu items, order, and visibility.

Theme Customizer: Instantly update global variables: Primary/Accent colors, backgrounds, gradients, typography, button styles, glass opacity/blur, border radius, shadows, animation speeds, and container widths.

Reviews Manager: Approve, delete, and feature reviews. Manage user ratings.

SEO & Settings: Manage site-wide name, logos, emails, GA/GSC tags, custom CSS/JS. Per-page SEO manager for Meta titles/descriptions, Open Graph, Favicon, Canonical URLs, and structured data.

Part 4: Strict Technical Constraints & Future-Proofing

The "No Hardcoding" Rule: Absolutely nothing on the frontend can be hardcoded. Every string of text, image, background, color, spacing value, layout order, and button must be dynamically pulled from and editable within the CMS.

Performance Auto-Optimization: Implement automatic image compression, lazy loading, responsive images, caching, and strict accessibility standards.

Scalable Architecture: The database and component structure must be built to support future features without requiring a rebuild (e.g., AI Prompt Generators, User Accounts, Favorites, Stripe Subscriptions, Blogs, APIs, Dark/Light modes, and Admin Roles).

💡 Why this structure works better:

AI Context Parsing: Models read hierarchically. By separating the Design Language from the Frontend components and Backend logic, the AI won't accidentally apply a backend data rule to a frontend animation.

The "No Hardcoding" Rule: I explicitly defined this as a strict constraint at both the beginning and the end. AI builders notoriously love to hardcode text in React components. This framing forces it to build a database schema (like Supabase) first, and then map the frontend to that data.

Clear Component Scoping: Grouping the features into components (e.g., Prompt Detail Modal, Media Library) helps the AI generate distinct, reusable React/Vue components rather than one massive, unreadable file.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/72211601-fa55-4835-9b78-dc82d102d91d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
