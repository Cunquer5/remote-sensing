# Evaluation Plan

## Objectives
1. Verify that the **sugarcane mask** correctly identifies known sugarcane fields in Betul.
2. Confirm that the **stress classification** (5 levels) produces spatially coherent patterns.
3. Provide visual and quantitative checks that can be reproduced by a stakeholder.

## 1. Mask Validation
- **Reference Data**: Download the agricultural parcel layer for Betul from OpenStreetMap (overpass API) as a GeoJSON.
- **Metric**: Intersection‑over‑Union (IoU) between the sugarcane mask and OSM sugarcane polygons.
- **Success Threshold**: IoU ≥ 0.70 (70 %).

## 2. Stress Classification Validation
- **Visual Inspection**: Load `betul_stress_map.png` in any image viewer; stress classes should appear as distinct colour bands without noisy speckles.
- **Statistical Consistency**:
  - Compute the mean VV/VH ratio per stress class; the means should be monotonically increasing from *Very Low* to *Very High*.
  - Use a simple ANOVA (p < 0.05) to confirm significant differences between classes.

## 3. Reproducibility Checklist
| Item | Done? |
|------|-------|
| Exported GeoJSON and PNG are present in `output/` | ✅ |
| Sample CSV downloaded and used for K‑means | ✅ |
| All scripts run without errors on a fresh Python env | ✅ |
| Documentation matches actual file paths | ✅ |

## 4. Reporting
- Assemble a short PDF report (`evaluation_report.pdf`) containing:
  1. Map screenshot with legend.
  2. IoU value and interpretation.
  3. Table of mean ratios per class + ANOVA p‑value.
  4. Brief discussion of limitations (no ground truth, reliance on unsupervised clustering).

---
*The evaluation is lightweight yet sufficient to demonstrate proof‑of‑concept for stakeholders.*
