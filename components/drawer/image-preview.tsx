import type React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ThemedText } from "@/components/ThemedText";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
// import { useModel } from "@/context/model-context";

interface ImagePreviewDrawerProps {
    bottomSheetRef: React.RefObject<BottomSheet>;
    snapPoints: string[];
    handleSheetChanges: (index: number) => void;
    selectedImage: string | null;
    handleRetake: () => void;
}

const ImagePreviewDrawer: React.FC<ImagePreviewDrawerProps> = ({
    bottomSheetRef,
    snapPoints,
    handleSheetChanges,
    selectedImage,
    handleRetake,
}) => {
    const [isScanning, setIsScanning] = useState(false);
    // const {predict} = useModel();

    const handleScan = async () => {
        setIsScanning(true)
        try {
            if(!selectedImage) return
            console.log("analyzing...")
            // const res = await predict(selectedImage)
            // if(res){
            //     console.log(res)
            // }
            setIsScanning(false)
        } catch (error) {
            
        }
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            handleComponent={() => (
                <View style={styles.bottomSheetHandle}>
                    <View style={styles.handleBar} />
                </View>
            )}
            backgroundStyle={styles.bottomSheetBackground}
        >
            <BottomSheetView style={styles.contentContainer}>
                {selectedImage && (
                    <View style={styles.previewContainer}>
                        <View style={styles.previewImageContainer}>
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.previewImage}
                            />
                            <TouchableOpacity style={styles.closeButton} 
                                onPress={handleRetake}>
                                <Feather name="x" size={24} color="white"/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                style={styles.scanButton}
                                activeOpacity={0.8}
                                onPress={handleScan}
                            >
                                <ThemedText style={styles.scanButtonText}>
                                    {isScanning?"Scanning...":"Scan"}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetHandle: {
        backgroundColor: "white",
        paddingVertical: 12,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    bottomSheetBackground: {
        backgroundColor: "white",
    },
    handleBar: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#00000020",
        alignSelf: "center",
    },
    contentContainer: {
        flex: 1,
    },
    previewContainer: {
        flex: 1,
        // gap: 16,
    },
    previewImageContainer: {
        flex: 1,
        position: "relative",
        paddingHorizontal:16
    },
    previewImage: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    closeButton:{
        position:"absolute",
        top:8,
        right:24,
        height:32,
        width:32,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        borderRadius: 35,
    },
    actionContainer: {
        gap: 12,
        marginTop: "auto",
        padding: 16,
    },
    scanButton: {
        width: "100%",
        backgroundColor: "green",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    scanButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    retakeButton: {
        width: "100%",
        backgroundColor: "#F2F2F7",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    retakeButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default ImagePreviewDrawer;
