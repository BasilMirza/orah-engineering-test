import { Person } from 'shared/models/person';
import * as constants from '../constants';

export function setStudents(students?: Person[]) {
    return {
        type: constants.SET_STUDENTS_STATUS,
        students
    };
}
export function setAttendance(type:string) {
    return {
        type: constants.SET_ATTENDANCE,
        payload: { type }
    };
}

export function setAttendanceStatus(type:string, id:number) {
    return {
        type: constants.SET_ATTENDANCE_STATUS,
        payload: { type, id }
    };
}

export function setRollStatus(type: string): any {
  throw new Error("Function not implemented.");
}

