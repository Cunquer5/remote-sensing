# CaneSense AI - ML Pipeline Guide

## ML Architecture Overview

CaneSense AI uses machine learning at three key stages:

1. **Crop Classification** - Sugarcane vs. Non-sugarcane
2. **Growth Stage Detection** - Phenological stage identification
3. **Moisture Stress Assessment** - Composite stress scoring

## 1. Crop Classification Pipeline

### Input Features

From Sentinel-2 and Landsat imagery:

```
Spectral Features:
├── Vegetation Indices (NDVI, NDMI, NDWI, EVI, GNDVI, SAVI)
├── Band Ratios (NIR/Red, SWIR1/NIR, etc.)
├── Texture Features (GLCM)
├── Temporal Features (index time-series)
└── Auxiliary Data (elevation, slope from DEM)

From Sentinel-1 SAR:
├── VV Backscatter
├── VH Backscatter
├── VV/VH Ratio
└── Temporal Coherence

Environmental Context:
├── NDVI trend (rate of change)
├── Phenology seasonality
└── Regional crop calendar
```

### Model Training

**Dataset Requirements:**
- Minimum 500 labeled samples per class
- Preferably 1000+ for robust training
- Geographic distribution across Baitul study area
- Multiple seasons of data

**Training Data Sources:**
1. Manual field surveys (GPS location + photos)
2. High-resolution imagery (Planet Labs, Airbus)
3. Farmer reports and field history
4. Regional agricultural statistics

**Feature Engineering Code Example:**

```python
def extract_features(sentinel2_image, dem_elevation):
    """Extract ML features from Sentinel-2 and auxiliary data"""
    
    # Calculate spectral indices
    ndvi = (image.B8 - image.B4) / (image.B8 + image.B4)
    ndmi = (image.B8 - image.B11) / (image.B8 + image.B11)
    ndwi = (image.B8a - image.B11) / (image.B8a + image.B11)
    evi = 2.5 * (image.B8 - image.B4) / (image.B8 + 6*image.B4 - 7.5*image.B2 + 1)
    
    # Add raw bands
    features = np.stack([
        image.B2, image.B3, image.B4, image.B5,
        image.B6, image.B7, image.B8, image.B8a,
        image.B11, image.B12,  # SWIR bands
        ndvi, ndmi, ndwi, evi,
        dem_elevation
    ], axis=-1)
    
    return features

class CropClassifier:
    def __init__(self, model_type='xgboost'):
        self.model_type = model_type
        self.model = None
        
    def train(self, X_train, y_train, validation_split=0.2):
        """Train crop classification model"""
        
        if self.model_type == 'xgboost':
            self.model = XGBClassifier(
                n_estimators=500,
                max_depth=10,
                learning_rate=0.1,
                subsample=0.8,
                colsample_bytree=0.8,
                random_state=42
            )
        elif self.model_type == 'random_forest':
            self.model = RandomForestClassifier(
                n_estimators=500,
                max_depth=20,
                min_samples_split=10,
                random_state=42
            )
        elif self.model_type == 'svm':
            self.model = SVC(kernel='rbf', probability=True)
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(validation_data)
        accuracy = accuracy_score(y_val, y_pred)
        print(f"Model Accuracy: {accuracy:.3f}")
        
    def predict_with_confidence(self, features):
        """Get predictions and confidence scores"""
        predictions = self.model.predict(features)
        probabilities = self.model.predict_proba(features)
        confidence = np.max(probabilities, axis=1) * 100
        return predictions, confidence
```

### Model Evaluation

**Classification Metrics:**

| Metric | Formula | Use Case |
|--------|---------|----------|
| Accuracy | (TP+TN)/(TP+TN+FP+FN) | Overall correctness |
| Precision | TP/(TP+FP) | False positive cost matters |
| Recall | TP/(TP+FN) | Missing sugarcane is costly |
| F1-Score | 2×(Precision×Recall)/(Precision+Recall) | Balanced metric |

**Target Metrics for Production:**
- Overall Accuracy: >90%
- Precision: >88% (minimize false positives)
- Recall: >92% (minimize false negatives - miss less sugarcane)
- F1-Score: >90%

**Confusion Matrix Target:**
```
              Predicted
           Sugarcane  Other
Actual S.     918       12    (Recall: 98.7%)
       Other   5      765    (Precision: 99.5%)
```

## 2. Growth Stage Detection

### Time-Series Approach

