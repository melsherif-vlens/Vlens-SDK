import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { sdkConfig } from "../appConfig";
import { useI18n } from '../localization/useI18n';

type StartNationalIdValidationPageProps = {
    onNext: (error?: string) => void;
}

export default function StartNationalIdValidationPage ({ onNext }: StartNationalIdValidationPageProps) {

    const { t } = useI18n();

    const handleScanId = () => {
        onNext();
    }
    
    return (
        <View style={styles.container}>

            {/* Logo and Title */}
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/vlens_logo_temp.png")} // Replace with your logo's path
                    style={styles.logo}
                />
                <Text style={styles.title}>{t('scanning_your_id_title')}</Text>
            </View>

            {/* Scanning Illustration */}
            <View style={styles.scanIllustrationContainer}>
                <View style={styles.scanIllustration}>
                    <Image
                        source={require('../assets/natioanl_id_vector.png')}
                        style={{ width: 200, height: 100, alignSelf: 'center', resizeMode: 'contain', margin: 20 }}
                    />
                </View>
            </View>

            {/* Instructions */}
            <Text style={styles.instructions}>{t('national_id_instructions')}</Text>

            {/* Tips Section */}
            <View style={styles.tipsContainer}>
                <Image source={require('../assets/info_icon.png')} style={{ width: 25, height: 25, paddingTop: 3, resizeMode: 'contain' }} />
                <View style={styles.tipsContent}>
                    <Text style={styles.tipsTitle}>{t('tip_title')}</Text>
                    <Text style={styles.tip}>{t('national_id_tip_1')}</Text>
                    <Text style={styles.tip}>{t('national_id_tip_2')}</Text>
                </View>
            </View>

            {/* Scan ID Button */}
            <View style={styles.scanButtonContainer}>
                <TouchableOpacity style={styles.scanButton} onPress={handleScanId}>
                    <Text style={styles.scanButtonText}>{t('scan_id')}</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{t('powered_by')}</Text>
                <Image source={require('../assets/vlens_logo_powered_by_icon.png')} style={styles.footerIcon} />
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: sdkConfig.colors.background,
        alignItems: "center",
    },
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
        lineHeight: 25,
    },
    tipsContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#EDF5FD",
        padding: 16,
        marginTop: 40,
        borderRadius: 16,
        borderColor: "#88BBEE",
        borderWidth: 1,
        width: "90%",
    },
    tipsContent: {
        marginLeft: 10,
    },
    tipsTitle: {
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 25,
        color: "#204061",
    },
    tip: {
        fontSize: 14,
        color: "#376DA3",
        marginTop: 5,
        lineHeight: 20,
    },
    scanButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
    },
    scanButton: {
        backgroundColor: sdkConfig.colors.primary,
        paddingVertical: 15,
        alignItems: "center",
        paddingHorizontal: 50,
        borderRadius: 16,
        marginVertical: 20,
        width: "100%",
    },
    scanButtonText: {
        color: sdkConfig.colors.light,
        fontSize: 16,
        fontWeight: "bold",
    },
    footerContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "90%",
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

