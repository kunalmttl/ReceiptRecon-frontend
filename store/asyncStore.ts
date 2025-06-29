import AsyncStorage from '@react-native-async-storage/async-storage';


export async function saveQRString(qrString: string, PRODUCT_ID: string) {
    await AsyncStorage.setItem(`${PRODUCT_ID}_return_qr_code`, qrString);
}

export async function getQRString(PRODUCT_ID: string) {
    // console.log(PRODUCT_ID);
    
    const qr = await AsyncStorage.getItem(`${PRODUCT_ID}_return_qr_code`);
    // console.log(qr);
    return qr;
}

export async function deleteQRString(PRODUCT_ID: string) {
    await AsyncStorage.removeItem(`${PRODUCT_ID}_return_qr_code`);
}