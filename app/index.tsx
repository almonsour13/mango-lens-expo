import { useRef, useState, useCallback, useMemo } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Button,
    Image,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    CameraView,
    type CameraType,
    type FlashMode,
    useCameraPermissions,
} from "expo-camera/build";
import * as ImagePicker from "expo-image-picker";
import HeaderWrapper from "@/components/common/header-wrapper";
import type BottomSheet from "@gorhom/bottom-sheet";
import { ThemedText } from "@/components/ThemedText";
import ImagePreviewDrawer from "@/components/drawer/image-preview";
import CameraStatusIndicator from "@/components/common/CameraStatusIndicator";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Scan() {
    const [facing, setFacing] = useState<CameraType>("back");
    const [flash, setFlash] = useState<FlashMode>("off");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ["50%", "80%"], []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
        if (index === -1) {
            setIsCameraActive(true);
        }
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setIsCameraActive(false);
            bottomSheetRef.current?.snapToIndex(0);
        }
    };

    const capture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (!photo) return;
                setSelectedImage(photo.uri);
                setIsCameraActive(false);
                bottomSheetRef.current?.snapToIndex(0);
            } catch (error) {
                console.error("Failed to capture photo:", error);
            }
        }
    };

    const switchCam = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const toggleFlash = () => {
        setFlash((current) => (current === "off" ? "on" : "off"));
    };

    const handleRetake = () => {
        setSelectedImage(null);
        setIsCameraActive(true);
        bottomSheetRef.current?.close();
    };

    if (!permission?.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Text>Camera access is required</Text>
                    <Button
                        title="Grant Permission"
                        onPress={requestPermission}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.container}>
                <HeaderWrapper>
                    <TouchableOpacity>
                        <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <ThemedText>Camera</ThemedText>
                    <TouchableOpacity onPress={toggleFlash}>
                        {flash === "off" ? (
                            <Ionicons
                                name="flash-outline"
                                size={24}
                                color="black"
                            />
                        ) : (
                            <Ionicons
                                name="flash-off-outline"
                                size={24}
                                color="black"
                            />
                        )}
                    </TouchableOpacity>
                </HeaderWrapper>
                <View style={styles.camContainer}>
                    {isCameraActive ? (
                        <CameraView
                            style={styles.camera}
                            facing={facing}
                            flash={flash}
                            ref={cameraRef}
                        >
                            <CameraStatusIndicator
                                facing={facing}
                                flash={flash}
                            />
                        </CameraView>
                    ) : (
                        <View style={styles.previewBackground}>
                            {selectedImage && (
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={styles.fullPreviewImage}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonContainerInner}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={pickImage}
                        >
                            <Feather name="image" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={capture}
                        >
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={switchCam}
                        >
                            <MaterialIcons
                                name="flip-camera-android"
                                size={24}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <ImagePreviewDrawer
                    bottomSheetRef={bottomSheetRef}
                    snapPoints={snapPoints}
                    handleSheetChanges={handleSheetChanges}
                    selectedImage={selectedImage}
                    handleRetake={handleRetake}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    camContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
        position: "relative",
    },
    previewBackground: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },
    fullPreviewImage: {
        width: "100%",
        height: "100%",
    },
    buttonContainer: {
        height: 120,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    buttonContainerInner: {
        height: "100%",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    captureButton: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    captureButtonInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#fff",
    },
});
