CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE devices (
    device_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_name VARCHAR(100) NOT NULL,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    chip_model VARCHAR(50) NOT NULL,
    firmware_version VARCHAR(20) NOT NULL,
    location_label VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sensors (
    sensor_id SERIAL PRIMARY KEY,
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    sensor_name VARCHAR(50) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    gpio_pin INT NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sensor_readings (
    reading_id BIGSERIAL,
    sensor_id INT NOT NULL REFERENCES sensors(sensor_id) ON DELETE CASCADE,
    reading_value DECIMAL(10, 4) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reading_id, recorded_at)
) PARTITION BY RANGE (recorded_at);

CREATE INDEX idx_sensor_readings_lookup ON sensor_readings (sensor_id, recorded_at DESC);

CREATE TABLE device_metrics (
    metric_id BIGSERIAL,
    device_id UUID NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    wifi_rssi_dbm INT,
    free_heap_bytes INT,
    battery_voltage DECIMAL(4, 2),
    cpu_temperature DECIMAL(4, 2),
    uptime_seconds BIGINT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (metric_id, recorded_at)
) PARTITION BY RANGE (recorded_at);

CREATE INDEX idx_device_metrics_lookup ON device_metrics (device_id, recorded_at DESC);

CREATE TABLE system_events (
    event_id BIGSERIAL PRIMARY KEY,
    device_id UUID REFERENCES devices(device_id) ON DELETE CASCADE,
    event_level VARCHAR(20) CHECK (event_level IN ('INFO', 'WARN', 'CRITICAL', 'PANIC')),
    event_code VARCHAR(50) NOT NULL,
    message TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
