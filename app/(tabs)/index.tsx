import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import { Platform, StyleSheet, View } from "react-native";

const placeholderImage = require('../../assets/images/background-image.png')
import * as ImagePikcer from "expo-image-picker"
import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/IconButton";
import CircleButton from "@/components/CircleButton";
import EmojiPicker from "@/components/EmojiPicker";
import { type ImageSource } from 'expo-image';
import EmojiList from "@/components/EmojiList";
import EmojiSticker from "@/components/EmojiSticker";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import {captureRef} from 'react-native-view-shot';
import domToImage from 'dom-to-image';

export default function Index() {

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false)
  const [isModalVisible,setIsModalVisible] = useState<boolean>(false)
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  
  useEffect(()=>{
    if(status === null){
      requestPermission()
    }
  },[])

  const pickImageAsync = async () => {
    const imgData = await ImagePikcer.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality:1
    })

    if(!imgData.canceled){
      console.log(imgData.assets[0].uri)
      setSelectedImage(imgData.assets[0].uri)
      setShowAppOptions(true)
    }
    else {
      alert('You did not select any image.');
    }
  }

  const onReset = () => {
    setShowAppOptions(false);
    setPickedEmoji(undefined);
  };

  const onAddSticker = () => {
    setIsModalVisible(true)
  };

  const onSaveImageAsync = async () => {
    if(Platform.OS !== 'web'){
      try{
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        })
  
        await MediaLibrary.saveToLibraryAsync(localUri)
        if(localUri){
          alert('Image saved successfully')
        }
      }
      catch(err){
        console.log(err)
      }
    }
    else{
      
        if(imageRef.current){
          try {
          const dataUrl = await domToImage.toJpeg(imageRef.current as unknown as Node, { 
            quality: 0.95,
            width: 320,
            height: 440
           });
  
           let link = document.createElement('a');
           link.download = 'sticker-smash.jpeg';
           link.href = dataUrl;
           link.click();
        }
        catch(err){
          console.log(err)
        }
      }
    }
    
  };

  const onModalClose = () => {
    setIsModalVisible(false)
  }
  return (
    <GestureHandlerRootView style={styles.container}>
    <View
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
        <ImageViewer imgUrl={placeholderImage} selectedImage={selectedImage}/>
        {pickedEmoji && <EmojiSticker imageSize={40} stickerUrl={pickedEmoji}/>}
        </View>
      </View>
      {
        showAppOptions ? (
          <View style={styles.footerContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker}/>
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync}/>
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
        <Button label="Choose a photo" theme="primary" onPress={pickImageAsync}/>
        <Button label="Use this photo" onPress={()=> setShowAppOptions(true)}/>
      </View>
        )}
      <EmojiPicker
        isVisible={isModalVisible}
        onClose={onModalClose}
        >
          {/* A list of emoji component passed as children prop to emojipicker */}
            <EmojiList onCloseModal={onModalClose} onSelect={setPickedEmoji}/>
          </EmojiPicker>
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    padding: 20
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})
