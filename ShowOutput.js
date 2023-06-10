import { styles } from "./styles";
import { ScrollView, View, Text } from "react-native";

export default ShowOutput = ({ output, progress }) => {
    return (
        <View>
            <Text style={styles.progressText}>{ progress }</Text>
            <ScrollView style={styles.outputContainer}>
                <Text>{output.length > 0 && output}</Text>
            </ScrollView>
        </View>
    );
}