import * as ACTIONS from '../constants/index';

const initState: any = {
  students: [],
  rollStatus: 'all',
};

export default function studentReducer(state: any = initState, action: any): any {
  switch (action.type) {
    case ACTIONS.SET_STUDENTS_STATUS:
      return { ...state, students: action.students || [] };
      case ACTIONS.SET_ATTENDANCE_STATUS:
      let storeStudents = [...state.students];
      let indexOfStudent = storeStudents.findIndex((student: any) => student.id === action.payload.id);
      storeStudents[indexOfStudent].rollState = action.payload.type;
      return { ...state, students: [...storeStudents] };
      case ACTIONS.SET_ATTENDANCE:
        return { ...state, rollStatus: action.payload.type };  
    default:
      return state;
  }
}