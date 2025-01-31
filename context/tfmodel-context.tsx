import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

interface TFModelContextType {
    predict: (image: string) => Promise<any>;
}

const ModelContext = createContext<TFModelContextType | undefined>(undefined);

export function TFModelProvider({ children }: { children: ReactNode }) {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const modelJson = require("../assets/model/model.json");
    // const modelWeights = require("../assets/model/model_weights.bin");


    const loadModel = useCallback(async () => {
        try {
            await tf.ready();
            //  const loadedModel = await tf.loadLayersModel(modelJson)
            //  console.log(loadedModel)
            // const modelWeights = [
            //     require('../assets/model/group1-shard1of3.bin'),
            //     require('../assets/model/group1-shard2of3.bin'),
            //     require('../assets/model/group1-shard3of3.bin'),
            // ];
            // const loadedModel = await tf.loadLayersModel(
            //     bundleResourceIO(modelJson, modelWeights)
            // ).catch(e => console.log(e));

            // setModel(loadedModel);

        } catch (err) {
            console.error("Model loading failed:", err);
            setIsLoading(false);
        }
    }, []);
    const predict = async () => {
        
    }
    useEffect(() => {
        loadModel();
    }, []);
    
    return (
        <ModelContext.Provider
            value={{
                predict
            }}
        >
            {children}
        </ModelContext.Provider>
    );
}
export const useTFModel = () => {
    const context = React.useContext(ModelContext);
    if (!context) {
        throw new Error("useModel must be used within a ModelProvider");
    }
    return context;
};
