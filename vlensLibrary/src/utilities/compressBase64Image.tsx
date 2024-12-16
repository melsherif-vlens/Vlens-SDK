import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const compressBase64Image = async (base64Image: string): Promise<string> => {
    try {
      // Decode base64 to a temporary file
      const tempPath = RNFS.TemporaryDirectoryPath;
      const imagePath = tempPath +'image.jpg';
      await RNFS.writeFile(imagePath, base64Image, 'base64');
  
      // Resize the image
      const resizedImage = await ImageResizer.createResizedImage(
        imagePath, // Image path
        800,       // Max width
        800,       // Max height
        'JPEG',    // Image format
        80,        // Quality (0-100)
      );
  
      // Read resized image back to Base64
      console.log('file path:', resizedImage.uri);
      const normalizedPath = Platform.OS === 'ios' ? resizedImage.uri : resizedImage.uri.replace('file://', '');
      const compressedBase64 = await RNFS.readFile(normalizedPath, 'base64');

      // // Delete temporary files
      // await RNFS.unlink(imagePath);
  
      return compressedBase64;
    } catch (error) {
      console.log('Error compressing image:', error);
      return base64Image;
      //throw error;
    }
  };
  
  export default compressBase64Image;