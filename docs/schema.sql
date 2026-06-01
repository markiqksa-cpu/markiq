-- ============================================
-- Markiq Database Schema — Supabase PostgreSQL
-- Version: 1.0 | 2026
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & TEAM
-- ============================================

CREATE TYPE user_role AS ENUM (
  'admin',           -- مدير عام
  'campaign_manager', -- مدير حملات
  'content_specialist', -- متخصص محتوى
  'data_analyst',    -- محلل بيانات
  'ads_specialist'   -- متخصص إعلانات
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'content_specialist',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLIENTS
-- ============================================

CREATE TYPE client_status AS ENUM ('active', 'pending', 'inactive');
CREATE TYPE client_sector AS ENUM (
  'restaurants', 'salons', 'clinics', 'retail',
  'ecommerce', 'education', 'real_estate', 'other'
);
CREATE TYPE content_language AS ENUM (
  'arabic_saudi', 'arabic_gulf', 'arabic_egyptian',
  'arabic_formal', 'english', 'bilingual'
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  sector client_sector NOT NULL,
  city VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(100) NOT NULL,
  target_areas TEXT[] DEFAULT '{}',        -- الأحياء المستهدفة
  target_age VARCHAR(50),                  -- '25-34'
  target_gender VARCHAR(20) DEFAULT 'all', -- all/male/female
  interests TEXT[] DEFAULT '{}',           -- الاهتمامات
  content_language content_language DEFAULT 'arabic_saudi',
  platforms TEXT[] DEFAULT '{}',           -- المنصات المختارة
  goals TEXT[] DEFAULT '{}',               -- الأهداف
  seo_keywords TEXT[] DEFAULT '{}',        -- كلمات SEO
  seo_level VARCHAR(20) DEFAULT 'none',    -- none/weak/good/excellent
  website_url TEXT,
  instagram_url TEXT,
  competitors TEXT[] DEFAULT '{}',
  description TEXT,                        -- وصف للـ AI
  budget_monthly DECIMAL(10,2),
  assigned_to UUID REFERENCES users(id),
  status client_status DEFAULT 'pending',
  contract_start DATE,
  contract_end DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STRATEGIES
-- ============================================

CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,                   -- ملخص الاستراتيجية
  kpi_orders_target DECIMAL(5,2),          -- هدف زيادة الطلبات %
  kpi_roi_target DECIMAL(5,2),             -- هدف ROI
  kpi_cpo_target DECIMAL(10,2),            -- هدف تكلفة الطلب
  kpi_impressions_target INTEGER,          -- هدف الظهور الشهري
  peak_times JSONB DEFAULT '{}',           -- أوقات الذروة
  phases JSONB DEFAULT '[]',               -- مراحل التنفيذ
  ai_recommendations JSONB DEFAULT '[]',   -- توصيات AI
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAMPAIGNS
-- ============================================

CREATE TYPE campaign_status AS ENUM (
  'draft', 'pending_review', 'active', 'paused', 'ended'
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  goal TEXT,
  platforms TEXT[] DEFAULT '{}',
  budget_total DECIMAL(10,2) NOT NULL,
  budget_distribution JSONB DEFAULT '{}',  -- { instagram: 1200, google: 2000 }
  start_date DATE,
  end_date DATE,
  ai_notes TEXT,                           -- ملاحظات للـ AI
  status campaign_status DEFAULT 'draft',
  -- Performance metrics
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  roi DECIMAL(5,2),
  -- Meta
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform budget tracking
CREATE TABLE campaign_platform_budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,           -- instagram/google/snapchat
  budget_limit DECIMAL(10,2) NOT NULL,
  spent DECIMAL(10,2) DEFAULT 0,
  is_paused BOOLEAN DEFAULT false,
  external_campaign_id VARCHAR(255),       -- ID من منصة الإعلانات
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENT
-- ============================================

CREATE TYPE content_type AS ENUM ('image', 'video', 'text', 'story', 'reel', 'ugc');
CREATE TYPE content_status AS ENUM (
  'draft', 'pending_review', 'approved', 'rejected', 'published', 'archived'
);

CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  platform VARCHAR(50) NOT NULL,
  type content_type NOT NULL,
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  image_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  -- AI generation details
  ai_prompt TEXT,                          -- البرومبت المستخدم
  ai_score INTEGER,                        -- تقييم AI (0-100)
  ai_feedback JSONB DEFAULT '{}',          -- { caption: 95, hashtags: 90 }
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  -- Review
  status content_status DEFAULT 'draft',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  -- Performance (post-publish)
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagements INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ALERTS
-- ============================================

CREATE TYPE alert_type AS ENUM (
  'budget_exceeded', 'budget_warning', 'ctr_low', 'roi_low',
  'content_pending', 'contract_renewal', 'saudi_occasion',
  'campaign_ended', 'performance_goal_reached'
);
CREATE TYPE alert_priority AS ENUM ('urgent', 'warning', 'info', 'success');

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  campaign_id UUID REFERENCES campaigns(id),
  type alert_type NOT NULL,
  priority alert_priority NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,                         -- رابط الإجراء
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  auto_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUDGET TRANSACTIONS
-- ============================================

CREATE TABLE budget_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id),
  client_id UUID REFERENCES clients(id),
  platform VARCHAR(50),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  transaction_date DATE DEFAULT CURRENT_DATE,
  is_overage BOOLEAN DEFAULT false,        -- هل هو تجاوز؟
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CARDS (بطاقات العملاء)
-- ============================================

CREATE TABLE client_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  card_type VARCHAR(50),                   -- visa/mastercard
  last_four VARCHAR(4),
  card_holder VARCHAR(255),
  bank_name VARCHAR(100),
  monthly_limit DECIMAL(10,2),
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stripe_payment_method_id VARCHAR(255),   -- Stripe reference
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTRACTS
-- ============================================

CREATE TYPE contract_status AS ENUM ('active', 'expired', 'cancelled');

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  contract_number VARCHAR(50) UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_value DECIMAL(10,2) NOT NULL,
  annual_value DECIMAL(10,2),
  status contract_status DEFAULT 'active',
  file_url TEXT,                           -- رابط ملف العقد
  signed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICES
-- ============================================

CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  contract_id UUID REFERENCES contracts(id),
  invoice_number VARCHAR(50) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  vat_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  billing_period VARCHAR(50),              -- 'مايو 2026'
  due_date DATE,
  paid_at TIMESTAMPTZ,
  status invoice_status DEFAULT 'pending',
  stripe_invoice_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TEAM TASKS
-- ============================================

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE task_priority AS ENUM ('urgent', 'today', 'scheduled', 'low');

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID REFERENCES clients(id),
  campaign_id UUID REFERENCES campaigns(id),
  assigned_to UUID REFERENCES users(id),
  due_at TIMESTAMPTZ,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'scheduled',
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,            -- 'approve_content', 'edit_budget'
  entity_type VARCHAR(50),                 -- 'campaign', 'client', 'content'
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES للأداء
-- ============================================

CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_assigned ON clients(assigned_to);
CREATE INDEX idx_campaigns_client ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_content_campaign ON content(campaign_id);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_scheduled ON content(scheduled_at);
CREATE INDEX idx_alerts_client ON alerts(client_id);
CREATE INDEX idx_alerts_unread ON alerts(is_read) WHERE is_read = false;
CREATE INDEX idx_alerts_unresolved ON alerts(is_resolved) WHERE is_resolved = false;
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_budget_transactions_campaign ON budget_transactions(campaign_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Admin sees everything
CREATE POLICY "admin_all" ON clients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Team members see assigned clients only
CREATE POLICY "team_assigned_clients" ON clients
  FOR SELECT USING (
    assigned_to = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'campaign_manager'))
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_campaigns_updated BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_content_updated BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_strategies_updated BEFORE UPDATE ON strategies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number = 'MRQ-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('invoice_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE invoice_seq START 1;
CREATE TRIGGER trg_invoice_number BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Auto-generate contract number
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.contract_number = 'CNT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('contract_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE contract_seq START 1;
CREATE TRIGGER trg_contract_number BEFORE INSERT ON contracts FOR EACH ROW EXECUTE FUNCTION generate_contract_number();

-- Budget overage alert function
CREATE OR REPLACE FUNCTION check_budget_overage()
RETURNS TRIGGER AS $$
DECLARE
  v_budget DECIMAL;
  v_spent DECIMAL;
  v_campaign_id UUID;
  v_client_id UUID;
BEGIN
  SELECT budget_limit, spent, campaign_id INTO v_budget, v_spent, v_campaign_id
  FROM campaign_platform_budgets WHERE id = NEW.id;

  SELECT client_id INTO v_client_id FROM campaigns WHERE id = v_campaign_id;

  -- تجاوز الميزانية
  IF NEW.spent > NEW.budget_limit THEN
    INSERT INTO alerts (client_id, campaign_id, type, priority, title, message)
    VALUES (
      v_client_id, v_campaign_id,
      'budget_exceeded', 'urgent',
      'تجاوز ميزانية ' || NEW.platform,
      'تجاوز الإنفاق الحد بنسبة ' || ROUND(((NEW.spent - NEW.budget_limit) / NEW.budget_limit * 100))::TEXT || '%'
    );
  -- اقتراب من الميزانية (80%)
  ELSIF NEW.spent > NEW.budget_limit * 0.8 AND v_spent <= NEW.budget_limit * 0.8 THEN
    INSERT INTO alerts (client_id, campaign_id, type, priority, title, message)
    VALUES (
      v_client_id, v_campaign_id,
      'budget_warning', 'warning',
      'اقتراب من حد ميزانية ' || NEW.platform,
      'الإنفاق وصل إلى ' || ROUND((NEW.spent / NEW.budget_limit * 100))::TEXT || '% من الميزانية'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_budget_overage
  AFTER UPDATE ON campaign_platform_budgets
  FOR EACH ROW EXECUTE FUNCTION check_budget_overage();
