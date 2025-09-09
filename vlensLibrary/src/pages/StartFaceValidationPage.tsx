import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";

import { sdkConfig } from "../appConfig";
import { useI18n } from '../localization/useI18n';


type StartFaceValidationPageProps = {
    onNext: (errorCode?: string, error?: string) => void;
    onPrev: () => void;
}

export default function  StartFaceValidationPage ({ onNext, onPrev }: StartFaceValidationPageProps) {

    const { t } = useI18n();

    const handleScanFace = () => {
        onNext();
    }
    
    return (
        <View style={styles.container}>

            {/* Toolbar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onPrev}>
                    <Image source={require('../assets/arrow_left.png')} style={styles.headerIcon} />
                </TouchableOpacity>
            </View>

            {/* Logo and Title */}
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/vlens_logo_temp.png")}
                    style={styles.logo}
                />
                <Text style={styles.title}>{t('lets_verify_your_face')}</Text>
            </View>

            {/* Scanning Illustration */}
            <View style={styles.scanIllustrationContainer}>
                <View style={styles.scanIllustration}>
                    <Image
                        source={require('../assets/face_id_vector.png')}
                        style={{ width: 200, height: 100, alignSelf: 'center', resizeMode: 'contain', margin: 20 }}
                    />
                </View>
            </View>

            {/* Instructions */}
            <Text style={styles.instructions}>{t('face_instructions')}</Text>

            {/* Tips Section */}
            <View style={styles.tipsContainer}>
                <Image source={require('../assets/info_icon.png')} style={{ width: 25, height: 25, paddingTop: 3, resizeMode: 'contain' }} />
                <View style={styles.tipsContent}>
                    <Text style={styles.tipsTitle}>{t('tip_title')}</Text>
                    <Text style={styles.tip}>{t('face_tip_1')}</Text>
                </View>
            </View>

            {/* Scan ID Button */}
            <View style={styles.scanButtonContainer}>
                <TouchableOpacity style={styles.scanButton} onPress={handleScanFace}>
                    <Text style={styles.scanButtonText}>{t('start_scanning')}</Text>
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
    header: {
        height: '10%',
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        paddingTop: Platform.OS === 'ios' ? 60 : 0,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: 'black',
    },
    logoContainer: {
        alignItems: "center",
    },
    logo: {
        width: 150,
        height: 60,
        resizeMode: "contain",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: sdkConfig.colors.primary,
        marginTop: 5,
    },
    scanIllustrationContainer: {
        flex: 1,
        marginVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    scanIllustration: {
        marginVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: sdkConfig.colors.secondary,
        width: 160,
        height: 160,
        borderRadius: 80,
    },
    instructions: {
        textAlign: "center",
        fontSize: 16,
        color: sdkConfig.colors.accent,
        paddingHorizontal: 20,
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
        width: "85%",
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
        marginVertical: 10,
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

