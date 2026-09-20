-- Detect low-memory & Wi-Fi signal instability
SELECT d.device_name, d.chip_model, m.wifi_rssi_dbm, m.free_heap_bytes, m.recorded_at
FROM device_metrics m
JOIN devices d ON m.device_id = d.device_id
WHERE m.free_heap_bytes < 32000 OR m.wifi_rssi_dbm < -80
ORDER BY m.recorded_at DESC;

-- Time-bucket aggregate queries (15-minute intervals)
SELECT 
    s.sensor_name,
    s.unit_of_measure,
    DATE_TRUNC('hour', r.recorded_at) + INTERVAL '15 min' * (EXTRACT(MINUTE FROM r.recorded_at)::INT / 15) AS time_bucket,
    ROUND(AVG(r.reading_value), 2) AS avg_reading
FROM sensor_readings r
JOIN sensors s ON r.sensor_id = s.sensor_id
WHERE r.recorded_at >= NOW() - INTERVAL '24 hours'
GROUP BY s.sensor_name, s.unit_of_measure, time_bucket
ORDER BY time_bucket DESC;