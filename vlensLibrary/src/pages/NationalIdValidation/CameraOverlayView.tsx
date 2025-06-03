import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { useI18n } from '../../localization/useI18n';

const { width } = Dimensions.get('window');
const cardWidth = width;
const cardHeight = cardWidth * 0.6;

type Props = { step: "front" | "flip" | "back" };

export default function CameraOverlayView({ step }: Props) {
    const { t } = useI18n();
    if (step === 'flip') {
        return (
            <View style={styles.overlay}>
                <Image
                    source={require('../../assets/id_flip.gif')}
                    style={styles.cardOutlineImage}
                />
                <Text style={styles.instructionText}>
                    {t('id_flip_msg')}
                </Text>
            </View>
        );
    } else if (step === 'back') {
        return (
            <View style={styles.overlay}>
                <Image
                    source={require('../../assets/scanning_natioanl_id_back_vector.png')}
                    style={styles.cardOutlineImage}
                />
                <Text style={styles.instructionText}>
                    {t('align_id_back_side_msg')}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.overlay}>
            <Image
                source={require('../../assets/scanning_natioanl_id_front_vector.png')}
                style={styles.cardOutlineImage}
            />
            <Text style={styles.instructionText}>
                {t('align_id_front_side_msg')}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    cardOutlineImage: {
        width: cardWidth,
        height: cardHeight,
        resizeMode: 'contain',
        position: 'absolute',
        top: '30%',
    },
    instructionText: {
        width: '80%',
        bottom: 20,
        lineHeight: 22,
        paddingVertical: 8,
        paddingHorizontal: 50,
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        borderRadius: 10,
        backgroundColor: '#13172295',
    }
});