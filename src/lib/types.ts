export type CaseItem = {
  id: number;
  slug: string;
  no: string;
  name: string;
  title: string;
  location: string;
  image: string;
  width: number;
  height: number;
  description: string;
  observation: string;
  details: { title: string; body: string }[];
  published: boolean;
  sort: number;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImage: string;
  };
  contact: {
    phone: string;
    wechat: string;
    email: string;
    address: string;
    hours: string;
  };
  inquiry: {
    enabled: boolean;
    note: string;
  };
};

export type LeadItem = {
  id: number;
  name: string;
  phone: string;
  city: string;
  houseType: string;
  area: string;
  timing: string;
  intent: string;
  source: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type MediaItem = {
  id: number;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
};
