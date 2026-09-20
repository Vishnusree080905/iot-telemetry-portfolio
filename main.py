import os
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI(
    title="IoT Microcontroller Telemetry Ingestion API",
    description="Ingest time-series sensor data and hardware metrics from edge nodes into PostgreSQL.",
    version="1.0.0"
)

# Database Connection Helper
DB_URI = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/iot_db")

def get_db_connection():
    try:
        conn = psycopg2.connect(DB_URI, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {str(e)}"
        )

# Pydantic Schemas for Payload Validation
class SensorReadingPayload(BaseModel):
    sensor_id: int
    reading_value: float = Field(..., description="Numerical sensor measurement")

class DeviceMetricsPayload(BaseModel):
    wifi_rssi_dbm: Optional[int] = Field(None, example=-65)
    free_heap_bytes: Optional[int] = Field(None, example=184320)
    battery_voltage: Optional[float] = Field(None, example=4.12)
    cpu_temperature: Optional[float] = Field(None, example=41.5)
    uptime_seconds: Optional[int] = Field(None, example=86400)

class TelemetryIngestRequest(BaseModel):
    device_id: str = Field(..., example="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
    readings: list[SensorReadingPayload]
    metrics: Optional[DeviceMetricsPayload] = None

# API Ingestion Endpoint
@app.post("/api/v1/telemetry", status_code=status.HTTP_201_CREATED)
async def ingest_telemetry(payload: TelemetryIngestRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Insert High-Frequency Sensor Readings
        for item in payload.readings:
            cursor.execute(
                """
                INSERT INTO sensor_readings (sensor_id, reading_value)
                VALUES (%s, %s);
                """,
                (item.sensor_id, item.reading_value)
            )

        # 2. Insert Device Health Metrics (if provided in payload)
        if payload.metrics:
            m = payload.metrics
            cursor.execute(
                """
                INSERT INTO device_metrics (
                    device_id, wifi_rssi_dbm, free_heap_bytes, battery_voltage, cpu_temperature, uptime_seconds
                ) VALUES (%s, %s, %s, %s, %s, %s);
                """,
                (
                    payload.device_id,
                    m.wifi_rssi_dbm,
                    m.free_heap_bytes,
                    m.battery_voltage,
                    m.cpu_temperature,
                    m.uptime_seconds
                )
            )

        conn.commit()
        return {"status": "success", "message": "Telemetry batch ingested successfully"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process telemetry payload: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "IoT Telemetry Ingestion API"}