CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  summary TEXT NOT NULL,
  goal TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  reading_minutes INTEGER NOT NULL DEFAULT 5,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_slug) REFERENCES categories(slug)
);

CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_category_slug ON articles(category_slug);

INSERT OR IGNORE INTO categories (slug, name, icon, summary, goal, sort_order) VALUES
  ('english', '英语', 'EN', '沉淀词汇、口语表达、阅读精讲和写作模板。', '建立可复习、可输出、可迁移的英语学习体系。', 10),
  ('frontend', '前端', 'FE', '整理 Nuxt、Vue、工程化、性能优化和组件设计资料。', '把项目经验沉淀成可复用的技术资产。', 20),
  ('wechat', '公众号', 'WX', '管理选题、标题、文章结构、金句素材和发布复盘。', '形成稳定的内容生产流水线。', 30),
  ('redbook', '小红书', 'XR', '收集爆款笔记结构、封面文案、评论洞察和账号定位。', '用数据和模板提高内容命中率。', 40),
  ('certificates', '证书', 'CE', '跟踪考试计划、知识点清单、真题错题和证书材料。', '让备考进度、资料和复盘一处可见。', 50);
