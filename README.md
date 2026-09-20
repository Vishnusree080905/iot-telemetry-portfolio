# IoT Hardware Telemetry & Observability Engine

A production-ready relational database schema built in PostgreSQL for micro-controller time-series telemetry, device health monitoring, and exception logging.

## Architecture
- **Devices:** Tracks hardware MAC address, firmware revisions, and deployment sites.
- **Sensors:** Decouples GPIO configurations and measurement units.
- **Sensor Readings:** High-frequency, partitioned time-series sensor data.
- **Device Metrics:** System health telemetry (free heap, RSSI, battery level).
- **System Events:** Diagnostics and exception logs.

## How to Run
1. Import `schema.sql` into a PostgreSQL database instance.
2. Seed mock telemetry using `sample_data.sql`.
3. Execute analytical queries from `queries.sql`.
## Ingestion Pipeline (FastAPI)

An API service is included in `main.py` to accept JSON telemetry streams directly from microcontrollers (e.g., ESP32, STM32, or Raspberry Pi Pico).

### Sample Hardware Payload (HTTP POST `/api/v1/telemetry`)
```json
{
  "device_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "readings": [
    {"sensor_id": 1, "reading_value": 26.45},
    {"sensor_id": 2, "reading_value": 58.20}
  ],
  "metrics": {
    "wifi_rssi_dbm": -62,
    "free_heap_bytes": 184320,
    "battery_voltage": 4.12,
    "cpu_temperature": 42.10,
    "uptime_seconds": 86400
  }
}