import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import path from 'path';

// Register fonts for the certificate
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

const bgPath = path.join(process.cwd(), 'src/components/certificate/cert-background.png');

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  // Name — centered, positioned where the blank space is
  nameContainer: {
    position: 'absolute',
    top: 280,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  name: {
    fontSize: 32,
    color: '#1a1a1a',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  nameZh: {
    fontSize: 16,
    color: '#606090',
    marginTop: 4,
  },
  // Certification ID — bottom left area
  certIdContainer: {
    position: 'absolute',
    bottom: 62,
    left: 82,
  },
  certId: {
    fontSize: 9,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  // Validity period — next to cert ID
  validityContainer: {
    position: 'absolute',
    bottom: 62,
    left: 320,
  },
  validity: {
    fontSize: 9,
    color: '#333',
    fontFamily: 'Helvetica',
  },
  // Program Director signature
  signatureContainer: {
    position: 'absolute',
    bottom: 102,
    left: 175,
  },
  signature: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
  },
  // Verification URL — bottom center
  verifyContainer: {
    position: 'absolute',
    bottom: 38,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  verifyText: {
    fontSize: 7,
    color: '#999',
  },
});

interface CertificatePDFProps {
  fullName: string;
  fullNameZh?: string;
  certificateType: string;
  certificateTypeLabel: string;
  certificateNumber: string;
  issuedDate: string;
  expirationDate: string;
  verificationCode: string;
  verificationUrl: string;
}

export function CertificatePDF({
  fullName,
  fullNameZh,
  certificateNumber,
  issuedDate,
  expirationDate,
  verificationUrl,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Background template image */}
        <Image src={bgPath} style={styles.background} />

        {/* Name overlay */}
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{fullName}</Text>
          {fullNameZh && <Text style={styles.nameZh}>{fullNameZh}</Text>}
        </View>

        {/* Certification ID */}
        <View style={styles.certIdContainer}>
          <Text style={styles.certId}>{certificateNumber}</Text>
        </View>

        {/* Validity dates */}
        <View style={styles.validityContainer}>
          <Text style={styles.validity}>{issuedDate} – {expirationDate}</Text>
        </View>

        {/* Verification URL */}
        <View style={styles.verifyContainer}>
          <Text style={styles.verifyText}>
            Verify at: {verificationUrl}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
