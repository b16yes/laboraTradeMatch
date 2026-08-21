import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface ProfileQRCodeProps {
  userId: string;
  userName?: string;
}

export const ProfileQRCode: React.FC<ProfileQRCodeProps> = ({
  userId,
  userName = 'Marcus Vance',
}) => {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `https://tradematch.app/invite?ref=${userId}`;

  const handleCopyLink = () => {
    setCopied(true);
    Alert.alert('Link Copied!', `Referral link copied to clipboard:\n${inviteUrl}`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Unique Referral QR Code</Text>
      <Text style={styles.subtitle}>
        Scan on site or share your link. Earn 1 Lottery Ticket for every tradesman who joins!
      </Text>

      {/* Styled High-Contrast QR Code Visualizer Grid */}
      <View style={styles.qrWrapper}>
        <View style={styles.qrCanvas}>
          {/* Corner Position Detection Patterns */}
          <View style={[styles.cornerPattern, styles.topLeft]} />
          <View style={[styles.cornerPattern, styles.topRight]} />
          <View style={[styles.cornerPattern, styles.bottomLeft]} />

          {/* Matrix Cells Pattern */}
          <View style={styles.matrixContainer}>
            <View style={styles.matrixRow}>
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
            </View>
            <View style={styles.matrixRow}>
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
            </View>
            <View style={styles.matrixRow}>
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
              {/* Center Brand Badge */}
              <View style={styles.centerBadge}>
                <Text style={styles.centerBadgeText}>TM</Text>
              </View>
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
            </View>
            <View style={styles.matrixRow}>
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
            </View>
            <View style={styles.matrixRow}>
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
              <View style={[styles.matrixDot, styles.dotActive]} />
              <View style={styles.matrixDot} />
            </View>
          </View>
        </View>

        <Text style={styles.userRefText}>Ref ID: {userId}</Text>
      </View>

      {/* Invite Link Box */}
      <View style={styles.linkBox}>
        <Text style={styles.urlText} numberOfLines={1}>
          {inviteUrl}
        </Text>
        <TouchableOpacity
          style={[styles.copyBtn, copied && styles.copyBtnDone]}
          onPress={handleCopyLink}
        >
          <Text style={styles.copyBtnText}>{copied ? '✓ Copied' : 'Copy Link'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  qrWrapper: {
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    marginBottom: 14,
  },
  qrCanvas: {
    width: 170,
    height: 170,
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cornerPattern: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: '#38BDF8',
    borderRadius: 6,
  },
  topLeft: {
    top: 10,
    left: 10,
  },
  topRight: {
    top: 10,
    right: 10,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
  },
  matrixContainer: {
    width: 110,
    height: 110,
    justifyContent: 'space-between',
  },
  matrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matrixDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#1E293B',
  },
  dotActive: {
    backgroundColor: '#38BDF8',
  },
  centerBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  centerBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  userRefText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 10,
    letterSpacing: 0.5,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
  },
  urlText: {
    flex: 1,
    fontSize: 11,
    color: '#CBD5E1',
    marginRight: 8,
  },
  copyBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnDone: {
    backgroundColor: '#15803D',
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

export default ProfileQRCode;
