
import { StyleSheet, View, Text, Image } from 'react-native';
import { useI18n } from '../../localization/useI18n';
import { sdkConfig } from '../../appConfig';

export default function NationalIdValidationLoadingView() {
    const { t } = useI18n();

    return (
        <View style={styles.loadingContainer}>

            {/* Logo and Title */}
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/vlens_logo_temp.png")}
                    style={styles.logo}
                />
                <Text style={styles.title}>{t('scanning_your_id')}</Text>
            </View>

            {/* Scanning Illustration */}
            <View style={styles.scanIllustrationContainer}>
                <View style={styles.scanIllustration}>
                    <Image
                        source={require('../../assets/scan_id_final.gif')}
                        style={{ width: 200, height: 100, alignSelf: 'center', resizeMode: 'contain', margin: 20 }}
                    />
                </View>
            </View>

            {/* Instructions */}
            <Text style={styles.instructions}>{t('processing_your_id')}</Text>

            {/* Footer */}
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{t('powered_by')}</Text>
                <Image source={require('../../assets/vlens_logo_powered_by_icon.png')} style={styles.footerIcon} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: "center",
        margin: 20,
    },
    logo: {
        width: 150,
        height: 100,
        resizeMode: "contain",
        marginTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: sdkConfig.colors.primary,
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: sdkConfig.colors.background,
    },
    scanIllustrationContainer: {
        flex: 1,
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    scanIllustration: {
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: sdkConfig.colors.secondary,
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    instructions: {
        textAlign: "center",
        fontSize: 18,
        color: sdkConfig.colors.accent,
        paddingHorizontal: 40,
        marginBottom: 80,
        lineHeight: 25,
    },
    footerContainer: {
        height: 60,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginBottom: 40,
    },
    footerText: {
        fontSize: 14,
        color: sdkConfig.colors.accent,
        alignItems: "center",
        paddingTop: 4,
        paddingEnd: 5,
    },
    footerIcon: {
        width: 60,
        height: 20,
        resizeMode: "contain",
    }
});