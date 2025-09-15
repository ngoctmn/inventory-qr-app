-- ====================================================
-- SIMPLE INVENTORY QR SYSTEM - MINIMAL SCHEMA
-- Version: 3.0 - Simplified
-- ====================================================

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================
-- 1. ASSETS TABLE (Danh sách tài sản)
-- ====================================================
DROP TABLE IF EXISTS assets CASCADE;
CREATE TABLE assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id VARCHAR(100) UNIQUE NOT NULL,
    name_vi TEXT,
    name_en TEXT,
    type VARCHAR(100),
    model VARCHAR(200),
    serial VARCHAR(200),
    department VARCHAR(200),
    location VARCHAR(200),
    status VARCHAR(50) DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================================
-- 2. INVENTORY CYCLES (Kỳ kiểm kê)
-- ====================================================
DROP TABLE IF EXISTS inventory_cycles CASCADE;
CREATE TABLE inventory_cycles (
    cycle_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    total_assets INTEGER DEFAULT 0,
    checked_assets INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================================
-- 3. INVENTORY LOGS (Nhật ký quét)
-- ====================================================
DROP TABLE IF EXISTS inventory_logs CASCADE;
CREATE TABLE inventory_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id VARCHAR(100) NOT NULL,
    cycle_id UUID NOT NULL,
    inspector VARCHAR(100) NOT NULL,
    scan_time TIMESTAMP DEFAULT NOW(),
    actual_location VARCHAR(200),
    condition VARCHAR(50) DEFAULT 'Good',
    notes TEXT,
    UNIQUE(asset_id, cycle_id)
);

-- ====================================================
-- 4. ACTIVITY LOGS (Optional - có thể bỏ qua)
-- ====================================================
DROP TABLE IF EXISTS activity_logs CASCADE;
CREATE TABLE activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action VARCHAR(50),
    entity_id VARCHAR(100),
    user_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================================
-- 5. VIEW: Trạng thái kiểm kê
-- ====================================================
CREATE OR REPLACE VIEW v_asset_inventory_status AS
SELECT 
    a.*,
    CASE WHEN il.id IS NOT NULL THEN true ELSE false END as is_checked,
    il.inspector,
    il.scan_time,
    il.actual_location as checked_location,
    il.condition as checked_condition
FROM assets a
LEFT JOIN inventory_logs il ON a.asset_id = il.asset_id
LEFT JOIN inventory_cycles ic ON il.cycle_id = ic.cycle_id AND ic.is_active = true;

-- ====================================================
-- 6. SAMPLE DATA
-- ====================================================
-- Tạo kỳ kiểm kê mẫu
INSERT INTO inventory_cycles (name, is_active) 
VALUES ('Kiểm kê Q1/2025', true);

-- Thêm vài tài sản mẫu
INSERT INTO assets (asset_id, name_vi, model, department, location) VALUES
('TS001', 'Máy tính Dell', 'Optiplex 7090', 'IT', 'Tầng 2'),
('TS002', 'Bàn làm việc', 'IKEA-2024', 'Admin', 'Tầng 3'),
('TS003', 'Máy in HP', 'LaserJet Pro', 'Accounting', 'Tầng 2');

-- ====================================================
-- 7. PERMISSIONS
-- ====================================================
-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies cho anon user
CREATE POLICY "Public Access" ON assets FOR ALL USING (true);
CREATE POLICY "Public Access" ON inventory_cycles FOR ALL USING (true);
CREATE POLICY "Public Access" ON inventory_logs FOR ALL USING (true);
CREATE POLICY "Public Access" ON activity_logs FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO anon;