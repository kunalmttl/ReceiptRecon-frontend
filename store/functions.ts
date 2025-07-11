import base64 from "base-64";
import utf8 from "utf8";
import { readAsStringAsync } from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator"

async function getVideoThumbnailAsBase64(imageUri: string) {
    try {
      const fileContent = await readAsStringAsync(imageUri);
      const bytes = utf8.encode(fileContent);
      const base64String = base64.encode(bytes);
      return base64String;
    } catch (e) {
      console.error("Error generating thumbnail:", e);
      return null;
    }
}

export default async function compressImage(imagURI: string){
    if(!imagURI){
        console.error("no uri found while compressing.");
        return;
    }
    try {
        const compressed = await ImageManipulator.manipulateAsync(imagURI, [], {
            compress: 0.5,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true
        });
        // console.log("Compressed base64 length:", compressed.base64!.length);
        return compressed.base64;
    } catch (error) {   
        console.log(error);
        return;
    }
}