```python
class GrowthStageDetector:
    """Detect sugarcane growth stage from temporal NDVI"""
    
    STAGE_THRESHOLDS = {
        'establishment': {'ndvi_max': 0.45, 'days_range': (60, 80)},
        'early_vegetative': {'ndvi_max': 0.65, 'days_range': (60, 90)},
        'tillering': {'ndvi_max': 0.72, 'days_range': (60, 90)},
        'grand_growth': {'ndvi_max': 0.80, 'days_range': (120, 150)},
        'maturity': {'ndvi_max': 0.78, 'days_range': (60, 90)},
        'harvest': {'ndvi_max': 0.70, 'days_range': (0, 30)},
    }
    
    def detect_stage(self, ndvi_timeseries, planting_date):
        """Identify current growth stage"""
        
        # Calculate days since planting
        current_date = datetime.now()
        days_elapsed = (current_date - planting_date).days
        
        # Get current NDVI
        current_ndvi = ndvi_timeseries[-1]
        
        # Calculate NDVI rate of change
        ndvi_trend = np.polyfit(range(-7, 0), ndvi_timeseries[-7:], 1)[0]
        
        # Match stage based on multiple criteria
        best_match = None
        best_confidence = 0
        
        for stage, thresholds in self.STAGE_THRESHOLDS.items():
            # Confidence factors
            ndvi_match = 1 - abs(current_ndvi - thresholds['ndvi_max']) / thresholds['ndvi_max']
            
            days_min, days_max = thresholds['days_range']
            days_normalized = days_elapsed / ((days_min + days_max) / 2)
            days_match = 1 - abs(days_normalized - 1.0)
            
            # Combine confidence
            confidence = (0.6 * ndvi_match + 0.4 * days_match) * 100
            
            if confidence > best_confidence:
                best_confidence = confidence
                best_match = stage
        
        return best_match, best_confidence
```

### Phenology Model Integration

Combine stage detection with regional phenology models:

```python
class PhenologyModel:
    """Regional sugarcane phenology reference"""
    
    BAITUL_PHENOLOGY = {
        'month': [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        'typical_stage': [
            'harvest', 'establishment', 'establishment', 'early_vegetative',
            'tillering', 'grand_growth', 'grand_growth', 'grand_growth',
            'maturity', 'harvest'
        ],
        'expected_ndvi': [0.55, 0.35, 0.45, 0.55, 0.65, 0.75, 0.78, 0.77, 0.75, 0.60]
    }
    
    def validate_detected_stage(self, detected_stage, current_month):
        """Cross-validate detected stage with regional phenology"""
        expected_stage = self.BAITUL_PHENOLOGY['typical_stage'][current_month - 1]
        
        if detected_stage == expected_stage:
            validation_confidence = 95
        elif self.is_adjacent_stage(detected_stage, expected_stage):
            validation_confidence = 75
        else:
            validation_confidence = 50
        
        return validation_confidence
```

## 3. Moisture Stress Detection

### Composite Stress Scoring

```python
class MoistureStressAnalyzer:
    """Multi-index moisture stress assessment"""
    
    def calculate_stress_score(self, field_data):
        """
        Composite stress score combining multiple indicators
        Output: 0-100 scale (0=no stress, 100=severe stress)
        """
        
        indices = field_data['indices']
        weather = field_data['weather']
        field_history = field_data['field_history']
        
        # 1. NDVI-based stress (0-1 normalized)
        expected_ndvi = self._get_expected_ndvi(field_data['growth_stage'])
        ndvi_stress = max(0, (expected_ndvi - indices['ndvi']) / expected_ndvi * 1.2)
        ndvi_stress = min(1.0, ndvi_stress)
        
        # 2. NDMI-based stress (moisture content)
        expected_ndmi = self._get_expected_ndmi(field_data['growth_stage'])
        ndmi_stress = max(0, (expected_ndmi - indices['ndmi']) / expected_ndmi * 1.2)
        ndmi_stress = min(1.0, ndmi_stress)
        
        # 3. NDWI-based stress (water availability)
        expected_ndwi = self._get_expected_ndwi(field_data['growth_stage'])
        ndwi_stress = max(0, (expected_ndwi - indices['ndwi']) / expected_ndwi * 1.2)
        ndwi_stress = min(1.0, ndwi_stress)
        
        # 4. Temperature stress
        lst_stress = self._calculate_temperature_stress(
            indices.get('lst', 30),
            field_data['growth_stage']
        )
        
        # 5. Water balance (rainfall - ET)
        water_balance = weather['rainfall'] - weather['reference_et']
        water_stress = max(0, -water_balance / 50)  # Normalize by typical ET
        water_stress = min(1.0, water_stress)
        
        # 6. Historical stress trajectory
        history_stress = self._analyze_stress_trajectory(field_history)
        
        # Weighted composite
        composite_stress = (
            0.30 * ndvi_stress +
            0.35 * ndmi_stress +
            0.20 * ndwi_stress +
            0.10 * lst_stress +
            0.05 * history_stress
        )
        
        # Scale to 0-100
        stress_score = int(composite_stress * 100)
        
        # Classify level
        if stress_score < 20:
            level = 'no_stress'
            confidence = 92
        elif stress_score < 40:
            level = 'low'
            confidence = 88
        elif stress_score < 60:
            level = 'moderate'
            confidence = 85
        elif stress_score < 80:
            level = 'high'
            confidence = 82
        else:
            level = 'severe'
            confidence = 79
        
        # Adjust confidence based on data quality
        if field_data.get('cloud_cover', 0) > 20:
            confidence -= 10
        if field_data.get('days_since_observation', 0) > 10:
            confidence -= 5
        
        return {
            'score': stress_score,
            'level': level,
            'confidence': confidence,
            'contributing_factors': {
                'ndvi': f"{ndvi_stress*100:.1f}%",
                'ndmi': f"{ndmi_stress*100:.1f}%",
                'ndwi': f"{ndwi_stress*100:.1f}%",
                'temperature': f"{lst_stress*100:.1f}%",
                'water_balance': f"{water_stress*100:.1f}%",
            }
        }
    
    def _get_expected_ndvi(self, growth_stage):
        """Get expected NDVI for growth stage"""
        expectations = {
            'establishment': 0.35,
            'early_vegetative': 0.55,
            'tillering': 0.68,
            'grand_growth': 0.78,
            'maturity': 0.75,
            'harvest': 0.60,
        }
        return expectations.get(growth_stage, 0.70)
```

