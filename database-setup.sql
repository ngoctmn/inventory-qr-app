-- ====================================================
-- INVENTORY QR SYSTEM - FULL SCHEMA MATCHING GOOGLE SHEET
-- Version: 4.0 - Complete with all columns
-- ====================================================

-- Drop existing tables if any
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================
-- 1. ASSETS TABLE - Matching Google Sheet structure
-- ====================================================
CREATE TABLE assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Core fields (matching Google Sheet columns)
    asset_id VARCHAR(100) UNIQUE NOT NULL, -- Code
    name_vi TEXT, -- NameVi
    name_en TEXT, -- NameEn
    type VARCHAR(100), -- Type
    model VARCHAR(200), -- Model
    serial VARCHAR(200), -- Serial
    tech_code VARCHAR(100), -- TechCode
    start_date DATE, -- StartDate
    usage_period INTEGER, -- UsagePeriod (months)
    end_date DATE, -- EndDate
    customer VARCHAR(200), -- Customer
    supplier VARCHAR(200), -- Supplier
    source VARCHAR(200), -- Source
    department VARCHAR(200), -- Department
    location VARCHAR(200), -- Location
    status VARCHAR(50), -- Status
    initial_value DECIMAL(15,2), -- InitialValue
    current_value DECIMAL(15,2), -- CurrentValue
    notes TEXT, -- Notes
    
    -- System fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_assets_asset_id ON assets(asset_id);
CREATE INDEX idx_assets_department ON assets(department);
CREATE INDEX idx_assets_location ON assets(location);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_type ON assets(type);

-- ====================================================
-- 2. INVENTORY CYCLES TABLE
-- ====================================================
CREATE TABLE inventory_cycles (
    cycle_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    total_assets INTEGER DEFAULT 0,
    checked_assets INTEGER DEFAULT 0,
    start_at TIMESTAMPTZ DEFAULT NOW(),
    end_at TIMESTAMPTZ,
    created_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only allow one active cycle
CREATE UNIQUE INDEX idx_one_active_cycle ON inventory_cycles(is_active) WHERE is_active = true;

-- ====================================================
-- 3. INVENTORY LOGS TABLE
-- ====================================================
CREATE TABLE inventory_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id VARCHAR(100) NOT NULL REFERENCES assets(asset_id),
    cycle_id UUID NOT NULL REFERENCES inventory_cycles(cycle_id),
    inspector VARCHAR(100) NOT NULL,
    scan_time TIMESTAMPTZ DEFAULT NOW(),
    scan_location VARCHAR(200),
    actual_location VARCHAR(200),
    condition VARCHAR(50) DEFAULT 'Good',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate scanning in same cycle
    CONSTRAINT unique_asset_cycle UNIQUE (asset_id, cycle_id)
);

-- Create indexes
CREATE INDEX idx_logs_cycle ON inventory_logs(cycle_id);
CREATE INDEX idx_logs_asset ON inventory_logs(asset_id);
CREATE INDEX idx_logs_scan_time ON inventory_logs(scan_time DESC);

-- ====================================================
-- 4. ACTIVITY LOGS TABLE
-- ====================================================
CREATE TABLE activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    user_name VARCHAR(100),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_time ON activity_logs(created_at DESC);

-- ====================================================
-- 5. VIEW: Asset Inventory Status
-- ====================================================
CREATE OR REPLACE VIEW v_asset_inventory_status AS
SELECT 
    a.*,
    CASE 
        WHEN il.id IS NOT NULL THEN true 
        ELSE false 
    END as is_checked,
    il.cycle_id,
    il.inspector,
    il.scan_time,
    il.actual_location as checked_location,
    il.condition as checked_condition,
    ic.name as cycle_name,
    ic.is_active as in_active_cycle
FROM assets a
LEFT JOIN inventory_logs il ON a.asset_id = il.asset_id
LEFT JOIN inventory_cycles ic ON il.cycle_id = ic.cycle_id
WHERE ic.is_active = true OR ic.cycle_id IS NULL;

-- ====================================================
-- 6. FUNCTIONS
-- ====================================================

-- Function: Update cycle statistics
CREATE OR REPLACE FUNCTION update_cycle_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventory_cycles
    SET 
        checked_assets = (
            SELECT COUNT(DISTINCT asset_id) 
            FROM inventory_logs 
            WHERE cycle_id = NEW.cycle_id
        ),
        updated_at = NOW()
    WHERE cycle_id = NEW.cycle_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-update stats
CREATE TRIGGER trg_update_cycle_stats
AFTER INSERT OR UPDATE OR DELETE ON inventory_logs
FOR EACH ROW
EXECUTE FUNCTION update_cycle_stats();

-- ====================================================
-- 7. ROW LEVEL SECURITY
-- ====================================================
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anon key)
CREATE POLICY "Enable all for anon" ON assets FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON inventory_cycles FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON inventory_logs FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON activity_logs FOR ALL USING (true);

-- ====================================================
-- 8. GRANT PERMISSIONS
-- ====================================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- ====================================================
-- 9. SAMPLE DATA
-- ====================================================

-- Create default cycle
INSERT INTO inventory_cycles (name, description, is_active)
VALUES ('Kiểm kê Q1/2025', 'Kỳ kiểm kê quý 1 năm 2025', true);

-- Insert sample assets matching Google Sheet format
INSERT INTO assets (
    asset_id, name_vi, name_en, type, model, serial, tech_code,
    start_date, usage_period, end_date, customer, supplier, source,
    department, location, status, initial_value, current_value, notes
) VALUES 
(
    'TS001',
    'Máy tính để bàn Dell',
    'Dell Desktop Computer',
    'IT Equipment',
    'Optiplex 7090',
    'DL2024001',
    'TECH-001',
    '2024-01-15',
    60,
    '2029-01-15',
    'Nội bộ',
    'Dell Vietnam',
    'Mua mới',
    'IT',
    'Tầng 2 - Phòng 201',
    'Active',
    15000000,
    12000000,
    'Máy cấu hình cao cho developer'
),
(
    'TS002',
    'Bàn làm việc',
    'Office Desk',
    'Furniture',
    'IKEA-BEKANT',
    '',
    '',
    '2023-06-01',
    120,
    '2033-06-01',
    'Nội bộ',
    'IKEA',
    'Mua mới',
    'Admin',
    'Tầng 3 - Phòng 301',
    'Active',
    5000000,
    4000000,
    'Bàn điều chỉnh độ cao'
),
(
    'TS003',
    'Máy in laser',
    'Laser Printer',
    'IT Equipment',
    'HP LaserJet Pro M404n',
    'HP2024003',
    'TECH-003',
    '2024-03-01',
    48,
    '2028-03-01',
    'Nội bộ',
    'HP Vietnam',
    'Mua mới',
    'Accounting',
    'Tầng 2 - Phòng 205',
    'Active',
    8000000,
    7000000,
    'Máy in chung cho phòng kế toán'
);

-- ====================================================
-- 10. SUCCESS MESSAGE
-- ====================================================
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created: assets, inventory_cycles, inventory_logs, activity_logs';
    RAISE NOTICE 'Sample data inserted: 3 assets, 1 cycle';
END $$;