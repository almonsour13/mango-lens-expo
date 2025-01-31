import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function HeaderWrapper({ children }: { children: ReactNode }) {
    return (
        <View style={styles.header}>
            <View style={styles.HeaderInner}>{children}</View>
        </View>
    );
}
const styles = StyleSheet.create({
    header: {
        height: 68,
        alignItems: "center",
        paddingHorizontal: 16,
    },
    HeaderInner: {
        height: "100%",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});
