import { Image, type ImageSource } from "expo-image";
import { View } from "react-native";
import Animated, {useAnimatedStyle,useSharedValue,withSpring} from "react-native-reanimated"
import { Gesture,GestureDetector } from "react-native-gesture-handler";

type EmojiStickerProps = {
    imageSize: number;
    stickerUrl: ImageSource
}
export default function EmojiSticker({imageSize,stickerUrl}:EmojiStickerProps) {
    const scaleImage = useSharedValue(imageSize)
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const doubleTab = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            if(scaleImage.value !== imageSize * 2) {
                scaleImage.value = scaleImage.value * 2
            }
            else{
                scaleImage.value = Math.round(scaleImage.value / 2);
            }
        })

    const drag = Gesture.Pan()
        .onChange(event => {
            translateX.value += event.changeX
            translateY.value += event.changeY
        })

        const containerStyle = useAnimatedStyle(() => {
            return {
              transform: [
                {
                  translateX: translateX.value,
                },
                {
                  translateY: translateY.value,
                },
              ],
            };
          });
    
    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value)
        }
    })

    return (
        <GestureDetector gesture={drag}>
        <Animated.View style={[containerStyle,{top:'-50%',left:'30%'}]}>
            <GestureDetector gesture={doubleTab}>
                <Animated.Image 
                    resizeMode={'contain'} 
                    source={stickerUrl} 
                    style={[imageStyle,{width:imageSize,height:imageSize}]} 
                    />
            </GestureDetector>
        </Animated.View>
        </GestureDetector>
    )
}