
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useI18n } from '../../localization/useI18n';
import { sdkConfig } from '../../appConfig';

type NationalIdValidationErrorViewProps = {
    errorMsg: string;
    handleRetryScanning: () => void;
    handleExist: () => void;
}

export default function NationalIdValidationErrorView({errorMsg, handleRetryScanning, handleExist}: NationalIdValidationErrorViewProps) {
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

            {/* Error Illustration */}
            <View style={styles.scanIllustrationContainer}>
                <View style={styles.scanIllustration}>
                    <Image
                        source={require('../../assets/id_error_final.gif')}
                        style={{ width: 200, height: 100, alignSelf: 'center', resizeMode: 'contain', margin: 20 }}
                    />
                </View>
            </View>

            {/* Instructions */}
            <Text style={styles.instructions}>{errorMsg !== '' ? errorMsg : t('id_error_msg')}</Text>

            {/* Scan ID Button */}
            <View style={styles.scanButtonContainer}>
                <TouchableOpacity style={styles.scanButton} onPress={handleRetryScanning}>
                    <Text style={styles.scanButtonText}>{t('retry_scanning')}</Text>
                </TouchableOpacity>
            </View>

            {/* Exist Button */}
            <View style={styles.existButtonContainer}>
                <TouchableOpacity style={styles.existButton} onPress={handleExist}>
                    <Text style={styles.existButtonText}>{t('exist')}</Text>
                </TouchableOpacity>
            </View>

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
    },
    scanButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    scanButton: {
        backgroundColor: sdkConfig.colors.primary,
        paddingVertical: 15,
        alignItems: "center",
        paddingHorizontal: 50,
        borderRadius: 16,
        marginVertical: 5,
        marginHorizontal: 20,
        width: "90%",
    },
    scanButtonText: {
        color: sdkConfig.colors.light,
        fontSize: 16,
        fontWeight: "bold",
    },
    existButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    existButton: {
        backgroundColor: sdkConfig.colors.light,
        paddingVertical: 15,
        alignItems: "center",
        paddingHorizontal: 50,
        borderRadius: 16,
        marginVertical: 5,
        marginHorizontal: 20,
        width: "90%",
        borderWidth: 1,
        borderColor: sdkConfig.colors.primary
    },
    existButtonText: {
        color: sdkConfig.colors.primary,
        fontSize: 16,
        fontWeight: "bold",
    }
});