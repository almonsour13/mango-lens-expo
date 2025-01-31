import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import * as tf from "@tensorflow/tfjs";
import { classes } from "@/constants/classes";

interface ModelContextType {
    model: tf.LayersModel | null;
    predict:(image:string) => Promise<any>;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);


export function ModelProvider({ children }: { children: ReactNode }) {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const loadModel = async () => {
        setIsLoading(true)
        try {
            const loadedModel = await tf.loadLayersModel("../assets/model/model.json");
            setModel(loadedModel);
            setIsLoading(false);
            console.log("Model is loaded");
        } catch (err) {
            setIsLoading(false);
        }
    }
    useEffect(() => {
       
        loadModel();
    },[])
    const preprocessImage = async (
        imageElement: HTMLImageElement
    ): Promise<tf.Tensor> => {
        return tf.tidy(() => {
            const tensor = tf.browser
                .fromPixels(imageElement)
                .resizeNearestNeighbor([224, 224])
                .expandDims()
                .toFloat()
                .div(255.0);
            return tensor;
        });
    };
    const predict = async (image: string):Promise<any> => {
        try {
            if (!model) {
                console.log("model is not loaded")
                return null
            }
            console.log(image)
            const img = new Image();
            img.src = image;
            const inputTensor = await preprocessImage(img);
            const predictionTensor = model.predict(inputTensor) as tf.Tensor;
            const predictionArray = await predictionTensor.data();
            const predictedClassIndex = predictionArray.indexOf(
                Math.max(...predictionArray)
            );

            const prediction = Array.from(predictionArray).map(
                (prob, idx) => ({
                    diseaseName: classes[idx],
                    likelihoodScore: Number((prob * 100).toFixed(1)),
                })
            ).filter(prob => prob.likelihoodScore > 30);

            return prediction;
            console.log(prediction)
        } catch (error) {
            return null
        }
    }
    return (
        <ModelContext.Provider
            value={{
                model,
                predict
            }}
        >
            {children}
        </ModelContext.Provider>
    );
}

export const useModel = () => {
    const context = React.useContext(ModelContext);
    if (!context) {
        throw new Error("useModel must be used within a ModelProvider");
    }
    return context;
};

