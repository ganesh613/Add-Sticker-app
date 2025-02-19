import { Image } from "expo-image";
import { StyleSheet } from "react-native";

type ImageViewerProps = {
    imgUrl: string;
    selectedImage?: string;
}
export default function ImageViewer({imgUrl,selectedImage}:ImageViewerProps){
    const imgSource = selectedImage ? {uri: selectedImage} : imgUrl
    return (
        <Image source={imgSource} style={styles.image}/>
    )
}

const styles = StyleSheet.create({
    image: {
      width: 320,
      height: 440,
      borderRadius: 18,
    },
  });