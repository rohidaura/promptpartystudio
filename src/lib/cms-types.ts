export type Json = Record<string, unknown>;

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type Prompt = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  prompt_text: string;
  category_id: string | null;
  ai_model: string | null;
  tags: string[];
  preview_image_url: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  is_trending: boolean;
  is_pro: boolean;
  is_published: boolean;
  rating: number;
  rating_count: number;
  view_count: number;
  copy_count: number;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  author_name: string;
  author_role: string | null;
  avatar_url: string | null;
  rating: number;
  body: string;
  is_approved: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export type NavItem = {
  id: string;
  location: string;
  label: string;
  href: string;
  sort_order: number;
  is_visible: boolean;
};

export type PageSection = {
  id: string;
  page_slug: string;
  section_key: string;
  label: string;
  is_visible: boolean;
  sort_order: number;
  content: Json;
};

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  kind: string;
  folder: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  created_at: string;
};

export type SiteSettings = {
  site: {
    name?: string;
    logo_text?: string;
    logo_mark_url?: string | null;
    tagline?: string;
    instagram_url?: string;
    contact_email?: string;
    copyright?: string;
  };
  hero: {
    eyebrow?: string;
    title?: string;
    description?: string;
    primary_cta_label?: string;
    primary_cta_href?: string;
    secondary_cta_label?: string;
    secondary_cta_href?: string;
    left_media_kind?: "gradient" | "image" | "video" | "text";
    left_media_url?: string | null;
    right_media_kind?: "gradient" | "image" | "video" | "text";
    right_media_url?: string | null;
    right_caption?: string;
    background_kind?: "gradient" | "image" | "video";
    background_url?: string | null;
  };
  theme: {
    primary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    glass_opacity?: number;
    glass_blur?: number;
    glass_border_opacity?: number;
    radius?: number;
    font_display?: string;
    font_body?: string;
    container_width?: number;
    animation_speed?: number;
    shadow_strength?: number;
  };
  contact: {
    title?: string;
    description?: string;
    cta_label?: string;
    cta_href?: string;
  };
  seo: {
    default_title?: string;
    default_description?: string;
    og_image?: string | null;
    favicon?: string | null;
    ga_id?: string | null;
    gsc_tag?: string | null;
    custom_css?: string | null;
    custom_js?: string | null;
  };
};

export type SiteData = {
  settings: SiteSettings;
  categories: Category[];
  prompts: Prompt[];
  reviews: Review[];
  navItems: NavItem[];
  sections: PageSection[];
};