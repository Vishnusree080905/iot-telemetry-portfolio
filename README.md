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