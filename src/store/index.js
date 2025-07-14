import { configureStore } from "@reduxjs/toolkit";
import customizationReducer from "./customizationReducer";
// ==============================|| REDUX - MAIN STORE ||============================== //

const store = configureStore({
	reducer: {
		// Assuming 'reducer' is your root reducer or you can add multiple reducers here
		customization: customizationReducer
	}
});

export { store };
