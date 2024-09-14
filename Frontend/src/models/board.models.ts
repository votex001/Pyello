import { Activity } from "./activities.models";



export interface Label {
    id: string;
    color: string;
    name: string;
}
export interface LabelColorOption {
    color: string;
    bgColor: string;
    hoverdBgColor: string;
    darkFontColor: string;
    lightFontColor: string;
    isCover?: boolean; // Optional, only for certain labels
    brightness?: "light"; // Optional, only for certain labels
}

export interface Board {
    prefs: {
        background: string;
        backgroundColor: string | null;
        backgroundImage: string | null;
        backgroundBrightness: string;
        backgroundImageScaled: string | null;
    };
    members: {
        id: string;
        permissionStatus: string;
        fullName: string;
    }[];
    checkListTaskIds: string[];
    name: string;
    groups: any[]; // Adjust this type based on your actual groups structure
    labels: Label[];
    coverImgs: any[]; // Adjust this type based on the structure of taskCoverImgs
    activities: Activity[];
}