INSERT INTO devices (device_id, device_name, mac_address, chip_model, firmware_version, location_label)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ESP32_Node_Lab_01', 'AA:BB:CC:DD:EE:FF', 'ESP32-D0WDQ6', 'v1.4.2', 'Node-Alpha');

INSERT INTO sensors (sensor_id, device_id, sensor_name, sensor_type, gpio_pin, unit_of_measure)
VALUES 
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Room_Temperature', 'DHT22', 4, 'Celsius'),
(2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Room_Humidity', 'DHT22', 4, '%');

INSERT INTO device_metrics (device_id, wifi_rssi_dbm, free_heap_bytes, battery_voltage, cpu_temperature, uptime_seconds)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -62, 184320, 4.12, 42.10, 86400);