## 4. Irrigation Advisory Engine

```python
class IrrigationAdvisoryEngine:
    """Rule-based + AI irrigation recommendation"""
    
    def generate_advisory(self, field_data):
        """Generate irrigation recommendation"""
        
        stress_analysis = field_data['stress_analysis']
        growth_stage = field_data['growth_stage']
        weather = field_data['weather']
        
        # Base recommendation on stress level
        if stress_analysis['score'] > 80:
            rec_status = 'required'
            priority = 'critical'
            recommendation = 'URGENT: Irrigate immediately'
        elif stress_analysis['score'] > 65:
            rec_status = 'required'
            priority = 'high'
            recommendation = 'Irrigate within 2-3 days'
        elif stress_analysis['score'] > 45:
            rec_status = 'monitor'
            priority = 'medium'
            recommendation = 'Monitor closely. Prepare for irrigation'
        elif stress_analysis['score'] > 30:
            rec_status = 'can_delay'
            priority = 'low'
            recommendation = 'Irrigation can be delayed'
        else:
            rec_status = 'not_required'
            priority = 'low'
            recommendation = 'No immediate irrigation need'
        
        # Adjust based on rainfall forecast
        if weather.get('rainfall_forecast_7d', 0) > 20:
            if priority != 'critical':
                priority = 'low'
                rec_status = 'can_delay'
                recommendation += ' - Rainfall expected'
        
        # Stage-specific recommendations
        stage_requirements = self._get_water_requirement(growth_stage)
        water_req = stage_requirements['requirement_mm']
        
        # Calculate confidence
        confidence = stress_analysis['confidence']
        if weather.get('rainfall_forecast_7d') is not None:
            confidence += 5  # Forecast data improves confidence
        
        return {
            'status': rec_status,
            'priority': priority,
            'recommendation': recommendation,
            'estimated_water_requirement': water_req,
            'reason': self._build_reason_string(field_data),
            'confidence': min(100, confidence),
            'contributing_indicators': self._get_indicators(field_data),
            'data_timestamp': datetime.now().isoformat(),
        }
    
    def _get_water_requirement(self, growth_stage):
        """Estimate irrigation water requirement"""
        requirements = {
            'establishment': {'requirement_mm': 25, 'interval_days': 7},
            'early_vegetative': {'requirement_mm': 30, 'interval_days': 7},
            'tillering': {'requirement_mm': 35, 'interval_days': 10},
            'grand_growth': {'requirement_mm': 40, 'interval_days': 12},
            'maturity': {'requirement_mm': 25, 'interval_days': 15},
        }
        return requirements.get(growth_stage, {'requirement_mm': 30, 'interval_days': 10})
```

## 5. Model Deployment & Inference

### Containerization

```dockerfile
# Dockerfile for ML service
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY models/ ./models/
COPY canesense_ml/ ./canesense_ml/

CMD ["python", "-m", "canesense_ml.inference_server"]
```

### Edge Inference Options

1. **Local Python Service** - For development
2. **TensorFlow Lite** - Optimized for embedded systems
3. **ONNX Runtime** - Cross-platform model inference
4. **GEE Processing** - Direct satellite computing

## 6. Model Versioning & Updates

```
models/
├── v1.0/
│   ├── crop_classifier_xgb.pkl
│   ├── growth_stage_mlp.h5
│   ├── stress_ensemble.pkl
│   └── metadata.json
├── v1.1/
│   └── ...
└── production/  → symlink to latest validated version
```

## Monitoring & Retraining

```python
class ModelMonitoring:
    """Track model performance in production"""
    
    def log_prediction(self, field_id, prediction, actual_value=None, confidence=None):
        """Log prediction for monitoring"""
        record = {
            'timestamp': datetime.now(),
            'field_id': field_id,
            'prediction': prediction,
            'actual': actual_value,
            'confidence': confidence,
            'model_version': current_version
        }
        logging.info(record)
    
    def trigger_retraining(self):
        """Retrain if performance degrades"""
        # Monthly retraining
        # Compare holdout test set performance
        # If accuracy drops >2%, retrain
        pass
```

---

**Document Version:** 1.0  
**Status:** DEMO MODE - Framework for real ML models  
**Last Updated:** 2026-09-21
