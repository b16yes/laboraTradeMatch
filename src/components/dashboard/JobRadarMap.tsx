import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { JobListing, LocationCoordinates } from '../../types/models';
import { LocationService } from '../../services/locationService';

interface JobRadarMapProps {
  currentLocation: LocationCoordinates;
  jobs: JobListing[];
  radiusKm: number;
  onSelectJob: (job: JobListing) => void;
}

const CANVAS_SIZE = 280;

export const JobRadarMap: React.FC<JobRadarMapProps> = ({
  currentLocation,
  jobs,
  radiusKm,
  onSelectJob,
}) => {
  return (
    <View style={styles.radarContainer}>
      <View style={styles.radarHeader}>
        <View style={styles.liveTag}>
          <View style={styles.livePulseDot} />
          <Text style={styles.liveTagText}>GPS RADAR ACTIVE</Text>
        </View>
        <Text style={styles.radiusText}>Range: {radiusKm} km radius</Text>
      </View>

      <View style={styles.radarCanvas}>
        {/* Concentric distance rings */}
        <View style={[styles.ring, { width: CANVAS_SIZE, height: CANVAS_SIZE, borderRadius: CANVAS_SIZE / 2 }]} />
        <View style={[styles.ring, { width: CANVAS_SIZE * 0.7, height: CANVAS_SIZE * 0.7, borderRadius: (CANVAS_SIZE * 0.7) / 2 }]} />
        <View style={[styles.ring, { width: CANVAS_SIZE * 0.4, height: CANVAS_SIZE * 0.4, borderRadius: (CANVAS_SIZE * 0.4) / 2 }]} />

        {/* Crosshair axis lines */}
        <View style={styles.axisX} />
        <View style={styles.axisY} />

        {/* User Center GPS Marker */}
        <View style={styles.centerDotOuter}>
          <View style={styles.centerDotInner} />
        </View>

        {/* Job Blips on Radar */}
        {jobs.map((job) => {
          const coords = LocationService.getRadarCoordinates(currentLocation, job.location, radiusKm);
          if (!coords) return null;

          return (
            <TouchableOpacity
              key={job.id}
              style={[
                styles.jobBlip,
                {
                  transform: [
                    { translateX: coords.x },
                    { translateY: coords.y },
                  ],
                },
              ]}
              onPress={() => onSelectJob(job)}
              activeOpacity={0.7}
            >
              <View style={[styles.blipDot, job.urgency === 'Immediate' && styles.blipDotUrgent]} />
              <View style={styles.blipLabelContainer}>
                <Text style={styles.blipText}>£{job.budget}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.radarFooter}>
        <Text style={styles.locationText}>
          📍 {currentLocation.addressName || 'Current GPS Location'} ({jobs.length} jobs detected)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  radarContainer: {
    backgroundColor: '#020617',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginVertical: 8,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveTagText: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  radiusText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  radarCanvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    borderRadius: CANVAS_SIZE / 2,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    borderStyle: 'dashed',
  },
  axisX: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  axisY: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  centerDotOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38BDF8',
  },
  jobBlip: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  blipDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#38BDF8',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  blipDotUrgent: {
    backgroundColor: '#EF4444',
  },
  blipLabelContainer: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: '#475569',
  },
  blipText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '800',
  },
  radarFooter: {
    marginTop: 12,
  },
  locationText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '500',
  },
});
