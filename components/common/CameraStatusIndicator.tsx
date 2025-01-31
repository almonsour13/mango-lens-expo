import type React from "react"
import { View, StyleSheet } from "react-native"
import { ThemedText } from "@/components/ThemedText"

interface CameraStatusIndicatorProps {
  facing: "front" | "back"
  flash: "on" | "off" | "auto"
}

const CameraStatusIndicator: React.FC<CameraStatusIndicatorProps> = ({ facing, flash }) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.statusText}>
        Camera: {facing === "back" ? "Rear" : "Front"} | Flash: {flash === "on" ? "On" : "Off"}
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
})

export default CameraStatusIndicator

