import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface SystemStatus {
  status: string;
  version: string;
  uptime: number;
  ai_model_status: string;
}

export interface AircraftType {
  id: string;
  name: string;
  category: 'Fixed Wing' | 'Multirotor' | 'VTOL' | 'Helicopter';
  manufacturer?: string;
  model?: string;
}

export interface FlightAnalysisRequest {
  file: File;
  aircraft_type?: string;
  analysis_options?: {
    include_risk_assessment: boolean;
    include_performance_metrics: boolean;
    include_maintenance_alerts: boolean;
  };
}

export interface FlightAnalysisResult {
  flight_id: string;
  aircraft_type: AircraftType;
  flight_duration: number;
  total_distance: number;
  max_altitude: number;
  max_speed: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  alerts: Array<{
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: string;
  }>;
  telemetry_summary: {
    battery_min: number;
    battery_max: number;
    vibration_max: number;
    temperature_max: number;
  };
  performance_metrics: {
    efficiency_score: number;
    stability_score: number;
    precision_score: number;
  };
}

// API Functions
export const systemAPI = {
  getStatus: async (): Promise<SystemStatus> => {
    const response = await api.get('/system/status');
    return response.data;
  },
};

export const aircraftAPI = {
  getTypes: async (): Promise<AircraftType[]> => {
    const response = await api.get('/aircraft-types');
    return response.data;
  },
};

export const flightAPI = {
  analyze: async (request: FlightAnalysisRequest): Promise<FlightAnalysisResult> => {
    const formData = new FormData();
    formData.append('file', request.file);
    
    if (request.aircraft_type) {
      formData.append('aircraft_type', request.aircraft_type);
    }
    
    if (request.analysis_options) {
      formData.append('analysis_options', JSON.stringify(request.analysis_options));
    }

    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

export default api;