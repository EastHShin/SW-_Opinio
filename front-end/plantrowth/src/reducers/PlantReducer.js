
import { ADD_PLANT, DELETE_PLANT, UPDATE_PLANT, GET_PLANT_PROFILE, WATER_PLANT, DIAGNOSIS_PLANT,LEVEL_UP } from "../actions/type";

let initialState = {
    profile: {},
    addResult: '',
    deleteResult: '',
    updateResult: '',
    levelUp : false,
    wateringResult: '',
    diagnosisResult: '',

};

function PlantReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PLANT_PROFILE:
            return { ...state, profile: action.payload };
        case ADD_PLANT:
            return { ...state, addResult: action.payload };
        case DELETE_PLANT:
            return { ...state, deleteResult: action.payload };
        case UPDATE_PLANT:
            return { ...state, updateResult: action.payload };
        case LEVEL_UP:
            return {...state, levelUp:action.payload}

        case WATER_PLANT:
            return { ...state, wateringResult: action.payload};
        case DIAGNOSIS_PLANT:
            return { ...state, diagnosisResult: action.payload};
        default:
            return state;
    }
}

export default PlantReducer;