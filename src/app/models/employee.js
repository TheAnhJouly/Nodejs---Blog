import {createModel} from "./base";
 
export const Employee = createModel("Employee", "employees", {
    password: { 
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null, 
    },
    email: {
        type: String,
        default: null, 
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10,
        unique: true,
    },
    role: {
        type: String,
        default: "Admin",
    },
    status:{
        type: String,
        default: "active",
    },
    resetPasswordToken:{
        type: String,
        default: null,
    },
    resetPasswordExpires:{
        type: Date,
        default: null,
    }
});
