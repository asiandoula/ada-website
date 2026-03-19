import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  border: {
    border: '3pt solid #606090',
    padding: 40,
    height: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  orgName: {
    fontSize: 22,
    color: '#606090',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  certTitle: {
    fontSize: 16,
    color: '#0c2231',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    borderBottom: '1pt solid #606090',
    marginVertical: 20,
    width: '60%',
    alignSelf: 'center',
  },
  body: {
    textAlign: 'center',
    marginVertical: 20,
  },
  certifyText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    color: '#0c2231',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nameZh: {
    fontSize: 18,
    color: '#606090',
    marginBottom: 20,
  },
  description: {
    fontSize: 11,
    color: '#444',
    lineHeight: 1.6,
    maxWidth: 400,
    alignSelf: 'center',
  },
  details: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailColumn: {
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: 8,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 11,
    color: '#0c2231',
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 100,
    right: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureLine: {
    borderTop: '1pt solid #ccc',
    width: 150,
    paddingTop: 4,
    textAlign: 'center',
  },
  signatureLabel: {
    fontSize: 8,
    color: '#999',
  },
  verification: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  verifyText: {
    fontSize: 8,
    color: '#999',
  },
  verifyUrl: {
    fontSize: 9,
    color: '#606090',
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
  certificateTypeLabel,
  certificateNumber,
  issuedDate,
  expirationDate,
  verificationUrl,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.header}>
            <Text style={styles.orgName}>ASIAN DOULA ALLIANCE</Text>
            <Text style={styles.certTitle}>{certificateTypeLabel}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.body}>
            <Text style={styles.certifyText}>
              This is to certify that
            </Text>
            <Text style={styles.name}>{fullName}</Text>
            {fullNameZh && <Text style={styles.nameZh}>{fullNameZh}</Text>}
            <Text style={styles.description}>
              has successfully completed all requirements and is hereby recognized
              as a certified professional by the Asian Doula Alliance.
            </Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Certificate No.</Text>
              <Text style={styles.detailValue}>{certificateNumber}</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Date of Issue</Text>
              <Text style={styles.detailValue}>{issuedDate}</Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Valid Through</Text>
              <Text style={styles.detailValue}>{expirationDate}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Authorized Signatory</Text>
            </View>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Date</Text>
            </View>
          </View>

          <View style={styles.verification}>
            <Text style={styles.verifyText}>
              Verify this certificate at:
            </Text>
            <Text style={styles.verifyUrl}>{verificationUrl}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
